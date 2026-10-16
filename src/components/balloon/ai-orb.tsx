import { useEffect, useRef } from "react";

// A real, low-poly WebGL sphere: no image/model download and no 3D library.
export function AIOrb({ paused = false }: { paused?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    if (!gl) return;
    const context = gl;
    const shaders: WebGLShader[] = [];
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let frame = 0;
    const media = matchMedia("(prefers-reduced-motion: reduce)");

    function compile(type: number, source: string) {
      const shader = context.createShader(type)!;
      shaders.push(shader);
      context.shaderSource(shader, source);
      context.compileShader(shader);
      if (!context.getShaderParameter(shader, context.COMPILE_STATUS))
        throw new Error("orb_shader");
      return shader;
    }
    try {
      const vertex = compile(
        context.VERTEX_SHADER,
        `
        attribute vec3 position; uniform float time; varying vec3 normal; varying vec3 surface;
        void main() {
          float a = time * .17; float c = cos(a), s = sin(a);
          mat3 rotation = mat3(c,0.,s, 0.,1.,0., -s,0.,c);
          vec3 p = rotation * position;
          float flow = sin(p.y*7. + time*.4) * cos(p.x*5. - time*.3);
          vec3 displaced = p * (1. + .018*flow);
          normal = normalize(p + .055*vec3(flow, sin(p.z*8.+time*.35), 0.));
          surface = displaced;
          gl_Position = vec4(displaced.xy*.87, -displaced.z*.4, 1.);
        }`,
      );
      const fragment = compile(
        context.FRAGMENT_SHADER,
        `
        precision mediump float; varying vec3 normal; varying vec3 surface;
        void main() {
          vec3 n = normalize(normal); vec3 light = normalize(vec3(-.7,.8,1.3));
          float diffuse = max(dot(n, light),0.);
          vec3 reflected = reflect(vec3(0.,0.,-1.), n);
          float silk = smoothstep(.55,.9,sin(reflected.y*5. + reflected.x*2.));
          float shine = pow(max(dot(reflect(-light,n),vec3(0.,0.,1.)),0.),32.);
          vec3 gold = mix(vec3(.55,.30,.105), vec3(.95,.75,.38), .32+.68*diffuse);
          gold = mix(gold,vec3(1.,.94,.77),silk*.47);
          gold += shine*.5;
          float edge = pow(1.-max(n.z,0.),3.);
          gold = mix(gold,vec3(.72,.48,.22),edge*.38);
          gl_FragColor = vec4(gold,1.);
        }`,
      );
      program = context.createProgram()!;
      context.attachShader(program, vertex);
      context.attachShader(program, fragment);
      context.linkProgram(program);
      if (!context.getProgramParameter(program, context.LINK_STATUS))
        throw new Error("orb_program");
      const vertices: number[] = [];
      const point = (lat: number, lon: number) => {
        const a = (lat / 24) * Math.PI,
          b = (lon / 36) * Math.PI * 2;
        vertices.push(Math.sin(a) * Math.cos(b), Math.cos(a), Math.sin(a) * Math.sin(b));
      };
      for (let lat = 0; lat < 24; lat++)
        for (let lon = 0; lon < 36; lon++) {
          point(lat, lon);
          point(lat + 1, lon);
          point(lat, lon + 1);
          point(lat, lon + 1);
          point(lat + 1, lon);
          point(lat + 1, lon + 1);
        }
      buffer = context.createBuffer();
      context.bindBuffer(context.ARRAY_BUFFER, buffer);
      context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertices), context.STATIC_DRAW);
      context.useProgram(program);
      const position = context.getAttribLocation(program, "position");
      context.enableVertexAttribArray(position);
      context.vertexAttribPointer(position, 3, context.FLOAT, false, 0, 0);
      const time = context.getUniformLocation(program, "time");
      context.enable(context.DEPTH_TEST);
      context.clearColor(0, 0, 0, 0);
      const render = (t: number) => {
        const size = Math.round(64 * Math.min(devicePixelRatio || 1, 2));
        if (canvas.width !== size) {
          canvas.width = size;
          canvas.height = size;
          context.viewport(0, 0, size, size);
        }
        context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
        context.uniform1f(time, t / 1000);
        context.drawArrays(context.TRIANGLES, 0, vertices.length / 3);
      };
      let last = 0;
      const tick = (t: number) => {
        if (t - last >= 33) {
          render(t);
          last = t;
        }
        frame = requestAnimationFrame(tick);
      };
      const update = () => {
        cancelAnimationFrame(frame);
        render(media.matches ? 0 : performance.now());
        if (
          !paused &&
          !media.matches &&
          !document.hidden &&
          document.querySelector<HTMLElement>(".site-liquid-backdrop")?.dataset["motion"] !== "off"
        )
          frame = requestAnimationFrame(tick);
      };
      const lost = (event: Event) => {
        event.preventDefault();
        cancelAnimationFrame(frame);
        canvas.dataset["ready"] = "false";
      };
      canvas.addEventListener("webglcontextlost", lost);
      document.addEventListener("visibilitychange", update);
      media.addEventListener("change", update);
      document.addEventListener("bce:motionchange", update);
      canvas.dataset["ready"] = "true";
      update();
      return () => {
        cancelAnimationFrame(frame);
        document.removeEventListener("visibilitychange", update);
        media.removeEventListener("change", update);
        document.removeEventListener("bce:motionchange", update);
        canvas.removeEventListener("webglcontextlost", lost);
        if (buffer) context.deleteBuffer(buffer);
        if (program) context.deleteProgram(program);
        shaders.forEach((shader) => context.deleteShader(shader));
      };
    } catch {
      if (buffer) context.deleteBuffer(buffer);
      if (program) context.deleteProgram(program);
      shaders.forEach((shader) => context.deleteShader(shader));
    }
    return undefined;
  }, [paused]);
  return (
    <span className="bce-ai-sphere" aria-hidden="true">
      <canvas ref={canvasRef} />
      <span className="bce-ai-monogram">AI</span>
    </span>
  );
}

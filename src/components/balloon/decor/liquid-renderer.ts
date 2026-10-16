import { liquidFragment } from "./liquid-shader";

type Uniforms = Record<
  "resolution" | "time" | "phase" | "scene" | "island" | "radii",
  WebGLUniformLocation | null
>;
type Surface = {
  scope: HTMLElement;
  canvas: HTMLCanvasElement;
  photo: HTMLElement | null;
  gl: WebGLRenderingContext | null;
  program: WebGLProgram | null;
  buffer: WebGLBuffer | null;
  uniforms?: Uniforms;
  time: number;
  phase: number;
  frame: number;
  disabled: boolean;
  dirty: boolean;
};
const vertex =
  "attribute vec2 aPosition;varying vec2 vUv;void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}";

/** Scoped, disposable port of the approved renderer. Never reads/writes the page's root styles. */
export function mountLiquidSurfaces(root: HTMLElement): () => void {
  if (!("WebGLRenderingContext" in window)) return () => {};
  const states: Surface[] = Array.from(
    root.querySelectorAll<HTMLElement>(".section-scope"),
  ).flatMap((scope, index) => {
    const canvas = scope.querySelector<HTMLCanvasElement>(".liquid-gold-canvas");
    return canvas
      ? [
          {
            scope,
            canvas,
            photo: scope.querySelector<HTMLElement>(".chapter-image"),
            gl: null,
            program: null,
            buffer: null,
            time: (index + 1) * 2.7,
            phase: (index + 1) * 0.9,
            frame: 0,
            disabled: false,
            dirty: true,
          },
        ]
      : [];
  });
  let request = 0,
    last = 0,
    disposed = false;
  const removers: (() => void)[] = [];
  const allowed = () => !disposed && root.dataset["motion"] === "on" && !document.hidden;
  function fallback(state: Surface) {
    state.disabled = true;
    state.scope.classList.remove("liquid-ready");
    state.canvas.dataset["renderer"] = "fallback";
  }
  function compile(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
  function init(state: Surface): boolean {
    try {
      const gl = state.canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: "low-power",
      });
      if (!gl) {
        fallback(state);
        return false;
      }
      state.gl = gl;
      const high = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      const fragment =
        high && high.precision > 0
          ? liquidFragment.replace("precision mediump float;", "precision highp float;")
          : liquidFragment;
      const vs = compile(gl, gl.VERTEX_SHADER, vertex),
        fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
      if (!vs || !fs) {
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        fallback(state);
        return false;
      }
      const program = gl.createProgram();
      if (!program) {
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        fallback(state);
        return false;
      }
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        fallback(state);
        return false;
      }
      state.program = program;
      gl.useProgram(program);
      const buffer = gl.createBuffer();
      state.buffer = buffer;
      if (!buffer) {
        fallback(state);
        return false;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );
      const attribute = gl.getAttribLocation(program, "aPosition");
      gl.enableVertexAttribArray(attribute);
      gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
      state.uniforms = {
        resolution: gl.getUniformLocation(program, "uResolution"),
        time: gl.getUniformLocation(program, "uTime"),
        phase: gl.getUniformLocation(program, "uPhase"),
        scene: gl.getUniformLocation(program, "uSceneSize"),
        island: gl.getUniformLocation(program, "uIsland"),
        radii: gl.getUniformLocation(program, "uIslandRadii"),
      };
      state.dirty = true;
      state.scope.classList.add("liquid-ready");
      state.canvas.dataset["renderer"] = "webgl";
      return true;
    } catch {
      fallback(state);
      return false;
    }
  }
  function geometry(state: Surface) {
    if (!state.photo) return { box: [0, 0, 0, 0], radii: [0, 0, 0, 0] };
    let left = 0,
      top = 0,
      node: HTMLElement | null = state.photo;
    while (node && node !== state.scope) {
      left += node.offsetLeft;
      top += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    const style = getComputedStyle(state.photo);
    return {
      box: [left, top, state.photo.offsetWidth, state.photo.offsetHeight],
      radii: [
        style.borderTopLeftRadius,
        style.borderTopRightRadius,
        style.borderBottomRightRadius,
        style.borderBottomLeftRadius,
      ].map((v) => parseFloat(v) || 0),
    };
  }
  function draw(state: Surface, dt: number) {
    if (!state.gl && !init(state)) return false;
    const { gl, program, uniforms } = state;
    if (!gl || !program || !uniforms) return false;
    const rect = state.scope.getBoundingClientRect();
    const width = Math.max(1, Math.min(800, Math.round(rect.width * 0.7)));
    const height = Math.max(1, Math.min(900, Math.round(rect.height * 0.6)));
    if (state.canvas.width !== width || state.canvas.height !== height) {
      state.canvas.width = width;
      state.canvas.height = height;
      gl.viewport(0, 0, width, height);
      state.dirty = true;
    }
    state.time += dt;
    gl.useProgram(program);
    gl.uniform2f(uniforms.resolution, width, height);
    gl.uniform1f(uniforms.time, state.time);
    gl.uniform1f(uniforms.phase, state.phase);
    gl.uniform2f(uniforms.scene, state.scope.clientWidth, state.scope.clientHeight);
    if (state.dirty) {
      const island = geometry(state);
      gl.uniform4fv(uniforms.island, island.box);
      gl.uniform4fv(uniforms.radii, island.radii);
      state.canvas.dataset["shoreline"] = state.photo ? "active" : "none";
      state.dirty = false;
    }
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    state.canvas.dataset["frame"] = String(++state.frame);
    return true;
  }
  function tick(now: number) {
    request = 0;
    if (!allowed()) {
      last = 0;
      return;
    }
    const visible = states.filter((s) => !s.disabled && s.scope.dataset["inview"] === "true");
    if (!visible.length) {
      last = 0;
      return;
    }
    if (last && now - last < 33) {
      request = requestAnimationFrame(tick);
      return;
    }
    const dt = last ? Math.min((now - last) / 1000, 0.12) : 0;
    last = now;
    let painted = false;
    visible.forEach((s) => {
      painted = draw(s, dt) || painted;
    });
    if (painted) request = requestAnimationFrame(tick);
    else last = 0;
  }
  function wake() {
    if (!allowed()) {
      cancelAnimationFrame(request);
      request = 0;
      last = 0;
      return;
    }
    if (!request) {
      last = 0;
      request = requestAnimationFrame(tick);
    }
  }
  function layout() {
    states.forEach((s) => {
      s.dirty = true;
    });
    wake();
  }
  function suspend() {
    cancelAnimationFrame(request);
    request = 0;
    last = 0;
  }
  states.forEach((state) => {
    const lost = (event: Event) => {
      event.preventDefault();
      fallback(state);
      state.gl = null;
      state.program = null;
      state.buffer = null;
    };
    const restored = () => {
      if (!disposed) {
        state.disabled = false;
        state.gl = null;
        wake();
      }
    };
    state.canvas.addEventListener("webglcontextlost", lost);
    state.canvas.addEventListener("webglcontextrestored", restored);
    removers.push(() => {
      state.canvas.removeEventListener("webglcontextlost", lost);
      state.canvas.removeEventListener("webglcontextrestored", restored);
    });
  });
  root.addEventListener("bce:motionchange", wake);
  root.addEventListener("bce:shoreline-layout", layout);
  window.addEventListener("resize", layout, { passive: true });
  window.addEventListener("pagehide", suspend);
  window.addEventListener("pageshow", wake);
  wake();
  return () => {
    disposed = true;
    suspend();
    removers.forEach((remove) => remove());
    root.removeEventListener("bce:motionchange", wake);
    root.removeEventListener("bce:shoreline-layout", layout);
    window.removeEventListener("resize", layout);
    window.removeEventListener("pagehide", suspend);
    window.removeEventListener("pageshow", wake);
    states.forEach((s) => {
      s.scope.classList.remove("liquid-ready");
      if (s.gl) {
        s.gl.deleteBuffer(s.buffer);
        s.gl.deleteProgram(s.program);
        s.gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
    });
  };
}

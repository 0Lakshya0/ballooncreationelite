import { useEffect, useId, useRef } from "react";
import "./ai-bloon.css";

// Owner's exact SVG paths, gradients, ten greetings and animation timings.
// Visual-only: no fetch, canvas, generated greetings or provider configuration.
const GREETINGS = [
  "Hey! What are we celebrating?",
  "Hello—what mood are you imagining?",
  "Welcome! How should guests feel?",
  "Calm and elegant, or bold and bright?",
  "What would make this feel like your day?",
  "Need ideas to help guests feel at ease?",
  "Want to shape the mood with light and colour?",
  "Planning a moment that matters?",
  "Let’s create a warm, memorable welcome.",
  "Tell me your vision; I’ll help refine it.",
];

export function AIOrb({ paused = false }: { paused?: boolean }) {
  const prefix = `bce-bloon-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const rootRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const nextGreeting = useRef(0);
  useEffect(() => {
    const root = rootRef.current,
      bubble = bubbleRef.current;
    const host = root?.closest("button");
    if (!root || !bubble || !host) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let hovered = false,
      focused = false,
      moving = false;
    const description = host.getAttribute("aria-describedby") || "";
    host.setAttribute("aria-describedby", `${description} ${bubble.id}`.trim());
    function resetEyes() {
      root!.style.setProperty("--x", "0px");
      root!.style.setProperty("--y", "0px");
    }
    function hide() {
      root!.dataset["greeting"] = "false";
      bubble!.setAttribute("aria-hidden", "true");
      resetEyes();
    }
    function show() {
      if (paused) return;
      bubble!.textContent = GREETINGS[nextGreeting.current++ % GREETINGS.length]!;
      root!.style.setProperty(
        "--bloon-bubble-top",
        root!.getBoundingClientRect().top < 48 ? "18px" : "-6px",
      );
      root!.dataset["greeting"] = "true";
      bubble!.setAttribute("aria-hidden", "false");
    }
    function updateMotion() {
      let storedPause = false;
      try {
        storedPause = localStorage.getItem("bce-site-motion") === "off";
      } catch {
        /* Optional storage. */
      }
      moving =
        !paused &&
        !media.matches &&
        !document.hidden &&
        !storedPause &&
        document.querySelector<HTMLElement>(".site-liquid-backdrop")?.dataset["motion"] !== "off";
      root!.dataset["motion"] = moving ? "on" : "off";
      if (!moving) resetEyes();
      if (paused) hide();
    }
    function look(event: PointerEvent) {
      if (!moving || event.pointerType === "touch") return;
      const r = root!.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      root!.style.setProperty(
        "--x",
        (clamp((event.clientX - r.left - r.width / 2) / (r.width / 2)) * 1.4).toFixed(2) + "px",
      );
      root!.style.setProperty(
        "--y",
        (clamp((event.clientY - r.top - r.height / 2) / (r.height / 2)) * 1.4).toFixed(2) + "px",
      );
    }
    function enter(event: PointerEvent) {
      if (event.pointerType === "touch" || paused) return;
      hovered = true;
      look(event);
      show();
    }
    function leave() {
      hovered = false;
      resetEyes();
      if (!focused) hide();
    }
    function focus() {
      focused = true;
      if (!hovered) show();
    }
    function blur() {
      focused = false;
      if (!hovered) hide();
    }
    function key(event: KeyboardEvent) {
      if (event.key === "Escape") hide();
    }
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointermove", look);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("focus", focus);
    host.addEventListener("blur", blur);
    host.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", updateMotion);
    document.addEventListener("bce:motionchange", updateMotion);
    media.addEventListener("change", updateMotion);
    updateMotion();
    return () => {
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointermove", look);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("focus", focus);
      host.removeEventListener("blur", blur);
      host.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", updateMotion);
      document.removeEventListener("bce:motionchange", updateMotion);
      media.removeEventListener("change", updateMotion);
      host.setAttribute(
        "aria-describedby",
        (host.getAttribute("aria-describedby") || "")
          .split(/\s+/)
          .filter((id) => id !== bubble.id)
          .join(" "),
      );
      hide();
    };
  }, [paused, prefix]);
  return (
    <span className="bce-ai-bloon" ref={rootRef} data-motion="off" data-greeting="false">
      <span className="bce-ai-mascot-visual">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          focusable="false"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={`${prefix}-head`} cx="30%" cy="20%" r="90%">
              <stop offset="0%" stopColor="#fff6f0" />
              <stop offset="20%" stopColor="#f7d9cb" />
              <stop offset="46%" stopColor="#e3a996" />
              <stop offset="72%" stopColor="#bd7a6c" />
              <stop offset="100%" stopColor="#7d4a4f" />
            </radialGradient>
            <linearGradient id={`${prefix}-rim`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff8f2" stopOpacity="0.1" />
              <stop offset="55%" stopColor="#fff8f2" stopOpacity="0" />
              <stop offset="100%" stopColor="#4e2c36" stopOpacity="0.28" />
            </linearGradient>
            <linearGradient id={`${prefix}-visor`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b3040" />
              <stop offset="100%" stopColor="#1f1a25" />
            </linearGradient>
            <linearGradient id={`${prefix}-suit`} x1="10%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#5a4656" />
              <stop offset="55%" stopColor="#3f3240" />
              <stop offset="100%" stopColor="#2a222c" />
            </linearGradient>
            <linearGradient id={`${prefix}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f6e2b8" />
              <stop offset="100%" stopColor="#b98d55" />
            </linearGradient>
            <filter id={`${prefix}-glow`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="0.9" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id={`${prefix}-clip`}>
              <path d="M50 3.5 C33.4 3.5 21 16.6 21 32.6 C21 46.6 30.2 56.6 43 60.2 L50 61.8 L57 60.2 C69.8 56.6 79 46.6 79 32.6 C79 16.6 66.6 3.5 50 3.5 Z" />
            </clipPath>
          </defs>
          <g className="bce-ai-left-arm">
            <path
              d="M40.5 72 C36 75 33 79.5 31.5 84.5"
              fill="none"
              stroke="#3a2e3b"
              strokeLinecap="round"
              strokeWidth="5.6"
            />
            <circle cx="31.2" cy="86" r="3.5" fill="#fffaf3" stroke="#c7ae94" strokeWidth="0.9" />
          </g>
          <g className="bce-ai-right-rest">
            <path
              d="M59.5 72 C64 75 67 79.5 68.5 84.5"
              fill="none"
              stroke="#3a2e3b"
              strokeLinecap="round"
              strokeWidth="5.6"
            />
            <circle cx="68.8" cy="86" r="3.5" fill="#fffaf3" stroke="#c7ae94" strokeWidth="0.9" />
          </g>
          <path
            className="bce-ai-torso"
            d="M40 69.2 C36.6 75 36.2 84.5 38.2 92 C45 96.2 55 96.2 61.8 92 C63.8 84.5 63.4 75 60 69.2 C56 66.6 44 66.6 40 69.2Z"
            fill={`url(#${prefix}-suit)`}
            stroke="#241d26"
            strokeOpacity="0.55"
            strokeWidth="0.8"
          />
          <path d="M44.6 67.8 L50 79.5 L55.4 67.8 C53.6 67.3 46.4 67.3 44.6 67.8Z" fill="#fbf4ec" />
          <path
            d="M44.6 67.8 L50 79.5 L46.6 84 L41.6 71Z M55.4 67.8 L50 79.5 L53.4 84 L58.4 71Z"
            fill="#4f3e4d"
            stroke="#2a222c"
            strokeOpacity="0.5"
            strokeWidth="0.5"
          />
          <path
            d="M45.6 66.6 L50 68.9 L45.6 71.2Z M54.4 66.6 L50 68.9 L54.4 71.2Z"
            fill={`url(#${prefix}-gold)`}
          />
          <circle cx="50" cy="68.9" r="1.25" fill="#e9cf9c" />
          <circle cx="56.4" cy="77.4" r="1.45" fill={`url(#${prefix}-gold)`} />
          <path d="M56.4 78.85 L56.4 80.4" stroke="#d9bb85" strokeWidth="0.45" />
          <path d="M47.2 61.2 L52.8 61.2 L51.6 64.6 L48.4 64.6Z" fill="#a8665f" />
          <path
            className="bce-ai-balloon-body"
            d="M50 3.5 C33.4 3.5 21 16.6 21 32.6 C21 46.6 30.2 56.6 43 60.2 L50 61.8 L57 60.2 C69.8 56.6 79 46.6 79 32.6 C79 16.6 66.6 3.5 50 3.5 Z"
            fill={`url(#${prefix}-head)`}
            stroke="#8a5552"
            strokeOpacity="0.45"
            strokeWidth="1"
          />
          <path
            d="M50 3.5 C33.4 3.5 21 16.6 21 32.6 C21 46.6 30.2 56.6 43 60.2 L50 61.8 L57 60.2 C69.8 56.6 79 46.6 79 32.6 C79 16.6 66.6 3.5 50 3.5 Z"
            fill={`url(#${prefix}-rim)`}
          />
          <g clipPath={`url(#${prefix}-clip)`}>
            <path
              d="M32 12.5 C26.8 17.6 24.4 23.6 24.2 30 C24.2 31.8 26.2 31.9 26.6 30 C27.6 24.6 30.2 19.6 34.6 15.6 C36.6 13.8 33.8 10.8 32 12.5Z"
              fill="#fffaf6"
              opacity="0.7"
            />
            <ellipse
              cx="39"
              cy="9.6"
              rx="4.6"
              ry="1.5"
              transform="rotate(-20 39 9.6)"
              fill="#fffaf6"
              opacity="0.75"
            />
          </g>
          <rect
            x="28.2"
            y="20.5"
            width="43.6"
            height="28"
            rx="14"
            fill={`url(#${prefix}-visor)`}
            stroke="#fbe6da"
            strokeOpacity="0.75"
            strokeWidth="1.1"
          />
          <path
            d="M34 24.6 C40 22.6 60 22.6 66 24.6"
            fill="none"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeWidth="1.1"
            opacity="0.16"
          />
          <g className="bce-ai-cheeks">
            <ellipse cx="34.6" cy="41.4" rx="3" ry="1.6" fill="#f08f86" opacity="0.5" />
            <ellipse cx="65.4" cy="41.4" rx="3" ry="1.6" fill="#f08f86" opacity="0.5" />
          </g>
          <g className="bce-ai-eyes" filter={`url(#${prefix}-glow)`}>
            <g className="bce-ai-pupils">
              <rect x="39.4" y="28.4" width="5.6" height="9.8" rx="2.8" fill="#fff4df" />
              <rect x="55" y="28.4" width="5.6" height="9.8" rx="2.8" fill="#fff4df" />
            </g>
            <path
              className="bce-ai-happy-eyes"
              d="M39 34.6 Q42.2 29.8 45.4 34.6 M54.6 34.6 Q57.8 29.8 61 34.6"
              fill="none"
              stroke="#fff4df"
              strokeLinecap="round"
              strokeWidth="2.2"
            />
            <path
              className="bce-ai-smile"
              d="M45.6 41.6 Q50 45.2 54.4 41.6"
              fill="none"
              stroke="#ffe7d0"
              strokeLinecap="round"
              strokeWidth="1.7"
            />
          </g>
          <g className="bce-ai-wave-arm">
            <path
              d="M59.5 72 C66.5 70 72 64 75.6 57.6"
              fill="none"
              stroke="#3a2e3b"
              strokeLinecap="round"
              strokeWidth="5.6"
            />
            <g className="bce-ai-wave-hand">
              <path
                d="M76 57 C72.8 54.5 72 51.4 74 49.1 C75.8 47.1 78.1 48.8 79.2 51.7 L81.3 44.4 C82.1 41.3 85.1 42 85.2 45 L84.5 50.8 L87.3 44.3 C88.6 41.5 91.4 42.6 90.6 45.5 L88.4 52.1 L91.7 48.5 C93.7 46.4 96.1 48.2 94.7 50.8 L91.2 57 C88.9 61.1 82.2 63 78.4 59.6Z"
                fill="#fffaf3"
                stroke="#b89d82"
                strokeLinejoin="round"
                strokeWidth="0.9"
              />
            </g>
          </g>
        </svg>
        <span
          className="bce-ai-greeting-bubble"
          ref={bubbleRef}
          id={`${prefix}-greeting`}
          role="tooltip"
          aria-hidden="true"
        />
      </span>
    </span>
  );
}

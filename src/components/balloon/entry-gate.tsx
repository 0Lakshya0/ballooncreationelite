import { useEffect, useRef, useState } from 'react';

// Golden gate shown before the website. Timeline (ms from start):
//   0 – 600      doors crack open a hair, white light starts leaking through the gap
//   600 – 2100   hold slightly open, light keeps growing
//   2100 – 4100  doors slowly swing fully open, light grows with them
//   4100 – 6600  full light stays for 2.5 s
//   6600 – 7800  light and gate fade away, site appears underneath
const CRACK_END = 600;
const HOLD_END = 2100;
const OPEN_END = 4100;
const FADE_START = OPEN_END + 2500;
const FADE_END = FADE_START + 1200;
const START_DELAY = 300;

const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);
const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const clamp = (k: number) => Math.min(1, Math.max(0, k));

export function EntryGate() {
  const ref = useRef<HTMLDivElement>(null);
  const startRef = useRef(0);
  const [done, setDone] = useState(false);

  // Lock page scroll while the gate is on screen.
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Drive the whole animation with CSS variables for smooth, frame-accurate motion.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    startRef.current = performance.now() + START_DELAY;
    let raf = 0;

    const frame = (now: number) => {
      const t = now - startRef.current;
      let door = 0;
      let light = 0;
      let spread = 1;

      if (t < 0) {
        // waiting for the first frame
      } else if (t < CRACK_END) {
        const k = easeOut(t / CRACK_END);
        door = 0.04 * k;
        light = 0.55 * k;
      } else if (t < HOLD_END) {
        const k = (t - CRACK_END) / (HOLD_END - CRACK_END);
        door = 0.04 + 0.01 * k;
        light = 0.55 + 0.15 * k;
      } else if (t < OPEN_END) {
        const k = easeInOut((t - HOLD_END) / (OPEN_END - HOLD_END));
        door = 0.05 + 0.95 * k;
        light = 0.7 + 0.3 * k;
      } else {
        door = 1;
        light = 1;
      }

      // Light spreads outward as the doors open, so the glow fills the screen.
      spread = 1 + door * 3;

      let bg = 1;
      if (t >= FADE_START) {
        const f = easeInOut(clamp((t - FADE_START) / (FADE_END - FADE_START)));
        light *= 1 - f;
        bg = 1 - f;
      }

      if (t >= FADE_END) {
        setDone(true);
        return;
      }

      el.style.setProperty('--door', String(door));
      el.style.setProperty('--light', String(light));
      el.style.setProperty('--spread', String(spread));
      el.style.setProperty('--bg', String(bg));
      el.classList.toggle('is-open', t >= CRACK_END);
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Clicking or pressing Enter/Space jumps straight to the slow-open stage.
  const skip = () => {
    const t = performance.now() - startRef.current;
    if (t < HOLD_END) startRef.current = performance.now() - HOLD_END;
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') skip(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (done) return null;

  return <div ref={ref} className="entry-gate">
    <div className="gate-frame">
      <div className="gate-light" />
      <div className="gate-door gate-door-left" />
      <div className="gate-door gate-door-right" />
    </div>
    <button type="button" className="gate-medallion" onClick={skip} aria-label="Enter Balloon Creation website">
      <img src="/balloon-logo.jpg" alt="Balloon Creation" width={400} height={400} />
    </button>
    <span className="gate-hint">Tap to enter</span>
  </div>;
}

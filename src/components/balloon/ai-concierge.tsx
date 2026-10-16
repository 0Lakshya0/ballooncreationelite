import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, MessageCircle, Send, X } from "lucide-react";
import { AIConciergeContext } from "@/lib/ai-concierge-context";
import { AI_QUESTION_LIMIT, AIRequestError, localBusinessAnswer, requestAI } from "@/lib/ai-client";
import {
  clamp,
  dockPosition,
  DOCK_KEY,
  ORB_SIZE,
  readDock,
  snapDock,
  type Dock,
  type Point,
} from "@/lib/ai-dock";
import { contact } from "@/lib/celebrations";
import { AIOrb } from "./ai-orb";
import "./ai-concierge.css";

type Handle = { ask: (question: string) => void };
type Message = { id: number; role: "user" | "assistant"; text: string; provider?: string };
type Viewport = { width: number; height: number; top: number };
const viewportNow = (): Viewport => ({
  width: window.visualViewport?.width || window.innerWidth,
  height: window.visualViewport?.height || window.innerHeight,
  top: window.visualViewport?.offsetTop || 0,
});

export function AIConciergeProvider({ children }: { children: ReactNode }) {
  const ref = useRef<Handle>(null);
  const ask = useCallback((question: string) => ref.current?.ask(question), []);
  return (
    <AIConciergeContext.Provider value={ask}>
      {children}
      <AIConcierge ref={ref} />
    </AIConciergeContext.Provider>
  );
}

const AIConcierge = forwardRef<Handle>(function AIConcierge(_, ref) {
  const [open, setOpen] = useState(false);
  const [dock, setDock] = useState<Dock>({ side: "right", ratio: 0.84 });
  const [viewport, setViewport] = useState<Viewport>({ width: 390, height: 740, top: 0 });
  const [point, setPoint] = useState<Point | null>(null);
  const [dragging, setDragging] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [retryUntil, setRetryUntil] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const sequence = useRef(0);
  const busyRef = useRef(false);
  const alive = useRef(true);
  const abort = useRef<AbortController | null>(null);
  const orb = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const dockRef = useRef(dock);
  const pointRef = useRef(point);
  const drag = useRef<{ id: number; x: number; y: number; origin: Point; moved: boolean } | null>(
    null,
  );
  const suppressClick = useRef(false);

  useEffect(() => {
    alive.current = true;
    const restored = readDock();
    setDock(restored);
    dockRef.current = restored;
    const resize = () => {
      const current = viewportNow();
      setViewport(current);
      const position = dockPosition(dockRef.current, current.width, current.height);
      setPoint(position);
      pointRef.current = position;
      drag.current = null;
      setDragging(false);
    };
    resize();
    window.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("scroll", resize);
    return () => {
      alive.current = false;
      abort.current?.abort();
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("scroll", resize);
    };
  }, []);
  useEffect(() => {
    if (!retryUntil) return;
    const update = () => setCooldown(Math.max(0, Math.ceil((retryUntil - Date.now()) / 1000)));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [retryUntil]);
  useEffect(() => {
    if (open && log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, busy, open]);

  const append = useCallback((message: Omit<Message, "id">) => {
    setMessages((previous) => [...previous, { ...message, id: ++sequence.current }].slice(-30));
  }, []);
  const send = useCallback(
    async (value: string) => {
      const question = value.trim();
      if (busyRef.current) {
        setDraft(value);
        return;
      }
      if (question.length < 2 || question.length > AI_QUESTION_LIMIT) {
        setError("Please use 2–1,500 characters.");
        setDraft(value);
        return;
      }
      const local = localBusinessAnswer(question);
      if (!local && Date.now() < retryUntil) {
        setDraft(value);
        setError(
          "Please wait for the free AI allowance to become available, or speak to our team.",
        );
        return;
      }
      setError("");
      setDraft("");
      append({ role: "user", text: question });
      if (local) {
        append({ role: "assistant", text: local, provider: "team" });
        return;
      }
      busyRef.current = true;
      setBusy(true);
      const controller = new AbortController();
      abort.current = controller;
      const timeout = setTimeout(() => controller.abort(), 40_000);
      try {
        const result = await requestAI(question, controller.signal);
        if (!alive.current) return;
        append({ role: "assistant", text: result.answer, provider: result.provider });
        if (typeof result.remaining === "number") setRemaining(result.remaining);
      } catch (failure) {
        if (!alive.current) return;
        setError(
          controller.signal.aborted
            ? "The request timed out. It may still count towards the allowance. No automatic retry was sent."
            : failure instanceof AIRequestError
              ? failure.message
              : "Could not connect to AI. Please try later or speak to our team.",
        );
        setDraft((previous) => previous || question);
        if (failure instanceof AIRequestError && failure.retryAfter > 0)
          setRetryUntil(Date.now() + failure.retryAfter * 1000);
      } finally {
        clearTimeout(timeout);
        busyRef.current = false;
        if (alive.current) setBusy(false);
        if (abort.current === controller) abort.current = null;
      }
    },
    [append, retryUntil],
  );
  useImperativeHandle(
    ref,
    () => ({
      ask(question) {
        setOpen(true);
        void send(question);
      },
    }),
    [send],
  );

  function settle(position: Point) {
    const current = viewportNow();
    const next = snapDock(position, current.width, current.height);
    setDock(next);
    dockRef.current = next;
    const snapped = dockPosition(next, current.width, current.height);
    setPoint(snapped);
    pointRef.current = snapped;
    try {
      localStorage.setItem(DOCK_KEY, JSON.stringify(next));
    } catch {
      /* Drag still works without storage. */
    }
  }
  function finishDrag() {
    const current = drag.current;
    if (!current) return;
    suppressClick.current = current.moved;
    if (current.moved) settle(pointRef.current || current.origin);
    drag.current = null;
    setDragging(false);
  }
  const panelHeight = Math.max(180, Math.min(620, viewport.height - 24));
  const panelWidth = Math.min(404, viewport.width - 24);
  const valid = draft.trim().length >= 2 && draft.trim().length <= AI_QUESTION_LIMIT;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <button
        ref={orb}
        type="button"
        className={`bce-ai-orb${dragging ? " is-dragging" : ""}`}
        data-side={dock.side}
        style={
          point
            ? {
                left: point.x,
                top: point.y + viewport.top,
                visibility: open ? "hidden" : "visible",
              }
            : { right: 14, bottom: 96, visibility: open ? "hidden" : "visible" }
        }
        aria-label="Open Balloon Creation AI"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-describedby="bce-ai-drag-help"
        tabIndex={open ? -1 : 0}
        onPointerDown={(event) => {
          if (event.button !== 0 || event.isPrimary === false) return;
          suppressClick.current = false;
          drag.current = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            origin: pointRef.current || dockPosition(dock, viewport.width, viewport.height),
            moved: false,
          };
          event.currentTarget.setPointerCapture?.(event.pointerId);
        }}
        onPointerMove={(event) => {
          const current = drag.current;
          if (!current || current.id !== event.pointerId) return;
          const dx = event.clientX - current.x,
            dy = event.clientY - current.y;
          if (!current.moved && Math.hypot(dx, dy) < 8) return;
          current.moved = true;
          setDragging(true);
          const next = {
            x: clamp(current.origin.x + dx, 8, viewport.width - ORB_SIZE - 8),
            y: clamp(current.origin.y + dy, 8, viewport.height - ORB_SIZE - 8),
          };
          setPoint(next);
          pointRef.current = next;
        }}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onClick={(event) => {
          if (suppressClick.current && event.detail !== 0) {
            event.preventDefault();
            return;
          }
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
          event.preventDefault();
          const current = pointRef.current || dockPosition(dock, viewport.width, viewport.height);
          settle({
            x:
              event.key === "ArrowLeft"
                ? 0
                : event.key === "ArrowRight"
                  ? viewport.width
                  : current.x,
            y: current.y + (event.key === "ArrowUp" ? -36 : event.key === "ArrowDown" ? 36 : 0),
          });
        }}
      >
        <AIOrb paused={open} />
        <span className="bce-ai-orb-caption">Ask AI</span>
      </button>
      <span id="bce-ai-drag-help" className="sr-only">
        Drag to move; release to dock at the nearest side. Arrow keys reposition. Enter opens chat.
      </span>
      <Dialog.Portal>
        <Dialog.Overlay className="bce-ai-overlay" />
        <Dialog.Content
          className="bce-ai-panel"
          style={{
            width: panelWidth,
            height: panelHeight,
            top: viewport.top + viewport.height - panelHeight - 12,
            left: dock.side === "left" ? 12 : Math.max(12, viewport.width - panelWidth - 12),
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            requestAnimationFrame(() => orb.current?.focus({ preventScroll: true }));
          }}
        >
          <header className="bce-ai-header">
            <div>
              <span className="bce-ai-eyebrow">YOUR CELEBRATION COMPANION</span>
              <Dialog.Title>Balloon Creation AI</Dialog.Title>
              <Dialog.Description>We decorate your happiness</Dialog.Description>
            </div>
            <Dialog.Close className="bce-ai-close" aria-label="Close AI chat">
              <X size={20} />
            </Dialog.Close>
          </header>
          <div
            className="bce-ai-messages"
            ref={log}
            role="log"
            aria-label="AI conversation"
            aria-live="polite"
            aria-relevant="additions text"
          >
            <div className="bce-ai-welcome">
              <MessageCircle size={23} strokeWidth={1.2} />
              <h3>
                A little inspiration
                <br />
                <em>for your next celebration.</em>
              </h3>
              <p>
                Hi! Ask in English, Hindi or Hinglish. Tell me the occasion, colours and space you
                have in mind.
              </p>
            </div>
            {messages.length === 0 && (
              <div className="bce-ai-suggestions">
                {[
                  "Birthday decoration ideas",
                  "Soft gold colour palette",
                  "Plan a small surprise",
                ].map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => {
                      setDraft(question);
                      input.current?.focus();
                    }}
                  >
                    {question}
                    <ArrowUpRight size={14} />
                  </button>
                ))}
              </div>
            )}
            {messages.map((message) => (
              <article className={`bce-ai-message is-${message.role}`} key={message.id}>
                <span>{message.role === "user" ? "YOU" : "BALLOON CREATION"}</span>
                <p>{message.text}</p>
                {message.provider && (
                  <small>
                    {message.provider === "team"
                      ? "Confirmed business details · no AI request"
                      : `AI answer · ${message.provider === "groq" ? "Groq" : message.provider === "gemini" ? "Gemini" : message.provider === "openrouter" ? "OpenRouter" : "AI"}`}
                  </small>
                )}
                {message.provider === "team" && (
                  <a
                    href={`${contact.whatsapp}?text=${encodeURIComponent("Hi Balloon Creation! I would like help with my decoration.")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Talk to our team <ArrowUpRight size={13} />
                  </a>
                )}
              </article>
            ))}
            {busy && (
              <p className="bce-ai-thinking" role="status">
                <span />
                Preparing your ideas…
              </p>
            )}
          </div>
          {error && (
            <div className="bce-ai-error" role="alert">
              <p>{error}</p>
              {cooldown > 0 && <small>Please wait {cooldown}s before another AI request.</small>}
              <a href={contact.whatsapp} target="_blank" rel="noreferrer">
                Continue on WhatsApp <ArrowUpRight size={13} />
              </a>
            </div>
          )}
          <form
            className="bce-ai-composer"
            onSubmit={(event) => {
              event.preventDefault();
              void send(draft);
            }}
          >
            <label className="sr-only" htmlFor="bce-ai-question">
              Your question for Balloon Creation AI
            </label>
            <div className="bce-ai-input-wrap">
              <textarea
                ref={input}
                id="bce-ai-question"
                value={draft}
                maxLength={AI_QUESTION_LIMIT}
                rows={2}
                placeholder="Ask your question… / Apna sawaal likho…"
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    if (valid && !busy) void send(draft);
                  }
                }}
              />
              <button
                type="submit"
                aria-label="Send AI question"
                disabled={
                  !valid || busy || (Date.now() < retryUntil && !localBusinessAnswer(draft))
                }
              >
                <Send size={18} />
              </button>
            </div>
            <div className="bce-ai-input-meta">
              <span>{draft.length}/1,500</span>
              <span>
                {remaining === null
                  ? "Free AI limits apply"
                  : `${remaining} AI attempts left today`}
              </span>
            </div>
          </form>
          <p className="bce-ai-note">
            Replies use your current question. No live web search. Please confirm bookings and final
            details with our team. Don’t share sensitive information.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

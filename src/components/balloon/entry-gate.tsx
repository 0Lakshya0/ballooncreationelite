import { useEffect, useState } from 'react';

// Golden gate shown before the website. It opens automatically after a short
// moment, or immediately on click / Enter / Space.
type Phase = 'closed' | 'open' | 'gone';

export function EntryGate() {
  const [phase, setPhase] = useState<Phase>('closed');

  // Lock page scroll while the gate is closed.
  useEffect(() => {
    if (phase === 'closed') document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [phase]);

  // Auto-open after a short pause, and allow keyboard to open it.
  useEffect(() => {
    if (phase !== 'closed') return;
    const timer = setTimeout(() => setPhase('open'), 2800);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') setPhase('open'); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(timer); window.removeEventListener('keydown', onKey); };
  }, [phase]);

  // Remove the gate from the DOM once the doors have slid away.
  useEffect(() => {
    if (phase !== 'open') return;
    const timer = setTimeout(() => setPhase('gone'), 1300);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === 'gone') return null;

  return <div className={`entry-gate${phase === 'open' ? ' is-open' : ''}`} aria-hidden={phase === 'open'}>
    <div className="gate-frame">
      <div className="gate-door gate-door-left" />
      <div className="gate-door gate-door-right" />
    </div>
    <button type="button" className="gate-medallion" onClick={() => setPhase('open')} aria-label="Enter Balloon Creation website">
      <img src="/balloon-logo.jpg" alt="Balloon Creation" width={400} height={400} />
    </button>
    <span className="gate-hint">Tap to enter</span>
  </div>;
}

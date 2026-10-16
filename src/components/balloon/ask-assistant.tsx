import { useEffect, useState } from 'react';
import { ArrowUpRight, Loader2, Sparkles, X } from 'lucide-react';
import { askAssistant } from '@/lib/assistant.functions';
import { contact } from '@/lib/celebrations';

type Result = { answer: string; sources: Array<{ url: string; title: string }>; grounded: boolean };

export function AskAssistant({ question, onClose }: { question: string; onClose: () => void }) {
  const [state, setState] = useState<{ status: 'loading' } | { status: 'done'; result: Result } | { status: 'error'; message: string }>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    askAssistant({ data: { question } })
      .then(result => active && setState({ status: 'done', result }))
      .catch((error: unknown) => active && setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      }));
    return () => { active = false; };
  }, [question]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return <div className="areas-overlay" role="dialog" aria-modal="true" aria-label="AI answer" onClick={onClose}>
    <div className="areas-modal ask-modal" onClick={e => e.stopPropagation()}>
      <div className="areas-head">
        <span className="eyebrow"><Sparkles size={12} /> ASK BALLOON CREATION AI</span>
        <h2>{question}</h2>
        <button type="button" className="areas-close" aria-label="Close answer" onClick={onClose}><X size={18} /></button>
      </div>
      <div className="ask-body">
        {state.status === 'loading' && <p className="ask-loading"><Loader2 size={16} className="animate-spin" /> Searching the web and preparing your answer…</p>}
        {state.status === 'error' && <p className="form-error" role="alert">{state.message}</p>}
        {state.status === 'done' && <>
          <div className="ask-answer">{state.result.answer}</div>
          {state.result.sources.length > 0 && <div className="ask-sources">
            <span className="eyebrow">SOURCES</span>
            <ul>{state.result.sources.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title}<ArrowUpRight size={13} /></a></li>)}</ul>
          </div>}
        </>}
      </div>
      <p className="areas-note">Need a real plan for your event? <a href={`${contact.whatsapp}?text=${encodeURIComponent(`Hello Balloon Creation! I have a question: ${question}`)}`} target="_blank" rel="noreferrer">Chat with our team on WhatsApp</a>.</p>
    </div>
  </div>;
}

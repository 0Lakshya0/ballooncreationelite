import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Loader2, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { celebrations, contact } from '@/lib/celebrations';
import { submitInquiry } from '@/lib/concierge.functions';

export function Concierge({ occasion, onOccasionChange }: { occasion: string; onOccasionChange: (value: string) => void }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus('sending');
    try {
      await submitInquiry({ data: Object.fromEntries(form.entries()) });
      setStatus('success');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Please try again or call us directly.');
      setStatus('error');
    }
  }
  return <section className="concierge section-space" id="concierge">
    <div className="page-width concierge-layout">
      <div className="reveal concierge-copy">
        <span className="eyebrow">THE ELITE CONCIERGE</span>
        <h2>Your occasion.<br />Our <em>obsession.</em></h2>
        <p>Every beautiful celebration begins with a conversation. Tell us what you’re dreaming of — we’ll bring it to life.</p>
        <div className="concierge-contact"><span className="eyebrow">A MORE PERSONAL CONVERSATION</span>
          <a href={`tel:${contact.phone}`}><Phone size={15} />{contact.label}<ArrowUpRight size={16} /></a>
          <a href={contact.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={15} />Connect on WhatsApp<ArrowUpRight size={16} /></a>
        </div>
        <span className="location-note">BASED IN INDORE. MADE FOR YOUR MOMENT.</span>
      </div>
      <div className="inquiry-panel reveal">
        {status === 'success' ? <div className="inquiry-success" role="status"><span className="success-mark"><Check size={28} /></span><span className="eyebrow">A BEAUTIFUL BEGINNING</span><h3>Your vision is<br />in good hands.</h3><p>Your consultation request has been received. We look forward to creating something extraordinary with you.</p><Button variant="outline" onClick={() => setStatus('idle')}>Plan another occasion <ArrowUpRight /></Button></div> : <form onSubmit={submit}>
          <div className="form-title"><h3>Let’s create something beautiful.</h3><span>01 — THE FIRST CONVERSATION</span></div>
          <div className="form-grid">
            <label>Your name<input name="name" autoComplete="name" placeholder="Full name" minLength={2} maxLength={100} required /></label>
            <label>Phone number<input name="phone" type="tel" autoComplete="tel" placeholder="+91 · 10-digit number" pattern="[+0-9 ()\-]{10,20}" required /></label>
            <label>The occasion<select name="occasion" value={occasion} onChange={event => onOccasionChange(event.target.value)} required><option value="" disabled>Select your celebration</option>{celebrations.map(item => <option key={item.name}>{item.name}</option>)}</select></label>
            <label>Event date<input name="event_date" type="date" aria-label="Event date" required /></label>
            <label className="field-wide">Venue / location<input name="venue" placeholder="Where will the magic happen?" minLength={2} maxLength={200} required /></label>
            <label className="field-wide">Your vision <span className="optional">(optional)</span><textarea name="vision" placeholder="A theme, a colour palette, a little inspiration…" rows={3} maxLength={2000} /></label>
          </div>
          <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          {status === 'error' && <p className="form-error" role="alert">{error}</p>}
          <Button className="submit-inquiry" type="submit" variant="luxury" disabled={status === 'sending'}>{status === 'sending' ? <>Sending your request <Loader2 className="animate-spin" /></> : <>Request a private consultation <ArrowUpRight /></>}</Button>
          <p className="form-discretion">Your details stay private. Your celebration stays personal.</p>
        </form>}
      </div>
    </div>
  </section>;
}

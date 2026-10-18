import { areasCovered } from "./indore-areas";

export type Stat = { value: number; suffix: string; label: string; note: string };

export const stats: Stat[] = [
  {
    value: 1000,
    suffix: "+",
    label: "Custom designs",
    note: "Composed for one occasion only — yours.",
  },
  {
    value: 2,
    suffix: " hr",
    label: "Expert setup",
    note: "We arrive early, finish quietly, vanish on time.",
  },
  {
    value: areasCovered,
    suffix: "+",
    label: "Indore areas",
    note: "Doorstep styling across the city and beyond.",
  },
  {
    value: 20,
    suffix: "+",
    label: "Celebration formats",
    note: "From first birthdays to grand openings.",
  },
];

export type ProcessStep = { step: string; title: string; copy: string };

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Share your vision",
    copy: "A WhatsApp message, a call or the consultation form. Tell us the occasion, the date and the feeling you want to create.",
  },
  {
    step: "02",
    title: "We design & quote",
    copy: "Within hours you receive a considered concept — palette, structure and finishes — with a clear, itemised quote. No surprises.",
  },
  {
    step: "03",
    title: "We set up, you celebrate",
    copy: "Our team arrives on schedule and completes the styling in about two hours. You walk in to a finished, flawless setting.",
  },
];

export type Testimonial = { quote: string; name: string; meta: string };

// PLACEHOLDER CONTENT — replace these with real client reviews before launch.
export const testimonials: Testimonial[] = [
  {
    quote:
      "They understood the brief in one conversation. The stage looked like something from a magazine, and everything was ready two hours before the muhurat.",
    name: "Priya & Aditya",
    meta: "Wedding · Vijay Nagar",
  },
  {
    quote:
      "My daughter’s first birthday felt like a dream. The pastel balloons, the cake table, the little details — guests kept asking who had styled it.",
    name: "Neha Agrawal",
    meta: "First birthday · Palasia",
  },
  {
    quote:
      "A last-minute anniversary surprise, planned and installed the same evening. Discreet, punctual and genuinely beautiful work.",
    name: "Rohit Sharma",
    meta: "Anniversary · Scheme 54",
  },
];

export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  {
    question: "How far in advance should I book?",
    answer:
      "For weddings and large celebrations we recommend 2–4 weeks so the design can be refined properly. Birthdays, surprises and room decor are often possible within 24–48 hours — message us and we will confirm availability straight away.",
  },
  {
    question: "How long does the setup take?",
    answer:
      "Most of our setups are completed in about two hours. Larger wedding stages can take three to four. We always schedule the installation to finish well before your guests or the muhurat begin.",
  },
  {
    question: "Can you create a completely custom theme?",
    answer:
      "Yes — that is the heart of what we do. Share a colour palette, an inspiration image or simply a feeling. Every design is composed from scratch around your occasion; nothing is repeated from a catalogue.",
  },
  {
    question: "Which areas of Indore do you cover?",
    answer:
      "We style celebrations across Indore, including Vijay Nagar, Palasia, Scheme 54, Rau, Nipania, Super Corridor and 80+ other localities. Venues on the outskirts and nearby towns can usually be arranged — just ask.",
  },
  {
    question: "What does a setup cost?",
    answer:
      "Pricing depends on scale, florals and the complexity of the installation. After a short conversation we send a clear, itemised quote, so you know exactly what is included before confirming. There is no obligation.",
  },
  {
    question: "Do you handle floral and balloon styling together?",
    answer:
      "Always. Our installations combine fresh-looking florals, premium balloons and considered props so the whole space feels designed as one, not assembled from separate pieces.",
  },
];

export const trustPoints = [
  "Punctual, discreet installation",
  "Clear itemised quotes",
  "Premium materials only",
];

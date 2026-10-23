export const guideLinks = [
  { to: "/faqs", label: "FAQs" },
  { to: "/signature-standard", label: "The signature standard" },
  { to: "/lets-celebrate", label: "Let’s celebrate" },
] as const;
export const guideFaqs = [
  {
    topic: "Planning",
    question: "I do not have a theme yet. Can I still enquire?",
    answer:
      "Absolutely. Start with your occasion and the space you have. A favourite colour, a reference photo or simply the feeling you want is enough for a first conversation.",
  },
  {
    topic: "Planning",
    question: "How early should I get in touch?",
    answer:
      "As soon as you know your date. Larger celebrations need more planning. For a last-minute request, share the date and location so we can check availability before making any promises.",
  },
  {
    topic: "Planning",
    question: "What should I share in my first message?",
    answer:
      "Your occasion, preferred date and venue or area are helpful. If you have a theme or photo, you can share it in WhatsApp. It is fine if some details are still undecided.",
  },
  {
    topic: "Design & venue",
    question: "Can I customise the colours and decoration?",
    answer:
      "Tell us which colours, flowers, balloons and personal touches you like. We will discuss what suits your space and what can be included in your quote. Reference photos are inspiration, not a promise of an identical setup.",
  },
  {
    topic: "Design & venue",
    question: "Do you work with flowers and balloons together?",
    answer:
      "We can discuss flower styling, balloon styling or a combination. Materials, sizes, quantities and any props should be agreed in the written plan so you know what you are choosing.",
  },
  {
    topic: "Design & venue",
    question: "Can you decorate a home, hotel or outdoor space?",
    answer:
      "Share the venue type and, if possible, a photo or approximate measurements. Hotel permissions, access times, mounting rules and outdoor weather conditions may affect the design and installation.",
  },
  {
    topic: "Design & venue",
    question: "Which areas do you serve?",
    answer:
      "Balloon Creation is based in Indore. Share your exact venue or area so we can confirm travel, access and any location-related charges before you decide.",
  },
  {
    topic: "Booking & changes",
    question: "How will I know the final cost?",
    answer:
      "The quote depends on the design, scale, materials, venue and any extras. Ask for a clear list of inclusions and exclusions. Your final scope and amount should be agreed before booking; choosing an idea online is not a priced package.",
  },
  {
    topic: "Booking & changes",
    question: "Does sending a message confirm my booking?",
    answer:
      "No. A message or callback request starts a conversation. Your date, design, availability, amount and booking terms still need to be confirmed directly with the team.",
  },
  {
    topic: "Booking & changes",
    question: "What if I need to change or cancel?",
    answer:
      "Contact the team as soon as possible. Availability, materials already arranged and the agreed booking terms can affect changes, cancellation or refunds. Please ask for these terms before confirming.",
  },
  {
    topic: "On the day",
    question: "How much setup time is needed?",
    answer:
      "Timing depends on the scale of the decoration and venue access. Agree the arrival time, access arrangements and ready-by time with the team in advance, rather than relying on one fixed duration for every event.",
  },
  {
    topic: "On the day",
    question: "Who arranges permissions and removal?",
    answer:
      "Let us know your venue’s rules before the design is finalised. Agree who arranges permissions, access, power where needed, prop collection and removal, and whether any of these services are included in your quote.",
  },
] as const;
export type CelebrationPlan = { occasion: string; date: string; venue: string; vision: string };
export function celebrationPlanMessage(plan: CelebrationPlan): string {
  return [
    "Hello Balloon Creation! I would like help planning a celebration.",
    `Occasion: ${plan.occasion || "Please help me choose"}`,
    `Preferred date: ${plan.date || "Not decided yet"}`,
    `Venue / area: ${plan.venue.trim() || "Not decided yet"}`,
    ...(plan.vision.trim() ? [`My ideas: ${plan.vision.trim()}`] : []),
    "Please help me with suitable ideas, availability and a clear quote. I understand this is an enquiry, not a confirmed booking.",
  ].join("\n");
}

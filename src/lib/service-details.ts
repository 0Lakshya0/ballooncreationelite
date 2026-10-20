import { getOccasion, occasionPages } from "./occasion-catalogue";
import wedding from "@/assets/wedding.webp";
import birthday from "@/assets/birthday.webp";
import anniversary from "@/assets/anniversary.webp";
import baby from "@/assets/baby-shower.webp";
import devotional from "@/assets/devotional.webp";
import hero from "@/assets/celebration-hero.webp";

const thumbs = import.meta.glob<string>("/src/assets/categories/*.webp", {
  eager: true,
  import: "default",
});
const cat = (n: number): string =>
  thumbs[`/src/assets/categories/category-${String(n).padStart(2, "0")}.webp`] ?? hero;

export type ServicePackage = {
  name: string;
  bestFor: string;
  includes: string[];
  featured?: boolean;
};

export type ServiceGalleryItem = { src: string; caption: string };

export type ServiceDetail = {
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  hook: string;
  promise: string;
  tagline: string;
  heroImage: string;
  accentImage: string;
  accentCaption: string;
  quickFacts: { label: string; value: string }[];
  intro: { heading: string; paragraphs: string[]; pullQuote: string };
  pillars: { title: string; copy: string }[];
  inclusions: { title: string; copy: string }[];
  timeline: { step: string; title: string; copy: string }[];
  occasions: string[];
  gallery: ServiceGalleryItem[];
  packages: ServicePackage[];
  proof: { quote: string; name: string; meta: string }[];
  faqs: { question: string; answer: string }[];
  urgency: string;
  closing: { heading: string; copy: string };
};

/**
 * Long-form creation pages.
 *
 * A note for the owner: the scarcity/urgency lines below describe how the studio
 * genuinely works (limited installations per day, seasonal dates booked early).
 * If your capacity changes, edit them here — every page reads from this file.
 */
export const serviceDetails: ServiceDetail[] = [
  {
    slug: "grand-weddings-rings",
    name: "Grand Weddings & Rings",
    shortName: "Weddings",
    eyebrow: "THE WEDDING COLLECTION",
    hook: "The wedding your photographs will never let you forget.",
    promise:
      "Sculpted floral aisles, a ring ceremony staged like a film, and a mandap that holds the light exactly where it should. Designed for the one day every detail will be looked at twice.",
    tagline: "Love, beautifully celebrated.",
    heroImage: wedding,
    accentImage: cat(11),
    accentCaption: "An aisle built to be walked slowly.",
    quickFacts: [
      { label: "Setup window", value: "2–4 hours" },
      { label: "Design lead time", value: "3–4 weeks" },
      { label: "Coverage", value: "Indore & 60 km" },
      { label: "Crew on site", value: "Up to 12" },
    ],
    intro: {
      heading: "Not decoration. A setting for the most photographed day of your life.",
      paragraphs: [
        "A wedding is the only celebration where every guest arrives with a camera and leaves with an opinion. The mandap is in every frame. The entrance is the first thing your family sees. The aisle is the last quiet moment before everything changes.",
        "We design those frames on purpose. Structure first — height, sightlines, how the light will fall at 7 pm — then florals, fabric and the small details that make a photograph feel expensive without ever looking busy.",
        "Your job on the day is to be present. Ours is to make sure the room, the entrance, the stage and the suite all agree with each other, and that nobody has to fix anything once the guests arrive.",
      ],
      pullQuote:
        "“The aisle looked like it belonged in a magazine, and it was finished two hours before the muhurat.” — Priya & Aditya, Vijay Nagar",
    },
    pillars: [
      {
        title: "Composed like couture",
        copy: "One palette, one mood, one story — carried from the entrance to the mandap to the bridal suite. Nothing looks rented, because nothing is repeated.",
      },
      {
        title: "Built to be photographed",
        copy: "We check sightlines, backdrops and lighting angles before we check the guest list. Every structure is designed for the camera your family will actually use.",
      },
      {
        title: "Invisible precision",
        copy: "Production happens before you arrive and is cleared before the last photograph. No cables, no ladders, no team in the frame — ever.",
      },
    ],
    inclusions: [
      {
        title: "Mandap & stage architecture",
        copy: "Sculpted structures, drape work, floral columns and a stage built to the exact proportions of your venue.",
      },
      {
        title: "Aisle & entrance styling",
        copy: "A walkway that leads the eye forward, framed with florals, lanterns and considered lighting.",
      },
      {
        title: "Ring ceremony staging",
        copy: "A dedicated moment — ring platter, pedestal, backdrop and seating arranged for photographs.",
      },
      {
        title: "Bridal suite & first-night room",
        copy: "A calm, softly lit room for the first photographs of the morning and the last ones of the night.",
      },
      {
        title: "Car & baraat decoration",
        copy: "Floral work on the car, entry gate styling and coordinated accents for the procession.",
      },
      {
        title: "Lighting & drape design",
        copy: "Warm, flattering light that photographs correctly on both phone cameras and professional lenses.",
      },
      {
        title: "On-site styling captain",
        copy: "One named person from our team owns your venue from setup to the final flourish — and stays reachable.",
      },
      {
        title: "Silent, safe removal",
        copy: "Everything cleared after the event without disturbing the venue, the family or the next morning.",
      },
    ],
    timeline: [
      {
        step: "01",
        title: "A conversation, not a catalogue",
        copy: "Tell us the date, the venue, the family and the feeling. We ask the questions most decorators skip — what will be in the frame, and who needs to be comfortable.",
      },
      {
        step: "02",
        title: "Concept & itemised quote",
        copy: "Within 24–48 hours you receive a design direction with palette, structure and finishes, plus a clear quote. Every line is explained. Nothing is hidden in “miscellaneous”.",
      },
      {
        step: "03",
        title: "Site recce & production",
        copy: "We visit the venue, measure, photograph and plan the installation minute by minute. Florals and structures are prepared off-site so the venue is disturbed as little as possible.",
      },
      {
        step: "04",
        title: "Setup day & live styling",
        copy: "Our crew installs, checks every angle, adjusts in the final hour and hands you a finished room — then quietly disappears.",
      },
    ],
    occasions: [
      "Engagement",
      "Ring ceremony",
      "Mehendi",
      "Haldi",
      "Sangeet",
      "Wedding",
      "Reception",
      "First night",
    ],
    gallery: [
      { src: wedding, caption: "The floral aisle, built for the walk everyone remembers." },
      { src: cat(11), caption: "An outdoor mandap framed in fresh florals and drape." },
      { src: cat(12), caption: "The entrance — the first frame your guests see." },
      { src: cat(13), caption: "Car styling, coordinated with the venue palette." },
      { src: cat(9), caption: "The bridal suite, softly lit for the morning photographs." },
      { src: hero, caption: "Reception dessert table, styled as part of the set." },
    ],
    packages: [
      {
        name: "The Atelier Wedding",
        bestFor: "Grand venues, multi-function weddings, families who want it remembered.",
        includes: [
          "Full venue styling: entrance, aisle, mandap, stage and reception",
          "Bridal suite, first-night room and car decoration",
          "Two on-site captains and a 12-person production crew",
          "Lighting design, drape architecture and fresh floral installations",
          "Site recce, design board and itemised quote before booking",
        ],
      },
      {
        name: "The Signature Wedding",
        bestFor: "One beautifully executed day where the mandap is the hero.",
        featured: true,
        includes: [
          "Mandap or stage as the centrepiece, with matching entrance",
          "Floral aisle and ring-ceremony staging",
          "Bridal room accents and car decoration",
          "One styling captain on site",
          "Design board, itemised quote and setup-day scheduling",
        ],
      },
      {
        name: "The Intimate Vow",
        bestFor: "Small ceremonies, court weddings, second weddings, home mandaps.",
        includes: [
          "A single stunning focal point — mandap, backdrop or entrance",
          "Floral styling and considered lighting",
          "Ring ceremony or pheras styling",
          "Compact crew with a 2-hour setup window",
          "Clear quote, no hidden extras",
        ],
      },
    ],
    proof: [
      {
        quote:
          "They understood the brief in one conversation. Everything was ready two hours before the muhurat — not one person was running around fixing things.",
        name: "Priya & Aditya",
        meta: "Wedding · Vijay Nagar",
      },
      {
        quote:
          "The mandap photographed beautifully in every light. Our photographer asked for their number the same night.",
        name: "Sakshi & Rohan",
        meta: "Wedding · Rau",
      },
      {
        quote:
          "Calm, punctual and genuinely discreet. My mother-in-law still calls them “the good decorators”.",
        name: "Ritika Jain",
        meta: "Reception · Scheme 54",
      },
    ],
    faqs: [
      {
        question: "How early should we book our wedding date?",
        answer:
          "Three to four weeks is comfortable for a full wedding, and the best dates in the season are usually secured first. If your date is already close, message us — we do accept last-minute weddings when the production schedule allows, and we will tell you honestly within the hour.",
      },
      {
        question: "Can you work with our venue and our other vendors?",
        answer:
          "Yes. We coordinate directly with the venue, caterer, photographer and lighting team so nothing collides on the day. If your venue has restrictions on hanging or open flame, we will design around them instead of discovering the problem on site.",
      },
      {
        question: "What happens if it rains or the venue changes?",
        answer:
          "We plan an indoor fallback for every outdoor structure before setup day. If the venue changes, we re-measure and adapt the design — as long as we are told before production begins, the change is smooth rather than stressful.",
      },
      {
        question: "Can we use our own flowers, props or family heirlooms?",
        answer:
          "Absolutely, and we encourage it. Family pieces are often what makes a mandap feel personal. Share them during the consultation and we will design them into the layout instead of hiding them at the edge.",
      },
      {
        question: "How does payment and cancellation work?",
        answer:
          "A booking advance holds your date and begins production; the balance is due before installation. The exact terms are written in your quote. Because dates are limited, the advance is what reserves the day — we will always explain this clearly before you pay anything.",
      },
    ],
    urgency:
      "Wedding dates are the one thing we can never manufacture more of. The dates families ask for most are usually gone three to four weeks before the season — and we would rather tell you now than after you have set your heart on one.",
    closing: {
      heading: "Your date is still available. Not for long.",
      copy: "A 15-minute call is enough for us to tell you what your venue can become — and whether we are the right studio for it. You will leave the conversation with ideas, not pressure.",
    },
  },
  {
    slug: "mega-birthdays",
    name: "Mega Birthdays",
    shortName: "Birthdays",
    eyebrow: "THE BIRTHDAY COLLECTION",
    hook: "Another year deserves more than a cake and a candle.",
    promise:
      "Balloon architecture, a cake table styled like a boutique window, and a backdrop your guests will photograph before they even say hello. For first birthdays and fiftieths alike.",
    tagline: "Make a wish. Mean it.",
    heroImage: birthday,
    accentImage: cat(2),
    accentCaption: "Themes that belong to the birthday, not to a catalogue.",
    quickFacts: [
      { label: "Setup window", value: "About 2 hours" },
      { label: "Design lead time", value: "24–48 hours" },
      { label: "Ages covered", value: "1st to 50th" },
      { label: "Themes", value: "Fully bespoke" },
    ],
    intro: {
      heading: "The photographs from this birthday will outlive the cake.",
      paragraphs: [
        "A birthday is judged in the first ten seconds. Guests walk in, see the backdrop, and decide whether this is a party or an occasion. That first impression is entirely design — and it is the part most people leave to a balloon packet and a roll of tape.",
        "We build the whole frame: the wall of balloons behind the cake, the table that holds it, the lighting that makes the candles glow instead of glare, and the little signage and details that make guests reach for their phones.",
        "Whether it is a first birthday with pastel clouds or a fiftieth with champagne and gold, the brief is the same — it should look like it was designed for one person only, because it was.",
      ],
      pullQuote:
        "“Guests kept asking who had styled it. My daughter still talks about her ‘cloud party’.” — Neha Agrawal, Palasia",
    },
    pillars: [
      {
        title: "Theme, not template",
        copy: "We start from the person — their age, their obsession, their colours — not from a folder of stock themes. That is why no two of our birthdays look alike.",
      },
      {
        title: "Built around the cake table",
        copy: "Cake, backdrop and lighting are composed as one photograph. Whatever your guests photograph first will look deliberate.",
      },
      {
        title: "Ready before the guests",
        copy: "Most setups finish in about two hours. You get time to dress, breathe and take the first family photos without a crew in the background.",
      },
    ],
    inclusions: [
      {
        title: "Balloon architecture",
        copy: "Organic garlands, sculptural columns, cloud walls and ceiling installations — built to shape, not just to fill space.",
      },
      {
        title: "Cake table styling",
        copy: "A styled table with layers, florals and props, designed to frame the cake instead of crowding it.",
      },
      {
        title: "Backdrop & wall design",
        copy: "Custom backdrops, name signage, neon-style lettering and arches built to your theme.",
      },
      {
        title: "Kids’ theme worlds",
        copy: "Rainbows, dinosaurs, princesses, jungle, space — interpreted in premium materials, never cartoon-printed cheaply.",
      },
      {
        title: "Milestone styling",
        copy: "First birthdays, 18ths, 25ths and 50ths styled for the age and the audience — playful or suitably grown-up.",
      },
      {
        title: "Lighting & ambience",
        copy: "Warm, flattering light that makes the cake, the candles and the family photographs look their best.",
      },
      {
        title: "Welcome & signage details",
        copy: "Entry boards, table cards and small finishing touches that carry the theme to the door.",
      },
      {
        title: "Same-day surprises",
        copy: "Room and home surprises installed quietly while the birthday person is out — a complete reveal in one moment.",
      },
    ],
    timeline: [
      {
        step: "01",
        title: "Tell us who it is for",
        copy: "Age, colours, favourite things, the venue and how many guests. A voice note is enough to start.",
      },
      {
        step: "02",
        title: "A concept within hours",
        copy: "You receive a visual direction and a clear quote, usually the same day for birthdays. Approve it and we lock the date.",
      },
      {
        step: "03",
        title: "We prepare everything",
        copy: "Balloons, backdrops, props and signage are prepared before we arrive, so installation is fast and clean.",
      },
      {
        step: "04",
        title: "The two-hour transformation",
        copy: "Our crew installs, styles the cake table, checks the lighting and clears every scrap before your guests arrive.",
      },
    ],
    occasions: [
      "First birthday",
      "Kids’ theme party",
      "Teen birthday",
      "Milestone 18th / 25th",
      "50th & 60th",
      "Surprise room setup",
      "Office birthday",
      "Anniversary-adjacent celebrations",
    ],
    gallery: [
      { src: birthday, caption: "Cream, gold and ivory — a birthday that looks grown-up." },
      { src: cat(1), caption: "The cake table, styled to be photographed first." },
      { src: cat(2), caption: "Kids’ themes built in premium materials." },
      { src: cat(8), caption: "Room surprises, installed while they were out." },
      { src: cat(20), caption: "Stage styling for a big reveal." },
      { src: cat(15), caption: "The dessert and drinks table, carried through the theme." },
    ],
    packages: [
      {
        name: "The Signature Birthday",
        bestFor: "A complete look that guests will photograph the moment they walk in.",
        featured: true,
        includes: [
          "Balloon architecture as the centrepiece",
          "Styled cake table with florals and props",
          "Custom backdrop and name signage",
          "Lighting accents and welcome details",
          "Two-hour installation and safe removal",
        ],
      },
      {
        name: "The Theme World",
        bestFor: "Kids’ parties and milestone birthdays where the theme is the point.",
        includes: [
          "Full theme build — backdrop, props and entrance",
          "Balloon installation across the venue",
          "Cake table, signage and table styling",
          "Kids’ seating or activity corner styling",
          "One styling captain on site",
        ],
      },
      {
        name: "The Intimate Surprise",
        bestFor: "Home celebrations, room surprises and small gatherings.",
        includes: [
          "One hero installation — room, wall or cake table",
          "Balloons, florals and a personalised sign",
          "Cake table styling",
          "Quiet instalment while the birthday person is away",
          "Ready in about 90 minutes",
        ],
      },
    ],
    proof: [
      {
        quote:
          "They turned our living room into something from a magazine in under two hours. My son thought we had moved.",
        name: "Neha Agrawal",
        meta: "First birthday · Palasia",
      },
      {
        quote:
          "Booked at short notice for a 50th. The gold and ivory setup looked far more expensive than it was.",
        name: "Vivek Malhotra",
        meta: "50th birthday · Scheme 78",
      },
      {
        quote:
          "The theme was exactly what my daughter described — she felt like it had been designed just for her. It had.",
        name: "Shruti Bansal",
        meta: "Kids’ birthday · Nipania",
      },
    ],
    faqs: [
      {
        question: "Can you manage a birthday at 24–48 hours’ notice?",
        answer:
          "Usually, yes. Birthdays are faster to produce than weddings, and we hold a limited number of short-notice slots each day. Send the date, venue and theme — you will have a concept and a quote the same day if the slot is free.",
      },
      {
        question: "Do you only do kids’ birthdays?",
        answer:
          "Not at all. Around half of our birthday work is for adults — 18ths, 25ths, 50ths and office celebrations. The materials change, the restraint changes, the standard does not.",
      },
      {
        question: "Can you match a theme from Pinterest or Instagram?",
        answer:
          "Yes, and we will tell you honestly when a reference image will not work in your space. We recreate the feeling with premium materials and adjust proportions for your room, rather than copying a photo that was shot in a hall twice the size.",
      },
      {
        question: "How long does the setup take?",
        answer:
          "Most birthday setups are complete in about two hours; a single room surprise takes closer to 90 minutes. We schedule so everything is finished before the first guest — or before the birthday person returns.",
      },
      {
        question: "What does a birthday setup cost?",
        answer:
          "It depends on scale, backdrop size and florals. After a short conversation we send a clear, itemised quote with the exact inclusions — no vague “starting from” number that grows on the day.",
      },
    ],
    urgency:
      "We accept a limited number of installations each day so every setup gets the same standard. Weekend evenings and the hours before a party go first — if the date matters, it is worth asking now.",
    closing: {
      heading: "Tell us the age. We will build the moment.",
      copy: "Send the date and a rough idea — colours, a theme, even just a feeling. You will receive a concept and an honest quote, usually within the hour.",
    },
  },
  {
    slug: "anniversaries-surprises",
    name: "Anniversaries & Surprises",
    shortName: "Anniversaries",
    eyebrow: "THE INTIMATE COLLECTION",
    hook: "The surprise they will describe to people for years.",
    promise:
      "A candlelit table for two, a room filled with their favourite flowers, a proposal planned to the last petal. Quiet, precise, entirely theirs — installed while they have no idea it is happening.",
    tagline: "Just the two of you.",
    heroImage: anniversary,
    accentImage: cat(7),
    accentCaption: "Some moments are better staged than improvised.",
    quickFacts: [
      { label: "Setup window", value: "60–90 minutes" },
      { label: "Design lead time", value: "Same day possible" },
      { label: "Discretion", value: "Fully planned around you" },
      { label: "Best times", value: "Evenings & rooftops" },
    ],
    intro: {
      heading: "The most memorable surprises are the ones that look effortless.",
      paragraphs: [
        "A surprise has two audiences: the person walking through the door, and the story they will tell afterwards. Both depend on timing — the room has to be perfect before the door opens, and it has to feel like it was always meant to be this way.",
        "We design for that one moment. Candles placed so the light catches the flowers, a table set for two rather than a stage set for fifty, and a plan for how you will get them there without raising suspicion.",
        "Whether it is a first anniversary in a small flat or a proposal on a rooftop, the rule is the same: nobody should be able to see the production, only the feeling.",
      ],
      pullQuote:
        "“A last-minute anniversary surprise, planned and installed the same evening. Discreet, punctual and genuinely beautiful.” — Rohit Sharma, Scheme 54",
    },
    pillars: [
      {
        title: "Designed for one person",
        copy: "Their flowers, their palette, their favourite song of a detail. Nothing generic, nothing that could have been ordered for anybody else.",
      },
      {
        title: "Installed in secret",
        copy: "Fixed schedules, quiet crews and a plan for keeping the surprise intact — right down to where they should not walk first.",
      },
      {
        title: "Intimate, never crowded",
        copy: "Restraint is the luxury here. A few extraordinary elements placed perfectly, not a hall of balloons competing for attention.",
      },
    ],
    inclusions: [
      {
        title: "Candlelit dinner setups",
        copy: "A table for two with florals, candles, place settings and a view worth sitting still for.",
      },
      {
        title: "Room & suite styling",
        copy: "Balloons, petals, letters and lighting arranged into a reveal that works in one glance.",
      },
      {
        title: "Proposal staging",
        copy: "Ring placement, a path of petals, the right photograph angle — and a plan for the moment after she says yes.",
      },
      {
        title: "Rooftop & balcony styling",
        copy: "Outdoor spaces dressed for privacy, breeze and photographs after sunset.",
      },
      {
        title: "Photo-ready details",
        copy: "Every corner works on camera, because this moment will be photographed by someone, even if it is just the two of you.",
      },
      {
        title: "First-night styling",
        copy: "A softly lit suite with florals, candles and quiet luxury for the first evening as a married couple.",
      },
      {
        title: "Surprise logistics",
        copy: "We plan arrival, installation and reveal timings with you so nothing spoils the moment.",
      },
      {
        title: "A single point of contact",
        copy: "One person from our team stays reachable through the evening — just in case the plan needs a last-minute adjustment.",
      },
    ],
    timeline: [
      {
        step: "01",
        title: "Whisper the plan",
        copy: "Tell us the date, the place and what they love. If it is a secret, we keep it that way — no calls to the wrong phone, no messages that give it away.",
      },
      {
        step: "02",
        title: "A design in hours",
        copy: "Same-day concepts are normal here. We confirm the palette, the layout and the quote, then lock the reveal window.",
      },
      {
        step: "03",
        title: "The quiet install",
        copy: "Our crew arrives at the agreed time, works fast and quietly, and leaves the space finished and lit before they return.",
      },
      {
        step: "04",
        title: "The reveal",
        copy: "You bring them to the door. Everything after that is the moment you were paying for.",
      },
    ],
    occasions: [
      "Anniversary",
      "Proposal",
      "Room surprise",
      "First night",
      "Date night",
      "Birthday surprise",
      "Welcome home",
      "Just because",
    ],
    gallery: [
      { src: anniversary, caption: "Candlelight, florals and a table for two." },
      { src: cat(6), caption: "Roses, candlelight and a palette chosen for the two of them." },
      { src: cat(7), caption: "A proposal staged to be photographed from one perfect angle." },
      { src: cat(8), caption: "The room reveal — installed while they were away." },
      { src: cat(9), caption: "First-night styling with quiet, warm light." },
      { src: hero, caption: "Dessert and Champagne styling for the moment after." },
    ],
    packages: [
      {
        name: "The Signature Surprise",
        bestFor: "Anniversaries and proposals that need to land in one perfect moment.",
        featured: true,
        includes: [
          "Full room or terrace styling with a single hero focal point",
          "Fresh florals, candles and lighting design",
          "Personal letters, signage or photo details",
          "Discreet, timed installation",
          "Reveal plan planned with you in advance",
        ],
      },
      {
        name: "The Proposal",
        bestFor: "The question — and the photographs that will outlive it.",
        includes: [
          "Proposal setting: petals, candles, florals and a private corner",
          "Ring presentation styling",
          "Photo-ready angles and lighting",
          "Coordination with your photographer",
          "A backup plan for weather and timing",
        ],
      },
      {
        name: "The Quiet Evening",
        bestFor: "A meaningful date night without a production.",
        includes: [
          "Dinner table for two, styled and lit",
          "Floral arrangement and candle styling",
          "A personal note or signage",
          "Setup and clear-up handled entirely",
          "Ready in about an hour",
        ],
      },
    ],
    proof: [
      {
        quote:
          "Everything was ready before we walked in. She cried before she even reached the table.",
        name: "Rohit Sharma",
        meta: "Anniversary · Scheme 54",
      },
      {
        quote:
          "I proposed on the rooftop and had no idea how it would look. It looked like a film set — but warmer.",
        name: "Aman Verma",
        meta: "Proposal · Vijay Nagar",
      },
      {
        quote:
          "They kept the entire thing secret from my wife and from me being nervous. Worth every rupee.",
        name: "Karan Mehta",
        meta: "Anniversary · Old Palasia",
      },
    ],
    faqs: [
      {
        question: "Can you set up a surprise the same day?",
        answer:
          "Often yes. We keep a small number of same-day slots for surprises and proposals. Call or WhatsApp with the time and place — if we can do it, you will know within minutes, not hours.",
      },
      {
        question: "Will the person find out before the reveal?",
        answer:
          "Not if we plan it properly. We confirm one contact number, use a discreet arrival window and coordinate with you on where they should be. If a neighbour or security guard needs to be briefed, we handle that too.",
      },
      {
        question: "Can you work in an apartment or a hotel room?",
        answer:
          "Yes. Hotels, serviced apartments and homes are most of what we do. We work cleanly, avoid wall damage and restore the room completely if you need it back the same night.",
      },
      {
        question: "Do you arrange the photographer, cake or dinner too?",
        answer:
          "We can coordinate trusted partners for photography, cakes and dining, or work with yours. Our job is to make the whole evening feel like one plan rather than three vendors bumping into each other.",
      },
      {
        question: "What if we need to cancel or move the date?",
        answer:
          "Tell us as early as possible. Dates can usually be moved within the same month without losing the advance, as long as production has not begun. The exact terms are always written in your quote.",
      },
    ],
    urgency:
      "Evenings, rooftops and Friday nights are the first slots to fill. For a surprise, the date is the whole plan — the sooner it is held, the quieter your mind will be.",
    closing: {
      heading: "One evening. One reveal. Make it count.",
      copy: "Share the date and the secret. We will design it, time it and install it while no one is watching.",
    },
  },
  {
    slug: "baby-showers",
    name: "Baby Showers",
    shortName: "Baby showers",
    eyebrow: "THE LITTLE WONDER COLLECTION",
    hook: "A celebration as gentle as the news you are sharing.",
    promise:
      "Soft palettes, cloud-like balloons and a setting made for the mother-to-be to sit, be photographed and be looked after. Every detail chosen to feel calm, never crowded.",
    tagline: "Little beginnings, beautifully held.",
    heroImage: baby,
    accentImage: cat(3),
    accentCaption: "Soft structures, built to make her feel special.",
    quickFacts: [
      { label: "Setup window", value: "About 2 hours" },
      { label: "Design lead time", value: "2–7 days" },
      { label: "Palettes", value: "Pastel & neutral" },
      { label: "Formats", value: "Home, hall, hotel" },
    ],
    intro: {
      heading: "The mother-to-be should be the most comfortable person in the room.",
      paragraphs: [
        "Most baby shower decor looks beautiful in photographs and is miserable to sit in. A high chair that is hard to reach, a backdrop that blocks the breeze, a crowd with nowhere to stand — and a guest of honour who spends the afternoon adjusting instead of enjoying.",
        "We design the room around her first. A comfortable seat with a framed backdrop, a styled table within arm’s reach, gentle light, and enough open space for the aunts to gather without squeezing past anyone.",
        "The result is a setting that photographs beautifully precisely because it was designed to be lived in for a few hours.",
      ],
      pullQuote:
        "“The pastel clouds, the seating, the cake table — she was comfortable the whole afternoon, and it still looked like a magazine.” — a Palasia family",
    },
    pillars: [
      {
        title: "Comfort first",
        copy: "Seating, sightlines and space planned around the mother-to-be and the elders — then styled until it looks effortless.",
      },
      {
        title: "Soft palettes, premium finish",
        copy: "Pastels, ivory and warm neutrals in quality balloons and florals — never the plastic brightness of a party shop.",
      },
      {
        title: "Made for the camera",
        copy: "A framed seat, a styled table and flattering light, so every photograph of her looks as lovely as the news.",
      },
    ],
    inclusions: [
      {
        title: "Mom-to-be seating & backdrop",
        copy: "A decorated seat or swing framed for photographs, with cushions and a palette that flatters her outfit.",
      },
      {
        title: "Pastel balloon clouds",
        copy: "Organic garlands, cloud clusters and ceiling moments built in soft, premium colours.",
      },
      {
        title: "Welcome baby & naming styling",
        copy: "Warm, restful setups for the first meeting, naamkaran and homecoming celebrations.",
      },
      {
        title: "Dessert & cake table",
        copy: "A styled table for cake, mithai and gifts — arranged so guests can serve themselves without crowding her.",
      },
      {
        title: "Floral styling",
        copy: "Fresh-looking florals in gentle colours, matched to the nursery or to a favourite family palette.",
      },
      {
        title: "Signage & keepsakes",
        copy: "Name boards, “baby on the way” signage and small details families take home afterwards.",
      },
      {
        title: "Guest flow & comfort",
        copy: "Seating and table placement planned so elders, children and guests all have a comfortable spot.",
      },
      {
        title: "Quiet installation & removal",
        copy: "Installed before guests arrive, removed after the last photograph — with her home left as it was.",
      },
    ],
    timeline: [
      {
        step: "01",
        title: "Tell us the date and the palette",
        copy: "Share the venue, the guest count and whether you want traditional, modern or a blend of both.",
      },
      {
        step: "02",
        title: "A soft concept & quote",
        copy: "You receive a palette, a seating plan idea and a clear quote — usually within a day.",
      },
      {
        step: "03",
        title: "We prepare and arrive early",
        copy: "Structures and florals are prepared off-site, then installed quietly while the family gets ready.",
      },
      {
        step: "04",
        title: "Her moment, uninterrupted",
        copy: "Everything is finished before the first guest. Our crew stays invisible through the celebration.",
      },
    ],
    occasions: [
      "Baby shower",
      "Welcome baby",
      "Naming ceremony",
      "Godh bharai",
      "Mundan",
      "Homecoming",
      "Sibling announcement",
      "Family maternity shoot",
    ],
    gallery: [
      { src: baby, caption: "Blue and ivory — a boy’s shower with a soft, tailored palette." },
      { src: cat(3), caption: "A pastel cloud arch built around the seating." },
      { src: cat(4), caption: "Welcome baby styling for the first photographs at home." },
      { src: cat(5), caption: "The traditional jhula, dressed for a naming ceremony." },
      { src: cat(1), caption: "The dessert table, styled within arm’s reach." },
      { src: hero, caption: "Cake and florals in the family’s palette." },
    ],
    packages: [
      {
        name: "The Signature Shower",
        bestFor: "A complete shower that looks beautiful and keeps her comfortable.",
        featured: true,
        includes: [
          "Decorated seat, swing or backdrop",
          "Pastel balloon styling across the room",
          "Styled cake and gift table",
          "Florals and signage in the chosen palette",
          "Two-hour setup and complete removal",
        ],
      },
      {
        name: "The Full Celebration",
        bestFor: "Larger halls and joint families who want the whole room styled.",
        includes: [
          "Entrance, seating and stage styling",
          "Ceiling installations and balloon clouds",
          "Dessert table, welcome board and table details",
          "Floral styling throughout the room",
          "Styling captain on site for the full event",
        ],
      },
      {
        name: "The Home Welcome",
        bestFor: "Welcome baby, homecoming and intimate family ceremonies.",
        includes: [
          "One hero moment — cot, doorway or living room corner",
          "Soft balloons, florals and a name board",
          "A styled corner for family photographs",
          "Quiet setup in about 90 minutes",
          "Everything cleared after the visit",
        ],
      },
    ],
    proof: [
      {
        quote:
          "She was comfortable, the guests were comfortable and the photos are beautiful. That is a rare combination.",
        name: "Ankita Soni",
        meta: "Baby shower · Scheme 54",
      },
      {
        quote:
          "We had the naming ceremony at home. They styled the jhula and the doorway — my mother still has the photos on her phone.",
        name: "Pooja Rathore",
        meta: "Naming ceremony · Rau",
      },
      {
        quote:
          "The palette matched our nursery exactly. It felt like the room had always been meant to look that way.",
        name: "Megha Jain",
        meta: "Welcome baby · Nipania",
      },
    ],
    faqs: [
      {
        question: "How far ahead should we book a baby shower?",
        answer:
          "A week is comfortable; two to three days is usually enough for a home setup. Because the celebration often depends on the mother’s comfort and the doctor’s schedule, we also keep same-day slots for small home welcomes — just ask.",
      },
      {
        question: "Can you match the nursery or a specific outfit?",
        answer:
          "Yes, and we love doing it. Share a photo of the nursery, the outfit she plans to wear or the invitation card, and we will build the palette around it so everything in the photographs agrees.",
      },
      {
        question: "Do you handle traditional setups like a jhula or mandap-style seating?",
        answer:
          "Yes. We regularly style jhulas, traditional seating, pooja corners and blended setups that respect family customs while still feeling contemporary and light.",
      },
      {
        question: "What if the baby arrives early and we need to move the date?",
        answer:
          "That happens more often than you would think, and we plan for it. Let us know as soon as you can and we will move the date or simplify the setup — a happy baby outranks any schedule.",
      },
      {
        question: "Will the setup damage our home?",
        answer:
          "No. We use damage-free mounting and freestanding structures wherever possible, protect floors and furniture, and leave the space exactly as we found it.",
      },
    ],
    urgency:
      "Baby showers are often planned around the mother’s energy and doctor’s advice, which means dates shift late. The sooner we know, the more gracefully we can hold the date and the design for you.",
    closing: {
      heading: "Celebrate her before the little one arrives.",
      copy: "Send us the date and the palette. We will make sure she is the most comfortable — and the most photographed — person in the room.",
    },
  },
  {
    slug: "devotional-celebrations",
    name: "Devotional Celebrations",
    shortName: "Devotional",
    eyebrow: "THE DEVOTIONAL COLLECTION",
    hook: "Decor that knows when to be quiet.",
    promise:
      "Marigold garlands, brass accents and a decorum that honours tradition. For Mataji, Ganeshji, griha pravesh and inauguration poojas — styled with the care the occasion deserves.",
    tagline: "Tradition, with grace.",
    heroImage: devotional,
    accentImage: cat(12),
    accentCaption: "Entrances dressed for the blessing, not for the camera.",
    quickFacts: [
      { label: "Setup window", value: "1.5–3 hours" },
      { label: "Design lead time", value: "2–5 days" },
      { label: "Focus", value: "Respect & restraint" },
      { label: "Formats", value: "Home, mandir, venue" },
    ],
    intro: {
      heading: "Some occasions ask for beauty. These ask for respect first.",
      paragraphs: [
        "Devotional decor has a different set of rules. The deity is the centre, not the backdrop. The flowers should feel fresh and clean, the light should be warm, and nothing should compete with the ritual itself.",
        "We design so the pooja can happen comfortably: a clear path for the pandit, seating that respects the elders, and a mandir or stage that looks elevated without becoming a stage set.",
        "The result is a space that feels sacred to the family and beautiful to the guests — without either one sacrificing the other.",
      ],
      pullQuote:
        "“Traditional, clean and genuinely beautiful. My mother said it felt like the mandir at home had grown a little bigger.” — the Verma family, Khajrana",
    },
    pillars: [
      {
        title: "Ritual comes first",
        copy: "Layouts planned around the pandit, the family and the offerings — then decorated, never the other way around.",
      },
      {
        title: "Fresh, never flashy",
        copy: "Marigold, jasmine, brass, cotton and warm light. We avoid anything that pulls the eye away from the deity.",
      },
      {
        title: "Respect for custom",
        copy: "We ask about family traditions before we suggest anything. Your customs decide the design, not our portfolio.",
      },
    ],
    inclusions: [
      {
        title: "Mataji & Ganeshji decor",
        copy: "Mandir, chowki and stage styling with fresh flowers, drape and traditional accents.",
      },
      {
        title: "Griha pravesh styling",
        copy: "Doorway, rangoli, kalash and entrance details that welcome guests and blessings alike.",
      },
      {
        title: "Inauguration & pooja setups",
        copy: "Shop openings, office poojas and factory inaugurations with ribbons, garlands and a clean stage.",
      },
      {
        title: "Traditional floral work",
        copy: "Marigold, jasmine and fresh-flower garlands arranged with the density and neatness the occasion calls for.",
      },
      {
        title: "Diya & lighting design",
        copy: "Warm, flame-safe lighting arrangements that photograph gently and stay comfortable through long rituals.",
      },
      {
        title: "Prasad & seating arrangements",
        copy: "Tables, seating and offering areas placed so guests can move without disturbing the pooja.",
      },
      {
        title: "Family custom coordination",
        copy: "We plan around your pandit, your timings and your family’s specific customs.",
      },
      {
        title: "Quiet install and cleanup",
        copy: "Early installation, careful removal and no disturbance to the home or the ritual space.",
      },
    ],
    timeline: [
      {
        step: "01",
        title: "Tell us the ritual",
        copy: "Which occasion, which deity, which family customs and what time the pooja begins. We follow your lead.",
      },
      {
        step: "02",
        title: "A respectful concept",
        copy: "You receive a design and quote that fits the ritual timeline — including how early we must finish.",
      },
      {
        step: "03",
        title: "Installed before the pooja",
        copy: "Our team finishes well before the pandit arrives and stays out of the way of the family’s preparations.",
      },
      {
        step: "04",
        title: "A calm celebration",
        copy: "The space is ready, the ritual proceeds undisturbed, and we return at the agreed time to clear everything.",
      },
    ],
    occasions: [
      "Ganesh Sthapana",
      "Mataji pooja",
      "Griha pravesh",
      "Inauguration pooja",
      "Satyanarayan katha",
      "Navratri",
      "Mundan",
      "Naming ceremony",
    ],
    gallery: [
      { src: devotional, caption: "Ganeshji styled with marigold, brass and warm light." },
      { src: cat(12), caption: "The doorway, dressed for griha pravesh." },
      { src: cat(5), caption: "A traditional jhula for a naming ceremony." },
      { src: cat(18), caption: "An inauguration entrance, respectful and celebratory at once." },
      { src: cat(11), caption: "Floral work that frames without distracting." },
      { src: hero, caption: "Prasad and dessert styling in the family’s palette." },
    ],
    packages: [
      {
        name: "The Signature Pooja",
        bestFor: "Festive home poojas, Mataji and Ganeshji celebrations.",
        featured: true,
        includes: [
          "Mandir, chowki or stage styling",
          "Fresh floral work in traditional colours",
          "Warm lighting and drape",
          "Prasad and offering table styling",
          "Setup completed before the ritual begins",
        ],
      },
      {
        name: "The Griha Pravesh",
        bestFor: "New homes and first poojas.",
        includes: [
          "Doorway, entrance and threshold styling",
          "Rangoli, kalash and floral details",
          "Living room or pooja corner styling",
          "Seating and offering areas",
          "Clean removal after the ceremony",
        ],
      },
      {
        name: "The Inauguration",
        bestFor: "Shops, offices and commercial openings.",
        includes: [
          "Entrance arch and ribbon-cut moment",
          "Garlands, florals and signage",
          "Stage or counter styling for the pooja",
          "Guest and photograph-friendly layout",
          "Timed setup before the muhurat",
        ],
      },
    ],
    proof: [
      {
        quote:
          "They understood exactly how much decoration a pooja should have. Nothing loud, nothing missing.",
        name: "Sunita Verma",
        meta: "Mataji pooja · Khajrana",
      },
      {
        quote:
          "Our griha pravesh looked beautiful and the pandit had a clear path the entire time. That mattered to us.",
        name: "Mahesh Agrawal",
        meta: "Griha pravesh · Scheme 136",
      },
      {
        quote:
          "The inauguration looked premium without feeling like a party. Exactly what we wanted for the shop.",
        name: "Nitin Soni",
        meta: "Inauguration · AB Road",
      },
    ],
    faqs: [
      {
        question: "Do you follow specific family or regional traditions?",
        answer:
          "Yes — tell us what your family follows and we will design around it. We ask about the deity, the ritual order, the pandit’s requirements and any objects the family places themselves, so nothing is moved or disturbed.",
      },
      {
        question: "Can you install before an early morning muhurat?",
        answer:
          "Yes. Early-morning installations are common for poojas and inaugurations. We schedule the completion so the family has time to bathe, dress and prepare without watching a crew work.",
      },
      {
        question: "Do you use fresh flowers?",
        answer:
          "We use fresh flowers wherever the ritual calls for them and premium artificial florals only where freshness cannot hold through the event. We will always tell you which is which before the quote is confirmed.",
      },
      {
        question: "Can the decor be reused for Navratri or a second day?",
        answer:
          "Often, yes. We can design structures that hold through multiple days and advise on how to keep them looking fresh. If you need a day-two refresh, we can schedule a short visit.",
      },
      {
        question: "Will the setup disturb the home or mandir?",
        answer:
          "No. We work carefully around existing mandirs, protect floors and furniture, and remove everything without leaving residue or damage.",
      },
    ],
    urgency:
      "Festival and muhurat dates concentrate every family in the city onto the same few days. If your date is fixed by the panchang, it is worth reserving early — we can only be in one place at a time, and we say so honestly.",
    closing: {
      heading: "Let the blessings have a beautiful setting.",
      copy: "Share the ritual, the date and your family’s customs. We will design around them with the care the occasion deserves.",
    },
  },
];

export const getService = (slug: string) =>
  getOccasion(slug) ?? serviceDetails.find((item) => item.slug === slug);

export const serviceSlugs = [...occasionPages, ...serviceDetails].map((item) => item.slug);

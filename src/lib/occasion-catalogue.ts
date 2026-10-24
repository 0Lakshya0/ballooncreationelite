import { occasionEntries } from "./occasion-entries";
import { suppliedOccasionPhotos } from "./supplied-occasion-photos";
const content: Record<
  string,
  { summary: string; inclusions: string[]; ideaNames: string[]; note: string }
> = {
  birthday: {
    summary: "A happy birthday setup for a home, rooftop or party venue.",
    inclusions: [
      "Balloon colours",
      "Birthday name or number",
      "Cake-table decoration",
      "Photo corner",
    ],
    ideaNames: ["Small birthday corner", "Balloon backdrop", "Whole party area"],
    note: "Tell us the age, guest count and where you want to cut the cake.",
  },
  "kids-birthday": {
    summary: "A colourful birthday space based on your child’s favourite theme.",
    inclusions: ["Theme colours", "Name and age display", "Cake-table backdrop", "Photo area"],
    ideaNames: ["Favourite-colour setup", "Character-inspired backdrop", "Theme party area"],
    note: "Share the child’s age and favourite theme. Keep loose balloons and small props away from young children.",
  },
  "baby-shower": {
    summary: "A gentle, welcoming setup for the parent-to-be and family.",
    inclusions: ["Soft colour palette", "Seating backdrop", "Welcome sign", "Family photo area"],
    ideaNames: ["Small seating corner", "Pastel balloon backdrop", "Family celebration area"],
    note: "Tell us whether the function is at home or a hall, and where the parent-to-be will sit.",
  },
  "welcome-baby": {
    summary: "Decorate your home to welcome a new baby and family.",
    inclusions: [
      "Entrance decoration",
      "Welcome message",
      "Soft colour accents",
      "Family photo corner",
    ],
    ideaNames: ["Welcome doorway", "Living-room welcome", "Entrance and room setup"],
    note: "Discuss fragrance-free options and keep loose balloons and small decorations away from the baby.",
  },
  "naming-ceremony": {
    summary: "A simple, cheerful setting for your baby’s naming ceremony.",
    inclusions: [
      "Ceremony backdrop",
      "Baby-name display",
      "Seating-area decoration",
      "Family photo corner",
    ],
    ideaNames: ["Name-display corner", "Ceremony backdrop", "Family gathering setup"],
    note: "Share the ceremony time and your family’s traditions so decoration leaves space for the rituals.",
  },
  anniversary: {
    summary: "Celebrate another year together with flowers, balloons or a private surprise.",
    inclusions: [
      "Anniversary message",
      "Chosen colour palette",
      "Table or backdrop styling",
      "Photo display idea",
    ],
    ideaNames: ["Small surprise corner", "Couple photo backdrop", "Dinner-area decoration"],
    note: "Tell us whether it is a surprise, and when we can enter the venue without revealing it.",
  },
  proposal: {
    summary: "Create a personal setting for asking a very special question.",
    inclusions: [
      "Proposal message",
      "Flower or balloon accents",
      "Photo-ready backdrop",
      "Lighting ideas",
    ],
    ideaNames: [
      "Private proposal corner",
      "Flower-and-message backdrop",
      "Rooftop proposal setting",
    ],
    note: "Share the location, timing and access arrangements. Venue permission and weather plans should be agreed first.",
  },
  "room-surprise": {
    summary: "Turn a room into a thoughtful surprise for someone you love.",
    inclusions: [
      "Personal message",
      "Room colour theme",
      "Photo or balloon accents",
      "Bedside or wall decoration",
    ],
    ideaNames: ["Message and balloon corner", "Photo-memory room", "Flowers and room styling"],
    note: "Confirm room access with the owner or hotel. Discuss suitable attachments before placing decorations on walls.",
  },
  "first-night": {
    summary: "A private, tasteful room setup for a newly married couple.",
    inclusions: [
      "Chosen flower colours",
      "Bed-area styling",
      "Soft decorative accents",
      "Personal message",
    ],
    ideaNames: ["Simple flower accents", "Flower-and-balloon room", "Coordinated room styling"],
    note: "Tell us your preferences and room-access time. We will discuss the setup discreetly; no personal details are needed.",
  },
  "bachelor-party": {
    summary: "A fun party backdrop for celebrating with friends before the wedding.",
    inclusions: [
      "Party colour theme",
      "Welcome or name sign",
      "Photo backdrop",
      "Table-area styling",
    ],
    ideaNames: ["Friends photo corner", "Party backdrop", "Venue party styling"],
    note: "Tell us the venue rules and group size. Decorations do not include drinks, entertainment or venue booking.",
  },
  wedding: {
    summary: "Plan coordinated decoration for your wedding or ring ceremony.",
    inclusions: [
      "Stage or mandap ideas",
      "Entrance decoration",
      "Flower colour planning",
      "Family photo area",
    ],
    ideaNames: ["Ring-ceremony backdrop", "Wedding stage styling", "Entrance and venue plan"],
    note: "Share the ceremony type, venue, guest count and timing. Stage structures and venue permissions must be discussed before booking.",
  },
  "house-warming": {
    summary: "Welcome family and guests to your new home with simple decoration.",
    inclusions: [
      "Entrance decoration",
      "Flower or balloon accents",
      "Welcome message",
      "Gathering-area styling",
    ],
    ideaNames: ["New-home entrance", "Welcome and photo corner", "Entrance and gathering area"],
    note: "Let us know about any puja or rituals so doors, walkways and ceremony spaces stay clear.",
  },
  "car-decoration": {
    summary: "Flower or ribbon styling for a wedding car or special delivery.",
    inclusions: [
      "Flower colour ideas",
      "Ribbon accents",
      "Bonnet styling",
      "Car-theme coordination",
    ],
    ideaNames: ["Ribbon accents", "Flower bonnet styling", "Coordinated wedding car"],
    note: "Share the car model and travel plan. Confirm paint-safe attachments, clear visibility and access with the team.",
  },
  "pet-decoration": {
    summary: "A photo-ready corner for celebrating your pet’s special day.",
    inclusions: [
      "Pet-name sign",
      "Colour-themed backdrop",
      "Photo-corner styling",
      "Owner-and-pet photo space",
    ],
    ideaNames: ["Pet photo corner", "Name and birthday backdrop", "Family-and-pet setup"],
    note: "Keep decorations out of chewing reach. Discuss safe placement; no loose balloons or small props should be left with pets.",
  },
  "farewell-party": {
    summary: "A warm send-off for a colleague, teacher, friend or class.",
    inclusions: [
      "Farewell message",
      "Photo-memory display",
      "Backdrop colours",
      "Group-photo area",
    ],
    ideaNames: ["Farewell message corner", "Memory-photo backdrop", "Group celebration area"],
    note: "Tell us who the farewell is for, the message you want and how many people will be in the photos.",
  },
  "corporate-events": {
    summary: "Clear, coordinated decoration for an office event or business gathering.",
    inclusions: [
      "Brand-colour planning",
      "Welcome backdrop",
      "Stage or photo-area styling",
      "Table accents",
    ],
    ideaNames: ["Office welcome corner", "Branded photo backdrop", "Event-area decoration"],
    note: "Share brand guidelines and venue rules. Printing, branding permissions and installation access must be confirmed.",
  },
  "showroom-setup": {
    summary: "Decorate your showroom for a launch, offer day or special occasion.",
    inclusions: [
      "Entrance accents",
      "Brand-colour decoration",
      "Display-area styling",
      "Customer photo spot",
    ],
    ideaNames: ["Entrance highlight", "Display and photo corner", "Showroom celebration plan"],
    note: "Share frontage and display photos. Keep product visibility, customer access and exits clear.",
  },
  "grand-opening": {
    summary: "A welcoming entrance and photo area for your new business.",
    inclusions: [
      "Opening-day colour theme",
      "Entrance decoration",
      "Welcome sign",
      "Ribbon-area styling",
    ],
    ideaNames: ["Opening entrance", "Entrance and ribbon area", "Opening-day venue setup"],
    note: "Tell us the opening time and frontage size. Confirm permission for outdoor decoration and keep a weather backup.",
  },
  "annual-day-function": {
    summary: "A neat stage and welcome area for your school, college or company function.",
    inclusions: [
      "Stage-backdrop ideas",
      "Event-name display",
      "Entrance decoration",
      "Photo-area styling",
    ],
    ideaNames: ["Stage backdrop", "Stage and welcome area", "Function-area decoration"],
    note: "Share the programme, stage measurements and venue rules. Sound, lighting equipment and stage construction are not automatically included.",
  },
};
export const occasionPages = occasionEntries.map((entry) => {
  const copy = content[entry.slug]!;
  const heroImage = suppliedOccasionPhotos[entry.slug].image;
  return {
    ...entry,
    kind: "occasion" as const,
    heading:
      entry.name === "Showroom Setup"
        ? "Showroom decoration in Indore"
        : `${entry.name}${/decoration/i.test(entry.name) ? "" : " decoration"} in Indore`,
    promise: copy.summary,
    heroImage,
    planningNote: copy.note,
    inclusions: copy.inclusions,
    packages: copy.ideaNames.map((name, index) => ({
      name,
      bestFor:
        index === 0
          ? `Start with ${copy.inclusions
              .slice(0, 2)
              .map((s) => s.toLowerCase())
              .join(" and ")}.`
          : index === 1
            ? `Add more detail with ${copy.inclusions[2]!.toLowerCase()}.`
            : `Bring the look together with ${copy.inclusions[3]!.toLowerCase()}.`,
      includes: copy.inclusions.slice(0, index === 0 ? 2 : index === 1 ? 3 : 4),
    })),
    faqs: [
      {
        question: `What can you decorate for ${entry.name.toLowerCase()}?`,
        answer:
          copy.summary +
          " We can discuss " +
          copy.inclusions.map((s) => s.toLowerCase()).join(", ") +
          ". The final inclusions are agreed in your quote.",
      },
      {
        question: "I am not sure which idea to choose. Can you help?",
        answer:
          "Yes. Share a photo of the space and your occasion. You can ask for suggestions without choosing an idea first.",
      },
      {
        question: "How do I find out the cost and availability?",
        answer:
          "Send your date, venue or area and the idea you like on WhatsApp. We will confirm availability and discuss a quote. No booking is made automatically.",
      },
      {
        question: "What should I check before booking?",
        answer:
          copy.note +
          " Colours, materials, access time and any extras are confirmed before you book.",
      },
    ],
  };
});
export type OccasionPage = (typeof occasionPages)[number];
export const getOccasion = (slug: string) => occasionPages.find((item) => item.slug === slug);
export function occasionMessage(name: string, idea: string, date: string, area: string) {
  return [
    "Hi Balloon Creation!",
    `I am planning ${name}.`,
    idea
      ? `Idea I like: ${idea}.`
      : "I am not sure which setup to choose. Please help me with ideas.",
    date ? `Event date: ${date}.` : "",
    area.trim() ? `Venue / area: ${area.trim()}.` : "",
    "Please confirm availability, what is included and a quote.",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Shared names/slugs only: safe for form validation; no assets, browser or server secrets. */
export const occasionEntries = [
  {
    name: "Birthday",
    slug: "birthday",
    group: "Family",
    photo: 1,
  },
  {
    name: "Kids Birthday",
    slug: "kids-birthday",
    group: "Family",
    photo: 2,
  },
  {
    name: "Baby Shower",
    slug: "baby-shower",
    group: "Family",
    photo: 3,
  },
  {
    name: "Welcome Baby",
    slug: "welcome-baby",
    group: "Family",
    photo: 4,
  },
  {
    name: "Naming Ceremony",
    slug: "naming-ceremony",
    group: "Family",
    photo: 5,
  },
  {
    name: "Anniversary",
    slug: "anniversary",
    group: "Couples",
    photo: 6,
  },
  {
    name: "Proposal",
    slug: "proposal",
    group: "Couples",
    photo: 7,
  },
  {
    name: "Room Surprise",
    slug: "room-surprise",
    group: "Couples",
    photo: 8,
  },
  {
    name: "First Night",
    slug: "first-night",
    group: "Couples",
    photo: 9,
  },
  {
    name: "Bachelor Party",
    slug: "bachelor-party",
    group: "Couples",
    photo: 10,
  },
  {
    name: "Wedding",
    slug: "wedding",
    group: "Couples",
    photo: 11,
  },
  {
    name: "House Warming",
    slug: "house-warming",
    group: "Home & milestones",
    photo: 12,
  },
  {
    name: "Car Decoration",
    slug: "car-decoration",
    group: "Home & milestones",
    photo: 13,
  },
  {
    name: "Pet Decoration",
    slug: "pet-decoration",
    group: "Family",
    photo: 14,
  },
  {
    name: "Farewell Party",
    slug: "farewell-party",
    group: "Work & events",
    photo: 15,
  },
  {
    name: "Corporate Events",
    slug: "corporate-events",
    group: "Work & events",
    photo: 16,
  },
  {
    name: "Showroom Setup",
    slug: "showroom-setup",
    group: "Work & events",
    photo: 17,
  },
  {
    name: "Grand Opening",
    slug: "grand-opening",
    group: "Work & events",
    photo: 18,
  },
  {
    name: "Exhibition Stall",
    slug: "exhibition-stall",
    group: "Work & events",
    photo: 19,
  },
  {
    name: "Annual Day Function",
    slug: "annual-day-function",
    group: "Work & events",
    photo: 20,
  },
] as const;
export type OccasionName = (typeof occasionEntries)[number]["name"];
export const occasionNames = occasionEntries.map((item) => item.name);

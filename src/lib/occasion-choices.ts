import { occasionNames } from "./occasion-entries";
/** Retain valid enquiries from the five existing signature pages as well as all new occasions. */
export const signatureOccasionNames = [
  "Grand Weddings & Rings",
  "Mega Birthdays",
  "Anniversaries & Surprises",
  "Baby Showers",
  "Devotional Celebrations",
];
export const occasionChoices: readonly string[] = [
  ...new Set([...occasionNames, ...signatureOccasionNames]),
];
export const isKnownOccasion = (value: string) => occasionChoices.includes(value);

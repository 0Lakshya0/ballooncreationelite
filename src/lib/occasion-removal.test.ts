import { expect, it } from "vitest";
import { occasionEntries } from "./occasion-entries";
import { occasionPages, getOccasion } from "./occasion-catalogue";
import { occasionChoices, isKnownOccasion } from "./occasion-choices";
import { heroSlides } from "./hero-slides";
import { getService, serviceSlugs } from "./service-details";
import { searchServices, rankSearch } from "./site-search";
import { stats } from "./site-content";

it("removes Exhibition Stall from every shared discovery and enquiry source", () => {
  expect(occasionEntries).toHaveLength(19);
  expect(searchServices).toHaveLength(24);
  for (const data of [
    occasionEntries,
    occasionPages,
    occasionChoices,
    heroSlides,
    searchServices,
    serviceSlugs,
  ])
    expect(JSON.stringify(data)).not.toMatch(/exhibition|exhibition-stall|category-19/i);
  expect(getOccasion("exhibition-stall")).toBeUndefined();
  expect(getService("exhibition-stall")).toBeUndefined();
  expect(isKnownOccasion("Exhibition Stall")).toBe(false);
  expect(stats.find((stat) => stat.label === "Celebration formats")?.value).toBe(19);
});
it("retains neighbouring occasions, original photo identities, and all other detail routes", () => {
  expect(occasionEntries.find((item) => item.slug === "annual-day-function")?.photo).toBe(20);
  for (const name of ["Annual Day Function", "Grand Opening", "Showroom Setup", "Birthday"])
    expect(isKnownOccasion(name)).toBe(true);
  for (const entry of searchServices) expect(getService(entry.slug)).toBeDefined();
  for (const query of ["exhibition", "exhibition stall", "expo", "trade fair"])
    expect(
      rankSearch(
        query,
        searchServices,
        (item) => item.name,
        (item) => item.aliases,
      ).some((item) => item.slug === "exhibition-stall"),
    ).toBe(false);
});

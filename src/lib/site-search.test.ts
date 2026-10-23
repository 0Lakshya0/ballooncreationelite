import { describe, expect, it } from "vitest";
import { searchServices, rankSearch } from "./site-search";
import { indoreAreas } from "./indore-areas";
const search = (q: string) =>
  rankSearch(
    q,
    searchServices,
    (s) => s.name,
    (s) => s.aliases,
  );
describe("local ranked catalogue search", () => {
  it.each([
    ["birthday", "birthday"],
    ["BIRTHDAY", "birthday"],
    ["birthday decoration", "birthday"],
    ["birthdaydecoration", "birthday"],
    ["birtday", "birthday"],
    ["brithday", "birthday"],
    ["bday", "birthday"],
    ["janamdin", "birthday"],
    ["जन्मदिन", "birthday"],
    ["kids birthday", "kids-birthday"],
    ["babyshower", "baby-shower"],
    ["godbharai", "baby-shower"],
    ["shaadi", "wedding"],
    ["weding", "wedding"],
    ["शादी", "wedding"],
    ["naamkaran", "naming-ceremony"],
    ["griha pravesh", "house-warming"],
    ["corporate", "corporate-events"],
    ["mega birthdays", "mega-birthdays"],
  ])("%s ranks %s first", (query, slug) => expect(search(query)[0]?.slug).toBe(slug));
  it("finds every actual occasion and all premium pages without duplicate slugs", () => {
    expect(searchServices).toHaveLength(24);
    expect(new Set(searchServices.map((s) => s.slug)).size).toBe(24);
    for (const item of searchServices) expect(search(item.name)[0]?.slug).toBe(item.slug);
  });
  it("matches multiple intents while prioritising exact names", () => {
    expect(search("birthday in Vijay Nagar").some((s) => s.slug === "birthday")).toBe(true);
    expect(rankSearch("birthday in Vijay Nagar", indoreAreas, (p) => p)).toContain("Vijay Nagar");
    expect(rankSearch("vijaynagar", indoreAreas, (p) => p)[0]).toBe("Vijay Nagar");
  });
  it("does not invent a catalogue hit for unrelated text", () => {
    expect(search("zxqv998877")).toEqual([]);
  });
});

import { occasionEntries } from "./occasion-entries";
import { celebrations } from "./celebrations";

const aliases: Record<string, string> = {
  birthday: "bday birth day happy janamdin janmdin जन्मदिन birthday party balloons cake",
  "kids-birthday": "kids children child baby bachchon bacche बच्चों birthday bday theme cartoon",
  "baby-shower": "godh bharai godbharai गोद भराई pregnancy maternity mom mother baby shower",
  "welcome-baby": "newborn new born baby arrival hospital home welcome",
  "naming-ceremony": "naamkaran namkaran नामकरण baby name ceremony",
  anniversary: "anniversery anniversary सालगिरह salgirah marriage couple",
  proposal: "propose engagement ring romantic love surprise",
  "room-surprise": "romantic hotel bedroom room surprise candlelight love",
  "first-night": "wedding night suhagrat suhaag raat सुहागरात honeymoon",
  "bachelor-party": "bachelorette bachelor hen stag friends party",
  wedding: "shadi shaadi शादी vivah marriage mandap reception bridal wedding flowers",
  "house-warming": "griha pravesh grihapravesh गृह प्रवेश new house home warming",
  "car-decoration": "car gadi gaadi गाड़ी vehicle bridal wedding car flowers",
  "pet-decoration": "pet dog cat puppy kitten animal birthday",
  "farewell-party": "farewell goodbye retirement school college sendoff",
  "corporate-events": "office corporate company business work event function",
  "showroom-setup": "showroom shop store retail display setup",
  "grand-opening": "inauguration opening ribbon launch shop store उद्घाटन",
  "exhibition-stall": "exhibition expo stall trade fair booth",
  "annual-day-function": "annual day school college stage performance function",
  "devotional-celebrations":
    "puja pooja devotional ganesh ganpati mataji mandir temple festival पूजा गणेश",
};
export type SearchService = { name: string; slug: string; aliases: string };
export const searchServices: SearchService[] = [
  ...occasionEntries.map((item) => ({ ...item, aliases: aliases[item.slug] || "" })),
  ...celebrations.map((item) => ({
    name: item.name,
    slug: item.slug,
    aliases: `${item.intro} ${item.highlights.join(" ")} ${aliases[({ "mega-birthdays": "birthday", "grand-weddings-rings": "wedding", "anniversaries-surprises": "anniversary", "baby-showers": "baby-shower" } as Record<string, string>)[item.slug] || item.slug] || ""}`,
  })),
];
export function normalizeSearch(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u200b-\u200f]/gu, "")
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}
const noise = new Set(
  "what who how which where when about a an the for of in at to and or me my our your you do does can please show find search want looking need would like is are serve decoration decorations decor setup ideas photos pictures services near indore mujhe chahiye dikhao ke ki ka mein hai".split(
    " ",
  ),
);
function tokens(text: string) {
  return normalizeSearch(text)
    .split(" ")
    .filter((t) => t && !noise.has(t));
}
// Bounded edit distance including adjacent transpositions; short inputs never fuzzy-match.
function near(a: string, b: string): boolean {
  const limit = a.length >= 7 ? 2 : 1;
  if (a.length < 4 || b.length < 4 || Math.abs(a.length - b.length) > limit) return false;
  const rows = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) rows[i]![0] = i;
  for (let j = 0; j <= b.length; j++) rows[0]![j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      rows[i]![j] = Math.min(
        rows[i - 1]![j]! + 1,
        rows[i]![j - 1]! + 1,
        rows[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        rows[i]![j] = Math.min(rows[i]![j]!, rows[i - 2]![j - 2]! + 1);
    }
  return rows[a.length]![b.length]! <= limit;
}
export function rankSearch<T>(
  query: string,
  items: readonly T[],
  title: (item: T) => string,
  extra: (item: T) => string = () => "",
): T[] {
  const raw = normalizeSearch(query).slice(0, 1500);
  if (!raw) return items.slice(0, 5);
  const words = tokens(raw).slice(0, 20);
  return items
    .map((item, index) => {
      const name = normalizeSearch(title(item));
      const labelWords = tokens(name);
      const all = [...labelWords, ...tokens(extra(item))];
      const compact = raw.replace(/\s+/g, "");
      const compactName = name.replace(/\s+/g, "");
      const core = compact.replace(/decorations?|decor|setup/g, "");
      let score =
        name === raw
          ? 10000
          : compact === compactName
            ? 9900
            : core && core === compactName
              ? 9700
              : name.includes(raw)
                ? 3000
                : 0;
      if (!score && words.length === 1 && near(compact, compactName)) score = 10;
      for (const word of words) {
        if (labelWords.includes(word)) score += 200;
        else if (all.includes(word)) score += 80;
        else if (all.some((t) => t.startsWith(word))) score += 35;
        else if (all.some((t) => near(word, t))) score += 15;
      }
      return { item, index, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((r) => r.item);
}

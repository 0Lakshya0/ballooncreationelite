import { afterEach, expect, it, vi } from "vitest";
import { inquirySchema, isValidEventDate, todayInIndia } from "./concierge-validation";
afterEach(() => vi.useRealTimers());
it("rejects rolled-over/impossible calendar dates instead of accepting Date.parse normalisation", () => {
  for (const date of [
    "2027-02-29",
    "2027-02-30",
    "2027-02-31",
    "2028-04-31",
    "2027-13-01",
    "2027-00-01",
    "2027-1-1",
    "invalid",
  ])
    expect(isValidEventDate(date, "2026-10-26")).toBe(false);
  for (const date of ["2026-10-26", "2027-02-28", "2028-02-29"])
    expect(isValidEventDate(date, "2026-10-26")).toBe(true);
  expect(isValidEventDate("2026-10-25", "2026-10-26")).toBe(false);
});
it("uses the Indian calendar day across the UTC midnight boundary", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-26T18:29:59Z"));
  expect(todayInIndia()).toBe("2026-10-26");
  vi.setSystemTime(new Date("2026-10-26T18:30:00Z"));
  expect(todayInIndia()).toBe("2026-10-27");
  expect(isValidEventDate("2026-10-26")).toBe(false);
});
it("validates callback inputs and honeypots before any private database operation", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-26T12:00:00Z"));
  const input = {
    name: " Test Visitor ",
    phone: "+91 98765 43210",
    occasion: "Birthday",
    event_date: "2027-02-28",
    venue: " Indore ",
    vision: "A pale backdrop",
    website: "",
  };
  expect(inquirySchema.parse(input)).toMatchObject({
    name: "Test Visitor",
    phone: "9876543210",
    venue: "Indore",
  });
  for (const change of [
    { event_date: "2027-02-31" },
    { event_date: "2026-10-25" },
    { phone: "----------" },
    { occasion: "Unknown party" },
    { website: "spam" },
    { name: "a" },
    { vision: "x".repeat(2001) },
  ])
    expect(inquirySchema.safeParse({ ...input, ...change }).success).toBe(false);
});

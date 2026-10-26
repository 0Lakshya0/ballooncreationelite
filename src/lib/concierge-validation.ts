import { z } from "zod";
import { isKnownOccasion } from "./occasion-choices";

export const todayInIndia = () => new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10);
export function isValidEventDate(value: string, today = todayInIndia()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + "T00:00:00Z");
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value && value >= today
  );
}

export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s()-]{10,20}$/)
    .transform((value) => value.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, ""))
    .refine((value) => /^\d{10}$/.test(value), "Please enter a valid Indian phone number."),
  occasion: z.string().refine((value) => isKnownOccasion(value)),
  event_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((value) => isValidEventDate(value), "Please choose a current or future date."),
  venue: z.string().trim().min(2).max(200),
  vision: z.string().trim().max(2000),
  website: z.string().max(0),
});

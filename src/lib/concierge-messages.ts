/** Controlled public message; never surface arbitrary database/server error details. */
export const STATIC_INQUIRY_MESSAGE =
  "This shared view cannot save consultation requests. Please send your enquiry on WhatsApp or call our concierge.";

/** Keep a failed consultation available as a user-reviewed WhatsApp draft, never an automatic send. */
export function consultationDraft(data: Record<string, FormDataEntryValue>): string {
  const field = (name: string) => (typeof data[name] === "string" ? data[name].trim() : "");
  return [
    "Hello Balloon Creation! I would like a consultation.",
    field("name") ? `Name: ${field("name")}` : "",
    field("phone") ? `Callback phone: ${field("phone")}` : "",
    field("occasion") ? `Occasion: ${field("occasion")}` : "",
    field("event_date") ? `Event date: ${field("event_date")}` : "",
    field("venue") ? `Venue / area: ${field("venue")}` : "",
    field("vision") ? `My ideas: ${field("vision")}` : "",
    "Please confirm availability, inclusions and a quote. This is not a confirmed booking.",
  ]
    .filter(Boolean)
    .join("\n");
}

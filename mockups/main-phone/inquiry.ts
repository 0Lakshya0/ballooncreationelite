/** Public static views must never pretend that an enquiry reached the private database. */
export async function submitInquiry(_input: unknown): Promise<never> {
  throw new Error(
    "Please send your enquiry on WhatsApp or call our concierge. This shared view cannot save consultation requests.",
  );
}

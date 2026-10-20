import { STATIC_INQUIRY_MESSAGE } from "@/lib/concierge-messages";
/** Public static views must never pretend that an enquiry reached the private database. */
export async function submitInquiry(_input: unknown): Promise<never> {
  throw new Error(STATIC_INQUIRY_MESSAGE);
}

import { createServerFn } from "@tanstack/react-start";
import { inquirySchema } from "./concierge-validation";

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inquirySchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.rpc("submit_concierge", {
      p_name: data.name,
      p_phone: data.phone,
      p_occasion: data.occasion,
      p_event_date: data.event_date,
      p_venue: data.venue,
      p_vision: data.vision,
    });
    if (error) {
      console.error("Concierge submission failed:", error.code);
      throw new Error(
        error.code === "P0001"
          ? "You have already shared several requests. Please call us for further details."
          : "Your inquiry could not be saved. Please try again or call us.",
      );
    }
    return { success: true };
  });

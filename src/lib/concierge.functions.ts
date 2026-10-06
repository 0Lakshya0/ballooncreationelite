import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { celebrations } from './celebrations';

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[+\d\s()-]{10,20}$/).transform(value => value.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')).refine(value => /^\d{10}$/.test(value), 'Please enter a valid Indian phone number.'),
  occasion: z.string().refine(value => celebrations.some(item => item.name === value)),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => !Number.isNaN(Date.parse(value)) && value >= new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10), 'Please choose a current or future date.'),
  venue: z.string().trim().min(2).max(200),
  vision: z.string().trim().max(2000),
  website: z.string().max(0),
});

export const submitInquiry = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => inquirySchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { error } = await supabaseAdmin.rpc('submit_concierge', {
      p_name: data.name, p_phone: data.phone, p_occasion: data.occasion,
      p_event_date: data.event_date, p_venue: data.venue, p_vision: data.vision,
    });
    if (error) {
      console.error('Concierge submission failed:', error.code);
      throw new Error(error.code === 'P0001' ? 'You have already shared several requests. Please call us for further details.' : 'Your inquiry could not be saved. Please try again or call us.');
    }
    return { success: true };
  });

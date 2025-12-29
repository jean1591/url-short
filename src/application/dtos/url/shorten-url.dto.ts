import { z } from 'zod';

export const shortenUrlSchema = z.object({
  longUrl: z.string().url('Must be a valid URL'),
});

export type ShortenUrlDto = z.infer<typeof shortenUrlSchema>;

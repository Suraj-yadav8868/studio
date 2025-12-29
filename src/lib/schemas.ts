import { z } from 'zod';

export const movieSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  genre: z.string().min(1, 'Genre is required.'),
  releaseYear: z.coerce.number().int().min(1888, "Movies didn't exist back then!").max(new Date().getFullYear() + 5, 'Year is too far in the future.'),
  posterId: z.string().min(1, 'Please select a poster.'),
  userId: z.string().optional(),
});

export type MovieFormData = z.infer<typeof movieSchema>;

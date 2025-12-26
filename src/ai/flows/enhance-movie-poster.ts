'use server';

/**
 * @fileOverview AI flow to enhance movie posters based on a movie description.
 *
 * - enhanceMoviePoster - Function to enhance movie posters using AI.
 * - EnhanceMoviePosterInput - Input type for the enhanceMoviePoster function.
 * - EnhanceMoviePosterOutput - Output type for the enhanceMoviePoster function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceMoviePosterInputSchema = z.object({
  movieDescription: z
    .string()
    .describe('The description of the movie to generate an image for.'),
  existingPosterDataUri: z
    .string()
    .describe(
      "The existing movie poster image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type EnhanceMoviePosterInput = z.infer<typeof EnhanceMoviePosterInputSchema>;

const EnhanceMoviePosterOutputSchema = z.object({
  enhancedPosterDataUri: z
    .string()
    .describe('The enhanced movie poster image as a data URI.'),
});

export type EnhanceMoviePosterOutput = z.infer<typeof EnhanceMoviePosterOutputSchema>;

export async function enhanceMoviePoster(
  input: EnhanceMoviePosterInput
): Promise<EnhanceMoviePosterOutput> {
  return enhanceMoviePosterFlow(input);
}

const enhanceMoviePosterPrompt = ai.definePrompt({
  name: 'enhanceMoviePosterPrompt',
  input: {schema: EnhanceMoviePosterInputSchema},
  output: {schema: EnhanceMoviePosterOutputSchema},
  prompt: [
    {
      media: {url: '{{existingPosterDataUri}}'},
    },
    {
      text: `Given the existing movie poster, and this movie description: {{{movieDescription}}}, suggest changes to the poster image to enhance it.  Output the enhanced movie poster as a data URI.`,
    },
  ],
  model: 'googleai/gemini-2.5-flash-image-preview',
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
  },
});

const enhanceMoviePosterFlow = ai.defineFlow(
  {
    name: 'enhanceMoviePosterFlow',
    inputSchema: EnhanceMoviePosterInputSchema,
    outputSchema: EnhanceMoviePosterOutputSchema,
  },
  async input => {
    const {media} = await ai.generate(enhanceMoviePosterPrompt.config!, enhanceMoviePosterPrompt.prompt!)
      .then(async enhancedImageResult => {
        if (!enhancedImageResult.media) {
          throw new Error('No media returned from image enhancement.');
        }

        return enhancedImageResult;
      })
      .catch(err => {
        console.error('Error enhancing movie poster:', err);
        throw err;
      });

    return {enhancedPosterDataUri: media.url!};
  }
);

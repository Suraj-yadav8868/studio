'use server';

import { movies } from '@/lib/data';
import { movieSchema, type MovieFormData } from '@/lib/schemas';
import type { Movie } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { enhanceMoviePoster } from '@/ai/flows/enhance-movie-poster';

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// CREATE
export async function addMovie(formData: MovieFormData) {
  const validatedFields = movieSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
    };
  }

  const newMovie: Movie = {
    id: crypto.randomUUID(),
    ...validatedFields.data,
  };

  await delay(1000);
  movies.unshift(newMovie);

  revalidatePath('/');
  redirect(`/movies/${newMovie.id}`);
}

// READ
export async function getMovies(query: string): Promise<Movie[]> {
  await delay(500);
  if (!query) {
    return movies;
  }
  return movies.filter(movie =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );
}

export async function getMovieById(id: string): Promise<Movie | undefined> {
  await delay(500);
  return movies.find(movie => movie.id === id);
}

// UPDATE
export async function updateMovie(id: string, formData: MovieFormData) {
  const movieIndex = movies.findIndex(movie => movie.id === id);
  if (movieIndex === -1) {
    throw new Error('Movie not found');
  }

  const validatedFields = movieSchema.safeParse(formData);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
    };
  }
  
  await delay(1000);
  movies[movieIndex] = {
    ...movies[movieIndex],
    ...validatedFields.data,
  };

  revalidatePath('/');
  revalidatePath(`/movies/${id}`);
  redirect(`/movies/${id}`);
}

// DELETE
export async function deleteMovie(id: string) {
  const movieIndex = movies.findIndex(movie => movie.id === id);
  if (movieIndex === -1) {
    throw new Error('Movie not found');
  }

  await delay(1000);
  movies.splice(movieIndex, 1);

  revalidatePath('/');
  redirect('/');
}

// AI ENHANCEMENT
async function imageUrlToDataUri(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const contentType = response.headers.get('content-type');
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:${contentType};base64,${base64}`;
}

export async function getEnhancedPoster(description: string, imageUrl: string) {
  try {
    const dataUri = await imageUrlToDataUri(imageUrl);
    const result = await enhanceMoviePoster({
      movieDescription: description,
      existingPosterDataUri: dataUri,
    });
    return { success: true, data: result.enhancedPosterDataUri };
  } catch (error) {
    console.error('Error enhancing poster:', error);
    return { success: false, error: 'Failed to enhance poster.' };
  }
}

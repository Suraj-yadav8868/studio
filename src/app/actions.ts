'use server';

import { movieSchema, type MovieFormData } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { enhanceMoviePoster } from '@/ai/flows/enhance-movie-poster';
import { collection, addDoc, doc, updateDoc, deleteDoc, getDoc, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

// Since server actions run on the server, we can initialize a server-side instance of firestore
// Note: This is a temporary solution for this specific file.
// In a more robust app, you might have a separate admin SDK setup.
const { firestore } = initializeFirebase();
const moviesCollection = collection(firestore, 'movies');

// CREATE
export async function addMovie(formData: MovieFormData) {
  const validatedFields = movieSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
    };
  }

  try {
    const docRef = await addDoc(moviesCollection, {
      ...validatedFields.data,
      createdAt: new Date().toISOString(),
    });
    revalidatePath('/');
    redirect(`/movies/${docRef.id}`);
  } catch (error) {
    console.error("Error adding document: ", error);
    // In a real app, handle this more gracefully
    return { message: 'Failed to add movie.' };
  }
}

// READ (Single)
export async function getMovieById(id: string) {
  const docRef = doc(firestore, 'movies', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return undefined;
  }
}


// UPDATE
export async function updateMovie(id: string, formData: MovieFormData) {
  const validatedFields = movieSchema.safeParse(formData);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
    };
  }
  
  const docRef = doc(firestore, 'movies', id);

  try {
    await updateDoc(docRef, validatedFields.data);
    revalidatePath('/');
    revalidatePath(`/movies/${id}`);
    redirect(`/movies/${id}`);
  } catch (error) {
    console.error("Error updating document: ", error);
    return { message: 'Failed to update movie.' };
  }
}

// DELETE
export async function deleteMovie(id: string) {
  const docRef = doc(firestore, 'movies', id);
  try {
    await deleteDoc(docRef);
    revalidatePath('/');
    redirect('/');
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw new Error('Failed to delete movie.');
  }
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

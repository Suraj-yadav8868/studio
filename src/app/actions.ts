'use server';

import { movieSchema, type MovieFormData } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { enhanceMoviePoster } from '@/ai/flows/enhance-movie-poster';
import { collection, addDoc, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { initializeFirebaseForServer } from '@/firebase/server-init';

// Since server actions run on the server, we can initialize a server-side instance of firestore
// In a more robust app, you might have a separate admin SDK setup.
const { firestore } = initializeFirebaseForServer();
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

  const { userId, ...movieData } = validatedFields.data;

  if (!userId) {
    return { message: 'You must be logged in to add a movie.' };
  }

  try {
    const docRef = await addDoc(moviesCollection, {
      ...movieData,
      userId: userId, // Explicitly add the userId
      createdAt: new Date().toISOString(),
    });
    revalidatePath('/');
    redirect(`/movies/${docRef.id}`);
  } catch (error) {
    console.error("Error adding document: ", error);
    // This message will be shown to the user if firestore rules fail.
    return { message: 'Failed to add movie. Please ensure you are logged in and have permissions.' };
  }
}

// READ (Single)
export async function getMovieById(id: string) {
  const docRef = doc(firestore, 'movies', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    // This allows the Edit page to handle not found cases gracefully.
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
  // We exclude userId from the update data. The security rules will check ownership
  // based on the existing document's userId, and we don't want to allow changing the owner.
  const { userId, ...updateData } = validatedFields.data;

  try {
    await updateDoc(docRef, updateData);
    revalidatePath('/');
    revalidatePath(`/movies/${id}`);
    redirect(`/movies/${id}`);
  } catch (error) {
    console.error("Error updating document: ", error);
    // This message will be shown if security rules deny the update.
    return { message: 'Failed to update movie. You must be the owner to perform this action.' };
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
    // Throwing an error here will be caught by the calling component's try/catch block.
    throw new Error('Failed to delete movie. You must be the owner to perform this action.');
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

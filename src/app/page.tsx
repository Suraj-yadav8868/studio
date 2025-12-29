'use client';
import MovieList from '@/components/MovieList';
import { useSearchParams } from 'next/navigation';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { Movie } from '@/lib/types';
import Loading from './loading';

export default function Home() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const { firestore } = useFirebase();

  const moviesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const baseQuery = collection(firestore, 'movies');
    if (searchQuery) {
        // Simple search on the title. For more complex search, you'd need a search service like Algolia.
        // Firestore doesn't support partial string matching with case-insensitivity out of the box.
        // This is a basic example. A real app might need a different approach.
        return query(baseQuery, orderBy('title'), where('title', '>=', searchQuery), where('title', '<=', searchQuery + '\uf8ff'));
    }
    return query(baseQuery, orderBy('createdAt', 'desc'));
  }, [firestore, searchQuery]);


  const { data: movies, isLoading } = useCollection<Movie>(moviesQuery);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
       {movies && <MovieList movies={movies} />}
       {!movies && !isLoading && (
         <div className="text-center py-20">
            <h2 className="font-headline text-3xl mb-2">No Movies Found</h2>
            <p className="text-muted-foreground">Try a different search term or add a new movie.</p>
         </div>
       )}
    </div>
  );
}

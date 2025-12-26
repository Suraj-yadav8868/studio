import type { Movie } from '@/lib/types';
import MovieCard from './MovieCard';

type MovieListProps = {
  movies: Movie[];
};

export default function MovieList({ movies }: MovieListProps) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="font-headline text-3xl mb-2">No Movies Found</h2>
        <p className="text-muted-foreground">Try a different search term or add a new movie.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

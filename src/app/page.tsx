import MovieList from '@/components/MovieList';
import { getMovies } from '@/app/actions';

type HomePageProps = {
  searchParams?: {
    search?: string;
  };
};

export default async function Home({ searchParams }: HomePageProps) {
  const searchQuery = searchParams?.search || '';
  const movies = await getMovies(searchQuery);

  return (
    <div className="container mx-auto px-4 py-8">
      <MovieList movies={movies} />
    </div>
  );
}

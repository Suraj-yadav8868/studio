'use client';
import { getMovieById } from '@/app/actions';
import MovieForm from '@/components/MovieForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Movie } from '@/lib/types';
import Loading from '@/app/loading';

export default function EditMoviePage() {
  const params = useParams();
  const id = params.id as string;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchMovie = async () => {
      setLoading(true);
      const movieData = await getMovieById(id);
      if (movieData) {
        setMovie(movieData as Movie);
      } else {
        notFound();
      }
      setLoading(false);
    };
    fetchMovie();
  }, [id]);
  

  if (loading || !movie) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Edit Movie</CardTitle>
          <CardDescription>Update the details for &quot;{movie.title}&quot;.</CardDescription>
        </CardHeader>
        <CardContent>
          <MovieForm movie={movie} />
        </CardContent>
      </Card>
    </div>
  );
}

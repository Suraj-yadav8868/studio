import { getMovieById } from '@/app/actions';
import MovieForm from '@/components/MovieForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';

type EditMoviePageProps = {
  params: {
    id: string;
  };
};

export default async function EditMoviePage({ params }: EditMoviePageProps) {
  const movie = await getMovieById(params.id);

  if (!movie) {
    notFound();
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

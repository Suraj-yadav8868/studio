import MovieForm from '@/components/MovieForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function NewMoviePage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Add a New Movie</CardTitle>
          <CardDescription>Fill out the form below to add a new movie to the CineMagic collection.</CardDescription>
        </CardHeader>
        <CardContent>
          <MovieForm />
        </CardContent>
      </Card>
    </div>
  );
}

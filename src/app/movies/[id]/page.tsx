import { getMovieById } from '@/app/actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clapperboard, Edit, Tag } from 'lucide-react';
import DeleteMovieDialog from '@/components/DeleteMovieDialog';
import EnhancePosterDialog from '@/components/EnhancePosterDialog';
import type { Movie } from '@/lib/types';

type MovieDetailsPageProps = {
  params: {
    id: string;
  };
};

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const movie = await getMovieById(params.id) as Movie;

  if (!movie) {
    notFound();
  }

  const placeholder = PlaceHolderImages.find(p => p.id === movie.posterId);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-1">
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl shadow-primary/20">
            {placeholder ? (
              <Image
                src={placeholder.imageUrl}
                alt={`Poster for ${movie.title}`}
                data-ai-hint={placeholder.imageHint}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary">
                <span className="text-sm text-muted-foreground">No Poster</span>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-4">{movie.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{movie.releaseYear}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <Badge variant="secondary">{movie.genre}</Badge>
            </div>
          </div>

          <p className="text-lg leading-relaxed text-foreground/80 mb-8">{movie.description}</p>
          
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href={`/movies/${movie.id}/edit`}>
                <Edit className="mr-2"/>
                Edit
              </Link>
            </Button>
            
            <EnhancePosterDialog movie={movie} />

            <DeleteMovieDialog movieId={movie.id} movieTitle={movie.title} />
          </div>
        </div>
      </div>
    </div>
  );
}

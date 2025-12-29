'use client';
import { useDoc, useFirebase, useMemoFirebase, useUser } from '@/firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Edit, Tag } from 'lucide-react';
import DeleteMovieDialog from '@/components/DeleteMovieDialog';
import EnhancePosterDialog from '@/components/EnhancePosterDialog';
import type { Movie } from '@/lib/types';
import { doc } from 'firebase/firestore';
import Loading from '@/app/loading';

export default function MovieDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { firestore } = useFirebase();
  const { user } = useUser();

  const movieRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'movies', id);
  }, [firestore, id]);

  const { data: movie, isLoading } = useDoc<Movie>(movieRef);

  if (isLoading) {
    return <Loading />;
  }

  if (!movie) {
    notFound();
  }

  const isOwner = user && movie.userId === user.uid;
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
          
          {isOwner && (
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
          )}
        </div>
      </div>
    </div>
  );
}

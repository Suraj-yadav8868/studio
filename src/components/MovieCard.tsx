import type { Movie } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  const placeholder = PlaceHolderImages.find(p => p.id === movie.posterId);

  return (
    <Link href={`/movies/${movie.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="aspect-[2/3] relative overflow-hidden">
            {placeholder ? (
              <Image
                src={placeholder.imageUrl}
                alt={`Poster for ${movie.title}`}
                data-ai-hint={placeholder.imageHint}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary">
                <span className="text-sm text-muted-foreground">No Poster</span>
              </div>
            )}
          </div>
        </CardContent>
        <div className="p-4">
          <h3 className="font-headline text-lg font-semibold truncate" title={movie.title}>{movie.title}</h3>
          <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
             <Badge variant="outline">{movie.genre}</Badge>
            <span>{movie.releaseYear}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

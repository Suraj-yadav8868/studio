'use client';

import type { Movie } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState, useTransition } from 'react';
import { getEnhancedPoster } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Loader2, WandSparkles } from 'lucide-react';

type EnhancePosterDialogProps = {
  movie: Movie;
};

export default function EnhancePosterDialog({ movie }: EnhancePosterDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const originalPoster = PlaceHolderImages.find(p => p.id === movie.posterId);

  const handleEnhance = () => {
    if (!originalPoster) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Original poster not found.',
      });
      return;
    }

    startTransition(async () => {
      setEnhancedImage(null);
      const result = await getEnhancedPoster(movie.description, originalPoster.imageUrl);
      if (result.success && result.data) {
        setEnhancedImage(result.data);
        toast({
          title: 'Poster Enhanced!',
          description: 'The AI has generated a new version of your poster.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'AI Enhancement Failed',
          description: result.error || 'An unknown error occurred.',
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent">
          <WandSparkles className="mr-2"/>
          Enhance with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">AI Poster Enhancement</DialogTitle>
          <DialogDescription>
            Use AI to generate an enhanced version of the poster for &quot;{movie.title}&quot;.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-muted-foreground">Original</h3>
            <div className="aspect-[2/3] relative rounded-md overflow-hidden bg-secondary">
              {originalPoster && (
                <Image
                  src={originalPoster.imageUrl}
                  alt="Original Poster"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-semibold text-muted-foreground">Enhanced</h3>
            <div className="aspect-[2/3] relative rounded-md overflow-hidden bg-secondary flex items-center justify-center">
              {isPending && <Loader2 className="h-10 w-10 animate-spin text-primary" />}
              {enhancedImage && !isPending && (
                <Image
                  src={enhancedImage}
                  alt="Enhanced Poster"
                  fill
                  className="object-cover"
                />
              )}
              {!enhancedImage && !isPending && (
                <div className="text-center text-muted-foreground p-4">
                  <WandSparkles className="mx-auto h-10 w-10 mb-2" />
                  <p>Click &quot;Enhance&quot; to generate an AI version.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button onClick={handleEnhance} disabled={isPending} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <WandSparkles className="mr-2" />
            )}
            {isPending ? 'Enhancing...' : 'Enhance Poster'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

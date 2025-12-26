'use client';

import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { deleteMovie } from '@/app/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { Loader2, Trash2 } from 'lucide-react';

type DeleteMovieDialogProps = {
  movieId: string;
  movieTitle: string;
};

export default function DeleteMovieDialog({ movieId, movieTitle }: DeleteMovieDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteMovie(movieId);
        toast({
          title: 'Movie Deleted',
          description: `"${movieTitle}" has been successfully deleted.`,
        });
        // Redirect is handled by server action
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete the movie.',
        });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
            <Trash2 className="mr-2"/>
            Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this movie?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the movie &quot;{movieTitle}&quot;
            from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

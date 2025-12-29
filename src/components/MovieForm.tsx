'use client';

import type { Movie } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { movieSchema, type MovieFormData } from '@/lib/schemas';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { addMovie, updateMovie } from '@/app/actions';
import { useTransition, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Loader2, Save, WandSparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

type MovieFormProps = {
  movie?: Movie;
};

export default function MovieForm({ movie }: MovieFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();

  const form = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: movie || {
      title: '',
      description: '',
      genre: '',
      releaseYear: undefined, // Initialize as undefined to prevent hydration mismatch
      posterId: '',
    },
  });

  useEffect(() => {
    // This effect runs only on the client, after hydration
    if (!movie) {
      // If it's a new movie form, set the default release year to the current year
      form.setValue('releaseYear', new Date().getFullYear());
    }
  }, [form, movie]);


  const onSubmit = (data: MovieFormData) => {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be logged in to perform this action.',
        });
        return;
    }
    
    startTransition(async () => {
      const action = movie ? updateMovie.bind(null, movie.id) : addMovie;
      const result = await action({ ...data, userId: user.uid });

      if (result?.message) {
        toast({
          variant: 'destructive',
          title: 'Error saving movie',
          description: result.message,
        });
      } else {
        toast({
          title: movie ? 'Movie Updated!' : 'Movie Added!',
          description: `"${data.title}" has been saved successfully.`,
        });
        // Redirect is handled by the server action
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="The Great Adventure" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A thrilling story of..." rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <FormControl>
                  <Input placeholder="Sci-Fi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="releaseYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Release Year</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2024" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="posterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poster Image</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a poster" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PlaceHolderImages.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.imageHint} ({p.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isPending || !user} className="bg-primary hover:bg-primary/90">
            {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                movie ? <Save className="mr-2" /> : <WandSparkles className="mr-2" />
            )}
            {movie ? 'Save Changes' : 'Add Movie'}
            </Button>
        </div>
      </form>
    </Form>
  );
}

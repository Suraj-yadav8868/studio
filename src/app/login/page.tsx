'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth, useUser } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { Clapperboard, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If user is already logged in, redirect to home.
        if (user) {
            router.replace('/');
        }
    }, [user, router]);
    
    // As soon as the page loads and we know the user is not logged in,
    // automatically trigger anonymous sign-in.
    useEffect(() => {
        if (!isUserLoading && !user) {
            initiateAnonymousSignIn(auth);
        }
    }, [isUserLoading, user, auth]);

    if (isUserLoading || user) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
            <div className="inline-block mx-auto">
                <Clapperboard className="h-10 w-10 text-primary" />
            </div>
          <CardTitle className="text-2xl font-headline">Welcome to CineMagic</CardTitle>
          <CardDescription>
            You are being signed in anonymously to manage your movie collection.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}

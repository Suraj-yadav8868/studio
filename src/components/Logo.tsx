import Link from 'next/link';
import { Clapperboard } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Clapperboard className="h-8 w-8 text-primary" />
      <span className="font-headline text-2xl font-bold text-primary">
        CineMagic
      </span>
    </Link>
  );
}

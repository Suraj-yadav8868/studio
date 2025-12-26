import Link from 'next/link';
import Logo from './Logo';
import SearchBar from './SearchBar';
import { Button } from './ui/button';
import { Film } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchBar />
          </div>
          <nav className="flex items-center space-x-1">
            <Button asChild>
              <Link href="/movies/new">
                <Film className="mr-2" />
                Add Movie
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

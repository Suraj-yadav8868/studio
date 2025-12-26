'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from './ui/input';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get('search') as string;
    const params = new URLSearchParams(searchParams);

    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        name="search"
        placeholder="Search movies..."
        className="w-full pl-10"
        defaultValue={searchParams.get('search') ?? ''}
      />
    </form>
  );
}

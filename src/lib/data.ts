import type { Movie } from '@/lib/types';

// This is an in-memory store, acting as a mock database.
// Data will be reset on every server restart.
// In a real application, you would replace this with a database client (e.g., Prisma, Drizzle, Mongoose).
export const movies: Movie[] = [
  {
    id: 'd2727a44-f8e9-4676-9533-d729a249113e',
    title: 'Cosmic Odyssey',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    genre: 'Sci-Fi',
    releaseYear: 2023,
    posterId: 'poster-1',
  },
  {
    id: '01d36b8e-8c66-4e58-86a3-559d8738323a',
    title: 'Neon Shadows',
    description: 'In a rain-drenched, neon-lit future, a hard-boiled detective uncovers a conspiracy that goes to the very top.',
    genre: 'Cyberpunk Noir',
    releaseYear: 2028,
    posterId: 'poster-2',
  },
  {
    id: 'f9d3a4b8-2c76-4f48-a4e9-105175a0a38b',
    title: 'The Dragon\'s Spire',
    description: 'A young knight is tasked with saving a kingdom by retrieving a magical artifact from a dragon-guarded tower.',
    genre: 'Fantasy',
    releaseYear: 2021,
    posterId: 'poster-3',
  },
  {
    id: 'a8b7c6d5-e4f3-a2b1-c9d8-e7f6a5b4c3d2',
    title: 'Last Summer',
    description: 'Two old friends reunite for one last summer, rediscovering their connection and confronting the choices that drove them apart.',
    genre: 'Romance',
    releaseYear: 2022,
    posterId: 'poster-4',
  },
  {
    id: 'b1c2d3e4-f5a6-b7c8-d9e0-f1a2b3c4d5e6',
    title: 'The Cartographer\'s Secret',
    description: 'A historian discovers a hidden message in an ancient map, leading her on a globe-trotting adventure to find a legendary lost city.',
    genre: 'Adventure',
    releaseYear: 2024,
    posterId: 'poster-5',
  },
  {
    id: 'c3d4e5f6-a7b8-c9d0-e1f2-a3b4c5d6e7f8',
    title: 'Whispering Woods',
    description: 'A group of friends on a camping trip ignore local legends and find themselves stalked by an ancient entity in the woods.',
    genre: 'Horror',
    releaseYear: 2020,
    posterId: 'poster-6',
  },
];

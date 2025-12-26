export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  posterId: string; // Corresponds to an ID in placeholder-images.json
}

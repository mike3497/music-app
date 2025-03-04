import type { SongDTO } from '@/models/songDTO';

export interface AlbumDTO {
  artist: string;
  artwork_url: string;
  created_at: string;
  id: string;
  release_date: string;
  songs: SongDTO[];
  title: string;
}

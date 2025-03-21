import type { SongWithUserRatingDTO } from '@/models/songWithUserRatingDTO';

export interface AlbumWithUserRatingsDTO {
  artist: string;
  artwork_url: string;
  created_at: string;
  id: string;
  release_date: string;
  songs: SongWithUserRatingDTO[];
  title: string;
}

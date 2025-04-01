import type { SongWithUserRatingDTO } from '@/models/songWithUserRatingDTO';

export interface AlbumWithUserRatingsDTO {
  artist: string;
  artwork_url: string;
  created_at: string;
  id: string;
  release_date: string;
  signed_in_user_overall_rating: number | null;
  songs: SongWithUserRatingDTO[];
  title: string;
}

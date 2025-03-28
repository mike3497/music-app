export interface SongWithUserRatingDTO {
  album_id: string;
  created_at: string;
  id: string;
  title: string;
  track_number: number;
  signed_in_user_rating: number;
  user_ratings: {
    rating: number;
    user_id: string;
    user: {
      avatar_url: string;
      first_name: string;
      last_name: string;
    };
  }[];
}

<template>
  <div class="container mx-auto p-4 h-svh">
    <BaseCard>
      <div v-if="isLoading">Loading...</div>
      <div v-else class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="album">Album</label>
          <select
            class="select"
            id="album"
            :value="selectedAlbumId"
            @change="onSelectedAlbumChanged"
          >
            <option v-for="album in albums" :key="album.id" :value="album.id">
              {{ getFormattedAlbum(album) }}
            </option>
          </select>
        </div>

        <template v-if="selectedAlbum">
          <img
            :src="selectedAlbum.artwork_url"
            alt="Album Artwork"
            class="w-full object-cover rounded-lg mb-4"
          />
          <div>
            <h3 class="text-xl font-semibold">{{ selectedAlbum.title }}</h3>
            <p>{{ selectedAlbum.artist }}</p>
            <ul class="list">
              <li v-for="song in selectedAlbum.songs" :key="song.id" class="list-row items-center">
                <span>#{{ song.track_number }}</span>
                <span>{{ song.title }}</span>
                <div class="flex gap-2">
                  <BaseButton @click="onRateSong(song.id)" class="">
                    <Star />
                  </BaseButton>
                  <!-- <BaseButton @click="onCommentSong(song.id)" class="">
                  <MessageCircle />
                </BaseButton> -->
                </div>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </BaseCard>
  </div>
  <RatingModal
    :isOpen="isRatingModalOpen"
    :songId="ratingModalSongId"
    :songTitle="ratingModalSongTitle"
    @close="onRatingModalClose"
  />
</template>

<script setup lang="ts">
import RatingModal from '@/components/RatingModal.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import { supabase } from '@/lib/supabaseClient';
import { type AlbumDTO } from '@/models/albumDTO';
import { Star } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';

const albums = ref<AlbumDTO[]>([]);
const isLoading = ref<boolean>(false);
const isRatingModalOpen = ref<boolean>(false);
const ratingModalSongId = ref<string>('');
const ratingModalSongTitle = ref<string>('');
const selectedAlbumId = ref<string | null>(null);
const selectedAlbum = ref<AlbumDTO | null>(null);

const fetchAlbums = async () => {
  try {
    isLoading.value = true;
    const { data, error } = await supabase.from('albums').select('*').order('title');

    if (error) {
      console.error('Error fetching albums:', error);
      return;
    }

    if (data) {
      albums.value = data;
    }
  } catch (error: unknown) {
    console.error('Network error:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchAlbum = async () => {
  try {
    isLoading.value = true;
    const { data, error } = await supabase
      .from('albums')
      .select('*, songs(*)')
      .eq('id', selectedAlbumId.value)
      .order('track_number', { referencedTable: 'songs' })
      .maybeSingle();

    if (error) {
      console.error('Error fetching album:', error);
      return;
    }

    if (data) {
      selectedAlbum.value = {
        artist: data.artist,
        artwork_url: data.artwork_url,
        created_at: data.created_at,
        id: data.id,
        release_date: data.release_date,
        songs: data.songs,
        title: data.title,
      };
    }
  } catch (error: unknown) {
    console.error('Network error:', error);
  } finally {
    isLoading.value = false;
  }
};

const onRatingModalClose = () => {
  isRatingModalOpen.value = false;
};

const onRateSong = async (songId: string) => {
  const songTtile = selectedAlbum.value?.songs.find((song) => song.id === songId)?.title;
  if (songTtile) {
    ratingModalSongId.value = songId;
    ratingModalSongTitle.value = songTtile;
    isRatingModalOpen.value = true;
  }
};

// const onCommentSong = async (songId: string) => {
//   console.log('Comment song:', songId);
// };

const onSelectedAlbumChanged = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectedAlbumId.value = target.value;
  fetchAlbum();
};

const getFormattedAlbum = (album: AlbumDTO) => {
  return `${album.title} by ${album.artist}`;
};

onMounted(async () => {
  await fetchAlbums();
  // await fetchAlbum();
});
</script>

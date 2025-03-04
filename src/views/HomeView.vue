<template>
  <div class="container mx-auto p-4 h-svh">
    <h1>Home View</h1>
    <!-- <BaseCard title="Album of the Week">
      <div v-if="currentAlbum" class="flex flex-col">
        <img
          :src="currentAlbum.artwork_url"
          alt="Album Artwork"
          class="w-full object-cover rounded-lg mb-4"
        />
        <div>
          <h3 class="text-xl font-semibold">{{ currentAlbum.title }}</h3>
          <p>{{ currentAlbum.artist }}</p>
          <ul class="list">
            <li v-for="song in currentAlbum.songs" :key="song.id" class="list-row">
              <span>#{{ song.track_number }}</span>
              <span>{{ song.title }}</span>
              <div class="flex gap-2">
                <BaseButton @click="rateSong(song.id)" class="">
                  <Star />
                </BaseButton>
                <BaseButton @click="commentSong(song.id)" class="">
                  <MessageCircle />
                </BaseButton>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
        <p>No album selected for this week.</p>
      </div>
    </BaseCard> -->

    <!-- <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-4">Next Selector</h2>
      <p v-if="nextSelector">Next week's selector: {{ nextSelector }}</p>
      <p v-else>Selection order is not set.</p>
    </div> -->

    <!-- <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-semibold mb-4">Recent Activity</h2>
      <p>Recent activity will be shown here.</p>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import BaseCard from '@/components/shared/BaseCard.vue';
import type { AlbumDTO } from '@/models/albumDTO';
import { Star, MessageCircle } from 'lucide-vue-next';
import BaseButton from '@/components/shared/BaseButton.vue';

const currentAlbum = ref<AlbumDTO>();

onMounted(async () => {
  // await fetchCurrentAlbum();
  // await fetchNextSelector();
});

const fetchCurrentAlbum = async () => {
  const { data, error } = await supabase
    .from('weekly_albums')
    .select(
      `
      *,
      albums (
        *,
        songs (*)
      ),
      users (
        username
      )
    `,
    )
    .eq('week_start', '2025-03-02')
    .single();

  if (error) {
    console.error('Error fetching weekly album:', error);
    return;
  }

  if (data) {
    currentAlbum.value = {
      artist: data.albums.artist,
      artwork_url: data.albums.artwork_url,
      created_at: data.albums.created_at,
      id: data.id,
      release_date: data.albums.release_date,
      songs: data.albums.songs,
      title: data.albums.title,
    };
  }
};

const fetchNextSelector = () => {
  // Implement logic to fetch the next selector based on the selection order
  // This is a placeholder; you'll need to adapt it to your specific logic.
  // Example (replace with your actual logic):
  // nextSelector.value = 'User B'; // Replace with your logic to get the next selector
};

const rateSong = (songId: string) => {
  console.log('Rate:', songId);
};

const commentSong = (songId: string) => {
  console.log('Comment', songId);
};
</script>

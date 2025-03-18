<template>
  <li class="list-row items-center">
    <span>#{{ song.track_number }}</span>
    <span>{{ song.title }}</span>
    <div class="flex gap-2">
      <div class="rating">
        <input
          v-for="n in 5"
          v-model="ratingModel"
          class="mask mask-star"
          type="radio"
          :name="name"
          :ariaLabel="`${n} star`"
          :key="n"
          :value="n"
          @change="onRateSong(n)"
        />
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient';
import type { SongWithUserRatingDTO } from '@/models/songWithUserRatingDTO';
import { useUserStore } from '@/stores/userStore';
import { computed, ref } from 'vue';

const userStore = useUserStore();

const props = defineProps<{
  song: SongWithUserRatingDTO;
}>();

const isProcessing = ref<boolean>(false);
const ratingModel = ref<number>(props.song.user_rating);

const name = computed(() => {
  return props.song.title;
});

const onRateSong = async (rating: number) => {
  try {
    isProcessing.value = true;
    const { data, error } = await supabase.rpc('upsert_song_rating', {
      p_rating: rating,
      p_song_id: props.song.id,
      p_user_id: userStore.session?.user.id,
    });

    if (error) {
      console.error('error upserting rating', error);
      return;
    }

    if (data) {
      close();
    }
  } catch (error: unknown) {
    console.error('Error rating song:', error);
  } finally {
    isProcessing.value = true;
  }
};
</script>

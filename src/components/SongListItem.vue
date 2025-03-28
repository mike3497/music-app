<template>
  <li class="border-b border-base-300 p-4">
    <div class="flex flex-row gap-4 items-center justify-between">
      <div class="flex flex-row gap-4 items-center">
        <div class="text-4xl font-thin opacity-30 tabular-nums">
          {{ padNumber(song.track_number, 2) }}
        </div>
        <div class="flex flex-col gap-1">
          <div class="text-xs">{{ song.title }}</div>
          <div class="flex gap-2 items-center">
            <div class="rating">
              <input
                v-for="n in 5"
                v-model="ratingModel"
                class="mask mask-star bg-primary"
                type="radio"
                :name="name"
                :ariaLabel="`${n} star`"
                :key="n"
                :value="n"
                @change="onRateSong(n)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex-shrink-0">
        <button v-if="isDropdownOpen" class="btn btn-ghost" @click="closeDropdown">
          <ChevronUp />
        </button>
        <button v-else class="btn btn-ghost" @click="openDropdown"><ChevronDown /></button>
      </div>
    </div>
    <div v-if="isDropdownOpen" class="flex flex-col gap-4 p-4">
      <p v-if="song.user_ratings === null">No other ratings yet...</p>
      <div
        v-else
        v-for="user_rating in song.user_ratings"
        :key="user_rating.user_id"
        class="card bg-base-100 shadow-sm"
      >
        <div class="card-body">
          <div class="flex flex-row gap-2 items-center">
            <div class="avatar">
              <div class="w-8 rounded-full">
                <img
                  :src="
                    user_rating.user.avatar_url ??
                    `https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png`
                  "
                  :alt="`${user_rating.user.first_name} ${user_rating.user.last_name} Avatar`"
                />
              </div>
            </div>
            <h1 class="">{{ user_rating.user.first_name }} {{ user_rating.user.last_name }}</h1>
          </div>
          <StarRating :maxRating="5" :rating="user_rating.rating" />
        </div>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast';
import { padNumber } from '@/helpers/stringHelper';
import { supabase } from '@/lib/supabaseClient';
import type { SongWithUserRatingDTO } from '@/models/songWithUserRatingDTO';
import { ToastVariant } from '@/models/toast';
import { useUserStore } from '@/stores/userStore';
import { ChevronDown, ChevronUp } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import StarRating from './shared/StarRating.vue';

const userStore = useUserStore();

const toast = useToast();

const props = defineProps<{
  song: SongWithUserRatingDTO;
}>();

const isDropdownOpen = ref<boolean>(false);
const isProcessing = ref<boolean>(false);
const ratingModel = ref<number>(props.song.signed_in_user_rating);

const name = computed(() => {
  return props.song.title;
});

const openDropdown = () => {
  isDropdownOpen.value = true;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

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
      toast.open('Failed to save rating. Please try again.', ToastVariant.ERROR);
      return;
    }

    if (data) {
      toast.open(`Rating was saved successfully!`, ToastVariant.SUCCESS);
    }
  } catch (error: unknown) {
    console.error('Error rating song:', error);
    toast.open('An unexpected error occurred.', ToastVariant.ERROR);
  } finally {
    isProcessing.value = false;
  }
};
</script>

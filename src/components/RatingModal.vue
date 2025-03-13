<template>
  <BaseModal
    submitText="Rate"
    :title="songTitle"
    :isOpen="isOpen"
    :isSubmitDisabled="isProcessingSubmit"
    @close="close"
    @submit="onSubmitClick"
  >
    <LoadingDots v-if="isLoadingRating" />
    <div v-else class="rating">
      <input
        v-for="n in 5"
        v-model="rating"
        class="mask mask-star"
        name="rating"
        type="radio"
        :ariaLabel="`${n} star`"
        :key="n"
        :value="n"
      />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/shared/BaseModal.vue';
import LoadingDots from '@/components/shared/LoadingDots.vue';
import { supabase } from '@/lib/supabaseClient';
import { useUserStore } from '@/stores/userStore';
import { ref, watch } from 'vue';

const props = defineProps<{ isOpen: boolean; songId: string; songTitle: string }>();

const userStore = useUserStore();

const isLoadingRating = ref<boolean>(false);
const isProcessingSubmit = ref<boolean>(false);
const rating = ref<number>(0);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', rating: number): void;
}>();

const close = () => {
  emit('close');
};

const onSubmitClick = async () => {
  try {
    isProcessingSubmit.value = true;
    const { data, error } = await supabase.rpc('upsert_song_rating', {
      p_rating: rating.value,
      p_song_id: props.songId,
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
    isProcessingSubmit.value = false;
  }
};

const fetchRating = async () => {
  try {
    isLoadingRating.value = true;
    const { data, error } = await supabase
      .from('song_ratings')
      .select('*')
      .eq('song_id', props.songId)
      .eq('user_id', userStore.session?.user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching rating:', error);
      return;
    }

    if (data) {
      rating.value = data.rating;
    }
  } catch (error: unknown) {
    console.error('Error fetching rating:', error);
  } finally {
    isLoadingRating.value = false;
  }
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      rating.value = 0;
      fetchRating();
    }
  },
);
</script>

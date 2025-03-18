import type { Toast } from '@/models/toast';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastsStore = defineStore('toastsStore', () => {
  const toasts = ref<Toast[]>([]);

  return {
    toasts,
  };
});

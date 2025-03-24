<template>
  <div class="toast">
    <div class="alert" :class="toastClass">
      <component :is="toastIcon" />
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ToastVariant, type Toast } from '@/models/toast';
import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-vue-next';
import { computed, type Component, type PropType } from 'vue';

const props = defineProps({
  toast: {
    type: Object as PropType<Toast>,
    required: true,
  },
});

const toastClass = computed<string | null>(() => {
  switch (props.toast.variant) {
    case ToastVariant.ERROR:
      return 'alert-error';
    case ToastVariant.INFO:
      return 'alert-info';
    case ToastVariant.SUCCESS:
      return 'alert-success';
    case ToastVariant.WARNING:
      return 'alert-warning';
    default:
      return null;
  }
});

const toastIcon = computed<Component | null>(() => {
  switch (props.toast.variant) {
    case ToastVariant.ERROR:
      return CircleX;
    case ToastVariant.INFO:
      return Info;
    case ToastVariant.SUCCESS:
      return CircleCheck;
    case ToastVariant.WARNING:
      return TriangleAlert;
    default:
      return null;
  }
});
</script>

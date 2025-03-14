<template>
  <div class="modal" :class="{ 'modal-open': isOpen }" aria-modal="true" role="dialog">
    <div ref="target" class="modal-box" aria-labelledby="modal-title">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="close">
        <X />
      </button>
      <h3 id="modal-title" class="font-bold text-lg">{{ title }}</h3>
      <slot></slot>
      <div class="modal-action">
        <BaseButton @click="close">Close</BaseButton>
        <BaseButton :disabled="isSubmitDisabled || false" @click="onSubmitClick">{{
          submitText
        }}</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/shared/BaseButton.vue';
import { onClickOutside } from '@vueuse/core';
import { X } from 'lucide-vue-next';
import { useTemplateRef } from 'vue';

withDefaults(
  defineProps<{
    isOpen: boolean;
    isSubmitDisabled?: boolean;
    submitText?: string;
    title: string;
  }>(),
  { isSubmitDisabled: false, submitText: 'Submit' },
);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit'): void;
}>();

const target = useTemplateRef<HTMLElement>('target');

const close = () => {
  emit('close');
};

const onSubmitClick = () => {
  emit('submit');
};

onClickOutside(target, close);
</script>

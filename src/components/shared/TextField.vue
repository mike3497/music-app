<template>
  <div class="flex flex-col gap-2" :class="{ 'has-error': !!errorMessage }">
    <label class="font-bold" :for="name">
      {{ label }}
      <span v-if="isRequired" class="text-red-600">*</span>
    </label>
    <input
      class="input input-bordered w-full"
      :type="type"
      :id="name"
      :name="name"
      :value="inputValue"
      @input="handleChange"
      @blur="handleBlur"
    />
    <p class="text-red-600" v-show="errorMessage">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { toRef } from 'vue';

const props = defineProps<{
  label: string;
  isRequired?: boolean;
  name: string;
  type: string;
  value?: string;
}>();

const name = toRef(props, 'name');

const { value: inputValue, errorMessage, handleBlur, handleChange } = useField(name);
</script>

<template>
  <div class="container mx-auto p-4 h-svh">
    <BaseCard title="Sign In">
      <BaseAlert v-if="errorMessage" :alertColor="AlertColor.ERROR" :message="errorMessage" />
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-2">
          <label for="email">Email</label>
          <BaseInput v-model="email" id="email" type="email" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="password">Password</label>
          <BaseInput v-model="password" id="password" type="password" />
        </div>
        <BaseButton type="submit">Sign In</BaseButton>
        <div class="mt-4 text-center">
          <RouterLink :to="{ name: 'sign-up' }" class="link link-primary">
            Don't have an account? Sign up
          </RouterLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import BaseAlert from '@/components/shared/BaseAlert.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import { useUserStore } from '@/stores/userStore';
import { AlertColor } from '@/types/alertColor';
import { ref } from 'vue';

const userStore = useUserStore();

const email = ref<string>('');
const password = ref<string>('');
const errorMessage = ref<string | null>(null);

const onSubmit = async () => {
  errorMessage.value = await userStore.signIn(email.value, password.value);
};
</script>

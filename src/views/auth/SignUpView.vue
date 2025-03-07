<template>
  <div class="container mx-auto p-4 h-svh">
    <BaseCard title="Sign Up">
      <BaseAlert v-if="errorMessage" :alertColor="AlertColor.ERROR" :message="errorMessage" />
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-2">
          <label for="email">Email</label>
          <BaseInput v-model="signUpFormModel.email" id="email" type="email" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="firstName">First Name</label>
          <BaseInput v-model="signUpFormModel.firstName" id="firstName" type="firstName" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="lastName">Last Name</label>
          <BaseInput v-model="signUpFormModel.lastName" id="lastName" type="text" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="password">Password</label>
          <BaseInput v-model="signUpFormModel.password" id="password" type="password" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="confirmPassword">Confirm Password</label>
          <BaseInput
            v-model="signUpFormModel.confirmPassword"
            id="confirmPassword"
            type="password"
          />
        </div>
        <BaseButton type="submit">Sign Up</BaseButton>
        <div class="mt-4 text-center">
          <RouterLink :to="{ name: 'sign-in' }" class="link link-primary">
            Already have an account? Sign in
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
import { defaultSignUpForm, type SignUpForm } from '@/models/signUpForm';
import { useUserStore } from '@/stores/userStore';
import { AlertColor } from '@/types/alertColor';
import { ref } from 'vue';

const userStore = useUserStore();

const errorMessage = ref<string | null>(null);
const signUpFormModel = ref<SignUpForm>(defaultSignUpForm);

const onSubmit = async () => {
  errorMessage.value = await userStore.signUp(signUpFormModel.value);
};
</script>

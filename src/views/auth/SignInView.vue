<template>
  <div class="container mx-auto p-4 h-svh">
    <BaseCard title="Sign In">
      <BaseAlert v-if="errorMessage" :alertColor="AlertColor.ERROR" :message="errorMessage" />
      <form class="flex flex-col gap-4" @submit="onSubmit">
        <TextField label="Email" name="email" type="email" />
        <TextField label="Password" name="password" type="password" />
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
import TextField from '@/components/shared/TextField.vue';
import type { SignInForm } from '@/models/signInForm';
import { useUserStore } from '@/stores/userStore';
import { AlertColor } from '@/types/alertColor';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import * as yup from 'yup';

const validationSchema = yup.object({
  email: yup.string().label('Email').required().email(),
  password: yup.string().label('Password').required(),
});

const userStore = useUserStore();

const { handleSubmit } = useForm<SignInForm>({ validationSchema });

const errorMessage = ref<string | null>(null);

const onSubmit = handleSubmit(async (signInForm: SignInForm) => {
  errorMessage.value = await userStore.signIn(signInForm.email, signInForm.password);
});
</script>

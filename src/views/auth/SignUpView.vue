<template>
  <div class="container mx-auto p-4 h-svh">
    <BaseCard title="Sign Up">
      <BaseAlert v-if="errorMessage" :alertColor="AlertColor.ERROR" :message="errorMessage" />
      <form class="flex flex-col gap-4" @submit="onSubmit">
        <TextField label="Email" name="email" type="email" :isRequired="true" />
        <TextField label="First Name" name="firstName" type="text" :isRequired="true" />
        <TextField label="Last Name" name="lastName" type="text" :isRequired="true" />
        <TextField label="Password" name="password" type="password" :isRequired="true" />
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          :isRequired="true"
        />
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
import TextField from '@/components/shared/TextField.vue';
import type { SignUpForm } from '@/models/signUpForm';
import { useUserStore } from '@/stores/userStore';
import { AlertColor } from '@/types/alertColor';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import * as yup from 'yup';

const validationSchema = yup.object({
  confirmPassword: yup
    .string()
    .label('Confirm Password')
    .required()
    .oneOf([yup.ref('password')], 'Passwords must match'),
  email: yup.string().label('Email').required().email(),
  firstName: yup.string().label('First Name').required(),
  lastName: yup.string().label('Last Name').required(),
  password: yup.string().label('Password').required().min(6),
});

const userStore = useUserStore();

const { handleSubmit } = useForm<SignUpForm>({ validationSchema });

const errorMessage = ref<string | null>(null);

const onSubmit = handleSubmit(async (signUpForm: SignUpForm) => {
  errorMessage.value = await userStore.signUp(signUpForm);
});
</script>

<template>
  <div class="container mx-auto p-4 h-svh">
    <BaseCard title="Profile">
      <div class="flex flex-col items-center mb-4">
        <div v-if="userStore.profile?.avatar_url" class="mb-4">
          <img
            :src="userStore.profile?.avatar_url"
            alt="Profile Picture"
            class="w-32 h-32 rounded-full object-cover"
          />
        </div>
        <div v-else class="mb-4">
          <div class="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
            <span class="text-gray-500">No Profile Pic</span>
          </div>
        </div>

        <div class="flex flex-col items-center">
          <button
            @click="triggerFileUpload"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
          >
            Upload New Picture
          </button>
          <input
            type="file"
            @change="handleFileChange"
            accept="image/*"
            class="hidden"
            ref="fileInput"
          />
        </div>
      </div>
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-2">
          <label for="firstName">First Name</label>
          <BaseInput v-model="profileForm.firstName" id="firstName" type="text" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="lastName">Last Name</label>
          <BaseInput v-model="profileForm.lastName" id="lastName" type="text" />
        </div>
        <BaseButton type="submit">Save</BaseButton>
      </form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import { supabase } from '@/lib/supabaseClient';
import { type ProfileForm } from '@/models/profileForm';
import { useUserStore } from '@/stores/userStore';
import { ref, onMounted } from 'vue';

const userStore = useUserStore();

const profileForm = ref<ProfileForm>({
  firstName: userStore.profile?.first_name || '',
  lastName: userStore.profile?.last_name || '',
});
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const onSubmit = async () => {
  const { error } = await supabase
    .from('users')
    .update({
      first_name: profileForm.value.firstName,
      last_name: profileForm.value.lastName,
    })
    .eq('auth_id', userStore.session?.user.id)
    .select('*')
    .single();

  if (error) {
    console.error('Error saving user profile:', error);
    return;
  } else {
    await userStore.fetchProfile();
  }
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
    uploadProfilePic();
  }
};

const uploadProfilePic = async () => {
  if (!selectedFile.value || !userStore.session?.user?.id) return;

  const fileExt = selectedFile.value.name.split('.').pop();
  const fileName = `${userStore.session.user.id}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from('profile-pics')
    .upload(filePath, selectedFile.value, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Error uploading profile picture:', uploadError);
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('profile-pics').getPublicUrl(filePath);

  // Update user's profile in the database
  const { error: updateError } = await supabase
    .from('users')
    .update({ avatar_url: publicUrl })
    .eq('auth_id', userStore.session.user.id);

  if (updateError) {
    console.error('Error updating user profile:', updateError);
  } else {
    await userStore.fetchProfile();
  }
};

const triggerFileUpload = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

onMounted(() => {
  if (!userStore.profile) {
    userStore.fetchProfile();
  }
});
</script>

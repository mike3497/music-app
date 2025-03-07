<template>
  <div>
    <input type="file" @change="handleFileChange" accept="image/*" />
    <button @click="uploadProfilePic" :disabled="!selectedFile">Upload</button>
    <img v-if="profilePicUrl" :src="profilePicUrl" alt="Profile Picture" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useUserStore } from '@/stores/userStore';

const selectedFile = ref<File | null>(null);
const profilePicUrl = ref<string | null>(null);
const userStore = useUserStore();

onMounted(async () => {
  await userStore.fetchProfile();
  if (userStore.profile?.avatar_url) {
    profilePicUrl.value = userStore.profile.avatar_url;
  }
});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
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

  profilePicUrl.value = publicUrl;

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
</script>

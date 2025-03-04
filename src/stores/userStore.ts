// stores/user.js
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import type { UserProfileDTO } from '@/models/userProfileDTO';
import { useRouter } from 'vue-router';

export const useUserStore = defineStore('user', () => {
  const router = useRouter();

  const session = ref<Session | null>(null);
  const profile = ref<UserProfileDTO | null>(null);

  const fetchSession = async () => {
    const {
      data: { session: sessionData },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      console.error('Error fetching session:', error);
      return;
    }
    session.value = sessionData;
    if (sessionData) {
      await fetchProfile();
    }
  };

  const fetchProfile = async () => {
    if (session.value && session.value.user) {
      const { data: profileData, error } = await supabase
        .from('users')
        .select('avatar_url, first_name, last_name')
        .eq('auth_id', session.value.user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      profile.value = profileData;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Error signing in:', error);
      return false;
    }

    await fetchSession();
    router.push({ name: 'home' });
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('error signing out', error);
      return;
    }
    session.value = null;
    profile.value = null;
    router.push({ name: 'sign-in' });
  };

  const fullName = computed<string>(() => {
    if (profile.value) {
      return `${profile.value.first_name} ${profile.value.last_name}`;
    }
    return '';
  });

  const isLoggedIn = computed<boolean>(() => {
    return !!session.value;
  });

  return {
    fetchProfile,
    fetchSession,
    fullName,
    isLoggedIn,
    profile,
    signIn,
    session,
    signOut,
  };
});

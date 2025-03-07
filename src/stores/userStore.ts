import { type SignUpForm } from '@/models/signUpForm';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import type { UserProfileDTO } from '@/models/userProfileDTO';
import { useRouter } from 'vue-router';
import { Role } from '@/types/role';

export const useUserStore = defineStore('user', () => {
  const router = useRouter();

  const session = ref<Session | null>(null);
  const profile = ref<UserProfileDTO | null>(null);

  const isAdmin = computed<boolean>(() => {
    return profile.value?.role === Role.ADMIN || false;
  });

  const fetchSession = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error fetching session:', error);
      return;
    }

    session.value = data.session;
    if (session.value && !profile.value) {
      await fetchProfile();
    }
  };

  const fetchProfile = async () => {
    if (session.value && session.value.user) {
      const { data: profileData, error } = await supabase
        .from('users')
        .select('avatar_url, first_name, last_name, role')
        .eq('auth_id', session.value.user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      profile.value = profileData;
    }
  };

  const signUp = async (signUpForm: SignUpForm): Promise<string | null> => {
    const { data, error } = await supabase.auth.signUp({
      email: signUpForm.email,
      password: signUpForm.password,
      options: {
        data: {
          first_name: signUpForm.firstName,
          last_name: signUpForm.lastName,
        },
      },
    });

    if (error) {
      return error.message;
    }

    session.value = data.session;
    if (session.value && !profile.value) {
      await fetchProfile();
    }

    router.push({ name: 'home' });
    return null;
  };

  const signIn = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      return error.message;
    }

    await fetchSession();
    router.push({ name: 'home' });
    return null;
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
    isAdmin,
    isLoggedIn,
    profile,
    session,
    signIn,
    signOut,
    signUp,
  };
});

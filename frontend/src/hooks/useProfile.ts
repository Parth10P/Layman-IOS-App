import { useEffect } from 'react';
import { useAuth } from './useAuth';

export function useProfile() {
  const { profile, profileLoading, fetchProfile, updateProfile, user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  return {
    profile,
    profileLoading,
    updateProfile,
    refreshProfile: fetchProfile,
  };
}

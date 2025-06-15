import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { usePrivyAuth } from '@/context/PrivyContext';

type ProfileType = {
  id?: string;
  user_id?: string;
  username?: string;
  wallet_address?: string;
  chain?: string;
  fren_balance?: number;
  avatar_url?: string;
  bio?: string;
  email?: string;
  is_new_user?: boolean;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  theme?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  location?: string;
};

type UserContextType = {
  profile: ProfileType | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<ProfileType>) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, authenticated } = usePrivyAuth(); 

  // Function to ensure avatar storage bucket exists
  const ensureAvatarBucketExists = async () => {
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error checking storage buckets:', error);
        return false;
      }
      
      const avatarBucketExists = buckets.some(bucket => bucket.name === 'avatars');
      if (!avatarBucketExists) {
        const { error: createError } = await supabase.storage
          .createBucket('avatars', { public: true });
        
        if (createError) {
          console.error('Error creating avatars bucket:', createError);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in ensureAvatarBucketExists:', error);
      return false;
    }
  };

  // Function to fetch profile from Supabase
  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const data = await fetchProfile(user.id);
    setProfile(data);
    
    // Ensure avatar bucket exists when loading profile
    await ensureAvatarBucketExists();
  };

  // Update profile data
  const updateProfile = async (updates: Partial<ProfileType>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      
      await refreshProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Make sure we're correctly listening for auth changes
  useEffect(() => {
    if (authenticated && user) {
      refreshProfile();
      console.log("Auth detected, refreshing profile");
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [authenticated, user]);

  // Enhanced custom profile update event listener
  useEffect(() => {
    const handleProfileUpdated = () => {
      console.log("Profile update event detected");
      if (user) {
        refreshProfile();
      }
    };
    
    // Listen for both general profile updates and specifically name updates
    window.addEventListener('PROFILE_UPDATED', handleProfileUpdated);
    window.addEventListener('PROFILE_NAME_UPDATED', handleProfileUpdated);
    
    return () => {
      window.removeEventListener('PROFILE_UPDATED', handleProfileUpdated);
      window.removeEventListener('PROFILE_NAME_UPDATED', handleProfileUpdated);
    };
  }, [user]);

  return (
    <UserContext.Provider value={{ profile, loading, refreshProfile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

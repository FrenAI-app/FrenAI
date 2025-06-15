
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, User, Camera } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { usePrivyAuth } from '@/context/PrivyContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useIsMobile } from '@/hooks/use-mobile';

interface AvatarUploadProps {
  size?: 'sm' | 'md' | 'lg';
  onAvatarUploaded?: (url: string) => void;
  className?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  size = 'md', 
  onAvatarUploaded,
  className 
}) => {
  const { profile, updateProfile } = useUser();
  const { user } = usePrivyAuth();
  const [uploading, setUploading] = useState(false);
  const isMobile = useIsMobile();
  
  const sizeMap = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-16 w-16 text-lg',
    lg: 'h-24 w-24 text-2xl'
  };
  
  // Function to get user display image
  const getDisplayImage = () => {
    // First, try to use profile avatar if available
    if (profile?.avatar_url) {
      return profile.avatar_url;
    }
    
    // If no profile avatar, try to get from Privy linked accounts
    if (user?.linkedAccounts) {
      for (const account of user.linkedAccounts) {
        if (account.type === 'google_oauth' && account.detail?.picture) {
          return account.detail.picture;
        }
      }
    }
    
    return null;
  };
  
  // Function to get user initials for fallback
  const getInitials = () => {
    if (profile?.username && profile.username.length > 0) {
      return profile.username[0].toUpperCase();
    }
    
    if (user?.email) {
      return String(user.email)[0].toUpperCase();
    }
    
    // Try to get initials from Google account
    if (user?.linkedAccounts) {
      for (const account of user.linkedAccounts) {
        if (account.type === 'google_oauth' && account.detail?.name) {
          return account.detail.name[0].toUpperCase();
        }
      }
    }
    
    return null;
  };
  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    if (!user || !profile) {
      toast({
        title: "Authentication required",
        description: isMobile ? "Please sign in first" : "Please sign in to upload an avatar",
        variant: "destructive"
      });
      return;
    }
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const userId = profile.user_id || user.id;
    const filePath = `${userId}/${Date.now()}.${fileExt}`;
    
    // Enhanced file size validation for mobile (smaller limit for better performance)
    const maxSize = isMobile ? 3 * 1024 * 1024 : 5 * 1024 * 1024; // 3MB on mobile, 5MB on desktop
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: isMobile 
          ? `Image must be less than ${Math.round(maxSize / 1024 / 1024)}MB` 
          : "Avatar image must be less than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // File type validation
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: isMobile 
          ? "Please use JPEG, PNG, GIF or WEBP" 
          : "Please upload a JPEG, PNG, GIF or WEBP image",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    // Add haptic feedback on mobile
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }
    
    try {
      // Ensure avatars bucket exists before upload
      await ensureAvatarBucketExists();
      
      // Upload file to Supabase storage with retry logic for mobile
      let uploadAttempts = 0;
      const maxAttempts = isMobile ? 3 : 1;
      
      while (uploadAttempts < maxAttempts) {
        try {
          const { error: uploadError } = await supabase
            .storage
            .from('avatars')
            .upload(filePath, file);
          
          if (uploadError) {
            throw uploadError;
          }
          break; // Success, exit retry loop
        } catch (error) {
          uploadAttempts++;
          if (uploadAttempts >= maxAttempts) {
            throw error;
          }
          // Wait before retry (mobile network optimization)
          await new Promise(resolve => setTimeout(resolve, 1000 * uploadAttempts));
        }
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update profile with new avatar URL
      if (profile) {
        await updateProfile({
          avatar_url: publicUrl
        });
      }
      
      if (onAvatarUploaded) {
        onAvatarUploaded(publicUrl);
      }
      
      toast({
        title: "Avatar updated",
        description: isMobile 
          ? "Profile picture updated!" 
          : "Your profile picture has been updated successfully",
      });
      
      // Success haptic feedback on mobile
      if (isMobile && 'vibrate' in navigator) {
        navigator.vibrate([50, 100, 50]);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: isMobile 
          ? "Upload failed. Check connection and try again." 
          : "There was an error uploading your avatar. Please try again.",
        variant: "destructive"
      });
      
      // Error haptic feedback on mobile
      if (isMobile && 'vibrate' in navigator) {
        navigator.vibrate(200);
      }
    } finally {
      setUploading(false);
    }
  };
  
  // Helper function to ensure avatar storage bucket exists
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
  
  const displayImage = getDisplayImage();
  const initials = getInitials();
  
  return (
    <div className={`relative group ${className}`}>
      <Avatar className={`${sizeMap[size]} border-2 border-amber-200 group-hover:border-amber-300 transition-all duration-300 ${uploading ? 'opacity-75' : ''} ${className}`}>
        <AvatarImage src={displayImage || ''} alt="Profile Picture" />
        <AvatarFallback className="bg-amber-100 text-amber-800">
          {initials || <User />}
        </AvatarFallback>
        
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className="h-1/3 w-1/3 text-white animate-spin" />
          </div>
        )}
      </Avatar>
      
      <label 
        htmlFor="avatar-upload" 
        className={`absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 ${uploading ? 'pointer-events-none' : ''} touch-manipulation`}
      >
        {isMobile ? (
          <Camera className="h-1/3 w-1/3 text-white" />
        ) : (
          <Upload className="h-1/3 w-1/3 text-white" />
        )}
        <Input 
          id="avatar-upload" 
          type="file" 
          accept="image/*"
          capture={isMobile ? "environment" : undefined}
          className="hidden"
          onChange={handleAvatarUpload}
          disabled={uploading}
        />
      </label>
      
      {isMobile && (
        <div className="absolute -bottom-1 -right-1">
          <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
            <Camera className="h-3 w-3 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;

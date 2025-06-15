
import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Camera, User, ImageIcon } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { usePrivyAuth } from '@/context/PrivyContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

interface MobileAvatarUploadProps {
  size?: 'sm' | 'md' | 'lg';
  onAvatarUploaded?: (url: string) => void;
  className?: string;
}

const MobileAvatarUpload: React.FC<MobileAvatarUploadProps> = ({ 
  size = 'md', 
  onAvatarUploaded,
  className 
}) => {
  const { profile, updateProfile } = useUser();
  const { user } = usePrivyAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const sizeMap = {
    sm: 'h-12 w-12 text-sm',
    md: 'h-20 w-20 text-lg',
    lg: 'h-32 w-32 text-2xl'
  };
  
  // Function to get user display image
  const getDisplayImage = () => {
    if (profile?.avatar_url) {
      return profile.avatar_url;
    }
    
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
    
    if (user?.linkedAccounts) {
      for (const account of user.linkedAccounts) {
        if (account.type === 'google_oauth' && account.detail?.name) {
          return account.detail.name[0].toUpperCase();
        }
      }
    }
    
    return null;
  };

  const handleCameraCapture = () => {
    // Trigger file input with camera preference
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  };
  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    if (!user || !profile) {
      toast({
        title: "Sign in required",
        description: "Please sign in to upload an avatar",
        variant: "destructive"
      });
      return;
    }
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const userId = profile.user_id || user.id;
    const filePath = `${userId}/${Date.now()}.${fileExt}`;
    
    // Mobile-optimized file size validation (3MB limit)
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Image must be less than 3MB",
        variant: "destructive"
      });
      return;
    }
    
    // Enhanced file type validation
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      toast({
        title: "Invalid file type",
        description: "Please use JPEG, PNG, GIF, WEBP or HEIC",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    // Success haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([25, 50, 25]);
    }
    
    try {
      // Ensure avatars bucket exists
      await ensureAvatarBucketExists();
      
      // Upload with mobile-optimized retry logic
      let uploadAttempts = 0;
      const maxAttempts = 3;
      
      while (uploadAttempts < maxAttempts) {
        try {
          const { error: uploadError } = await supabase
            .storage
            .from('avatars')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });
          
          if (uploadError) {
            throw uploadError;
          }
          break;
        } catch (error) {
          uploadAttempts++;
          if (uploadAttempts >= maxAttempts) {
            throw error;
          }
          // Progressive delay for mobile networks
          await new Promise(resolve => setTimeout(resolve, 1000 * uploadAttempts));
        }
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update profile
      if (profile) {
        await updateProfile({
          avatar_url: publicUrl
        });
      }
      
      if (onAvatarUploaded) {
        onAvatarUploaded(publicUrl);
      }
      
      toast({
        title: "Success!",
        description: "Profile picture updated",
      });
      
      // Success haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 100, 50]);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "Check your connection and try again",
        variant: "destructive"
      });
      
      // Error haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
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
    <div className={`relative ${className}`}>
      {/* Avatar Display */}
      <div className="relative group">
        <Avatar className={`${sizeMap[size]} border-2 border-purple-200 shadow-lg transition-all duration-300 ${uploading ? 'opacity-75' : 'hover:scale-105'}`}>
          <AvatarImage src={displayImage || ''} alt="Profile Picture" className="object-cover" />
          <AvatarFallback className="bg-purple-100 text-purple-800 font-semibold">
            {initials || <User className="h-1/2 w-1/2" />}
          </AvatarFallback>
          
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full backdrop-blur-sm">
              <Loader2 className="h-1/3 w-1/3 text-white animate-spin" />
            </div>
          )}
        </Avatar>
        
        {/* Camera Button Overlay */}
        <button
          onClick={handleCameraCapture}
          disabled={uploading}
          className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 border-2 border-white mobile-button android-ripple"
          aria-label="Upload photo"
        >
          <Camera className="h-4 w-4 text-white" />
        </button>
      </div>
      
      {/* Hidden File Input */}
      <Input 
        ref={fileInputRef}
        type="file" 
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleAvatarUpload}
        disabled={uploading}
      />
      
      {/* Upload Button (Alternative) */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleCameraCapture}
        disabled={uploading}
        className="mt-3 w-full mobile-button android-ripple ios-input-fix"
      >
        <ImageIcon className="h-4 w-4 mr-2" />
        {uploading ? 'Uploading...' : 'Change Photo'}
      </Button>
    </div>
  );
};

export default MobileAvatarUpload;

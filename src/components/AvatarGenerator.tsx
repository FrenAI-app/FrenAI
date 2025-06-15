
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/context/UserContext';
import { usePrivyAuth } from '@/context/PrivyContext';
import { useIsMobile } from '@/hooks/use-mobile';

import AvatarStyleSelector, { AvatarStyle } from './avatar/AvatarStyleSelector';
import PromptInput from './avatar/PromptInput';
import GenerateButton from './avatar/GenerateButton';
import AvatarPreview from './avatar/AvatarPreview';
import AvatarActions from './avatar/AvatarActions';
import SignInRequired from './avatar/SignInRequired';

const AvatarGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>('pixel');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState('');
  const { profile, updateProfile } = useUser();
  const { authenticated, login, ready } = usePrivyAuth();
  const isMobile = useIsMobile();

  // Add debugging
  console.log('AvatarGenerator: Profile:', profile);
  console.log('AvatarGenerator: Authenticated:', authenticated);
  console.log('AvatarGenerator: Ready:', ready);

  // Validate prompt with enhanced mobile-friendly feedback
  const isValidPrompt = prompt.trim().length >= 10 && prompt.trim().split(/\s+/).length >= 3;

  const generateAvatar = async () => {
    if (!isValidPrompt) {
      toast({
        title: "More details needed",
        description: isMobile 
          ? "Add more details (10+ chars, 3+ words)" 
          : "Please provide a more detailed description (at least 10 characters and 3 words).",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGenerating(true);
      setLastPrompt(prompt);

      // Add haptic feedback on mobile
      if (isMobile && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }

      console.log('AvatarGenerator: Calling generate-avatar function with:', { prompt: prompt.trim(), style: avatarStyle });

      const { data, error } = await supabase.functions.invoke('generate-avatar', {
        body: { 
          prompt: prompt.trim(),
          style: avatarStyle
        }
      });

      console.log('AvatarGenerator: Function response:', { data, error });

      if (error) {
        console.error('AvatarGenerator: Supabase function error:', error);
        throw new Error(error.message);
      }

      if (data?.image) {
        setGeneratedImage(data.image);
        toast({
          title: "Avatar generated!",
          description: isMobile 
            ? "Tap to download or set as profile pic" 
            : "You can download it or set as your profile picture.",
        });
        
        // Success haptic feedback on mobile
        if (isMobile && 'vibrate' in navigator) {
          navigator.vibrate([50, 100, 50]);
        }
      } else if (data?.error) {
        console.error('AvatarGenerator: Generation error:', data.error);
        throw new Error(data.error);
      } else {
        console.error('AvatarGenerator: Unexpected response format:', data);
        throw new Error('Unexpected response from avatar generation service');
      }
    } catch (error) {
      console.error('AvatarGenerator: Error generating avatar:', error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate avatar",
        variant: "destructive"
      });
      
      // Error haptic feedback on mobile
      if (isMobile && 'vibrate' in navigator) {
        navigator.vibrate(200);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAvatar = () => {
    if (!generatedImage) return;
    
    try {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `fren-avatar-${Date.now()}.png`;
      
      // Handle mobile download with better UX
      if (isMobile) {
        // iOS/Safari specific handling
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          // iOS doesn't support direct download, open in new tab
          window.open(generatedImage, '_blank');
          toast({
            title: "Avatar opened",
            description: "Long press the image to save it to your photos",
          });
          return;
        }
        
        // Android and other mobile browsers
        link.setAttribute('target', '_blank');
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      if (!isMobile || !/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        toast({
          title: "Download started",
          description: "Avatar saved to your downloads",
        });
      }
    } catch (error) {
      console.error('AvatarGenerator: Download error:', error);
      toast({
        title: "Download failed",
        description: "Please try again or right-click to save",
        variant: "destructive"
      });
    }
  };

  const setAsProfileAvatar = async () => {
    if (!generatedImage || !profile) {
      console.log('AvatarGenerator: setAsProfileAvatar - Missing data:', { generatedImage: !!generatedImage, profile: !!profile });
      toast({
        title: "Error",
        description: isMobile 
          ? "Sign in first or generate an avatar" 
          : "No image generated or you need to sign in first",
        variant: "destructive"
      });
      return;
    }

    try {
      // Add loading haptic feedback on mobile
      if (isMobile && 'vibrate' in navigator) {
        navigator.vibrate(25);
      }

      console.log('AvatarGenerator: Starting profile avatar upload...');

      // Convert base64 to blob with error handling
      const response = await fetch(generatedImage);
      if (!response.ok) {
        throw new Error('Failed to fetch image data');
      }
      
      const blob = await response.blob();
      const file = new File([blob], `avatar-${Date.now()}.png`, { type: 'image/png' });
      
      const userId = profile.user_id;
      const filePath = `${userId}/profile-${Date.now()}.png`;
      
      console.log('AvatarGenerator: Uploading to storage with path:', filePath);
      
      // Ensure the avatars bucket exists with better error handling
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
          console.warn('AvatarGenerator: Bucket check failed:', error);
        }
        
        const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
        if (!avatarBucketExists) {
          console.log('AvatarGenerator: Creating avatars bucket...');
          const { error: createError } = await supabase.storage
            .createBucket('avatars', { public: true });
          
          if (createError) {
            console.warn('AvatarGenerator: Bucket creation failed:', createError);
          }
        }
      } catch (error) {
        console.warn('AvatarGenerator: Storage setup warning:', error);
      }
      
      // Upload file with retry logic for mobile networks
      let uploadAttempts = 0;
      const maxAttempts = isMobile ? 3 : 1;
      
      while (uploadAttempts < maxAttempts) {
        try {
          console.log(`AvatarGenerator: Upload attempt ${uploadAttempts + 1}/${maxAttempts}`);
          const { error: uploadError } = await supabase
            .storage
            .from('avatars')
            .upload(filePath, file);
          
          if (uploadError) {
            console.error('AvatarGenerator: Upload error:', uploadError);
            throw uploadError;
          }
          console.log('AvatarGenerator: Upload successful');
          break; // Success, exit retry loop
        } catch (error) {
          uploadAttempts++;
          if (uploadAttempts >= maxAttempts) {
            throw error;
          }
          // Wait before retry (mobile network optimization)
          console.log(`AvatarGenerator: Retrying upload in ${1000 * uploadAttempts}ms...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * uploadAttempts));
        }
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      console.log('AvatarGenerator: Generated public URL:', publicUrl);
      
      // Update profile
      console.log('AvatarGenerator: Updating profile with new avatar URL...');
      await updateProfile({
        avatar_url: publicUrl
      });
      
      toast({
        title: "Avatar updated",
        description: isMobile 
          ? "Profile pic updated successfully!" 
          : "Your profile avatar has been updated successfully!",
      });
      
      // Success haptic feedback on mobile
      if (isMobile && 'vibrate' in navigator) {
        navigator.vibrate([50, 100, 50]);
      }
      
      // Trigger profile update event
      window.dispatchEvent(new Event('PROFILE_UPDATED'));
      
    } catch (error) {
      console.error('AvatarGenerator: Error setting profile avatar:', error);
      toast({
        title: "Error",
        description: isMobile 
          ? "Failed to set avatar. Check connection and try again." 
          : "Failed to set as profile avatar. Please try again.",
        variant: "destructive"
      });
      
      // Error haptic feedback on mobile
      if (isMobile && 'vibrate' in navigator) {
        navigator.vibrate(200);
      }
    }
  };

  // Show loading state if auth state is not ready
  if (!ready) {
    return (
      <div className={`enhanced-glass-card rounded-2xl p-6 ${isMobile ? 'mx-4' : ''}`}>
        <div className={`flex justify-center items-center ${isMobile ? 'h-40' : 'h-60'} animate-pulse`}>
          <div className="text-center">
            <div className={`w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2`}></div>
            <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show sign-in prompt
  if (!authenticated) {
    return (
      <div className={`enhanced-glass-card rounded-2xl p-6 ${isMobile ? 'mx-4' : ''}`}>
        <SignInRequired onLogin={login} />
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
      <div className={`max-w-2xl mx-auto space-y-6 animate-fade-in`}>
        {/* Header */}
        <div className={`text-center space-y-2 ${isMobile ? 'pb-4' : 'pb-6'}`}>
          <div className="relative inline-block">
            <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent animate-pulse`}>
              Generate Your FREN Avatar
            </h1>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce opacity-70" />
          </div>
          <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'} max-w-md mx-auto leading-relaxed`}>
            {isMobile ? 'Create your perfect AI-generated avatar!' : 'Describe your ideal avatar and watch AI bring it to life!'}
          </p>
        </div>
        
        {/* Main Content */}
        <div className="space-y-6">
          {/* Style Selector */}
          <div className="enhanced-glass-card rounded-2xl p-4 border-white/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300">
            <AvatarStyleSelector 
              avatarStyle={avatarStyle} 
              setAvatarStyle={setAvatarStyle} 
            />
          </div>
          
          {/* Prompt Input */}
          <div className="enhanced-glass-card rounded-2xl p-4 border-white/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300">
            <PromptInput 
              prompt={prompt} 
              setPrompt={setPrompt} 
            />
          </div>
        </div>
        
        {/* Generate Button */}
        <div className="sticky bottom-4 z-10">
          <GenerateButton 
            isGenerating={isGenerating}
            hasGenerated={!!generatedImage}
            disabled={!isValidPrompt}
            onClick={generateAvatar}
          />
        </div>
        
        {/* Avatar Preview */}
        {generatedImage && (
          <div className="enhanced-glass-card rounded-2xl p-4 border-white/20 backdrop-blur-md shadow-lg animate-fade-in">
            <AvatarPreview generatedImageUrl={generatedImage} />
          </div>
        )}
        
        {/* Avatar Actions */}
        {generatedImage && (
          <div className="enhanced-glass-card rounded-2xl p-4 border-white/20 backdrop-blur-md shadow-lg animate-fade-in">
            <AvatarActions 
              generatedImageUrl={generatedImage}
              profile={profile}
              onDownload={downloadAvatar}
              onSetAsProfile={setAsProfileAvatar}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarGenerator;

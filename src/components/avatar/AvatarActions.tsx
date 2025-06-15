
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Use a more flexible profile type that matches the actual usage
interface ProfileType {
  user_id?: string;
  username?: string;
  avatar_url?: string;
  [key: string]: any;
}

interface AvatarActionsProps {
  generatedImageUrl: string;
  profile: ProfileType | null;
  onDownload: () => void;
  onSetAsProfile: () => void;
}

const AvatarActions: React.FC<AvatarActionsProps> = ({
  generatedImageUrl,
  profile,
  onDownload,
  onSetAsProfile
}) => {
  const isMobile = useIsMobile();

  if (!generatedImageUrl) {
    return null;
  }

  // iOS detection for special handling
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  return (
    <div className={`space-y-${isMobile ? '3' : '2'} animate-fade-in`}>
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-wrap'} gap-${isMobile ? '3' : '2'} justify-center`}>
        <Button 
          onClick={onDownload} 
          variant="outline"
          className={`${isMobile ? 'w-full py-3 h-12 text-base' : 'flex items-center'} hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation`}
        >
          {isIOS ? (
            <>
              <ExternalLink className={`mr-2 ${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
              {isMobile ? 'Open & Save Image' : 'Open Image'}
            </>
          ) : (
            <>
              <Download className={`mr-2 ${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
              {isMobile ? 'Download Avatar' : 'Download Avatar'}
            </>
          )}
        </Button>
        
        <Button 
          onClick={onSetAsProfile}
          variant="outline"
          className={`${isMobile ? 'w-full py-3 h-12 text-base' : 'flex items-center'} bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200 hover:border-amber-300 transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation font-medium`}
          disabled={!profile}
        >
          <ImageIcon className={`mr-2 ${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
          {isMobile ? 'Set as Profile Picture' : 'Set as Profile Picture'}
        </Button>
      </div>
      
      {isMobile && isIOS && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700 text-center">
            <strong>iOS Tip:</strong> Tap "Open & Save Image" then long press the image to save it to your Photos
          </p>
        </div>
      )}
      
      {!profile && (
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-center text-gray-500 px-4`}>
          {isMobile ? 'Sign in to set as profile picture' : 'Sign in to set this avatar as your profile picture'}
        </p>
      )}
    </div>
  );
};

export default AvatarActions;

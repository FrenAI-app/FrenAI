
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import AvatarUpload from '@/components/AvatarUpload';
import { useIsMobile } from '@/hooks/use-mobile';

interface AvatarPreviewProps {
  generatedImageUrl: string | null;
}

const AvatarPreview: React.FC<AvatarPreviewProps> = ({ generatedImageUrl }) => {
  const isMobile = useIsMobile();

  if (!generatedImageUrl) {
    return null;
  }

  return (
    <div className={`space-y-${isMobile ? '3' : '4'} animate-fade-in`}>
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} gap-4 items-center`}>
        <div className={`w-full ${isMobile ? '' : 'sm:w-1/2'}`}>
          <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium mb-2 text-center font-quicksand text-amber-700`}>
            Generated Avatar
          </h2>
          <AspectRatio ratio={1} className="bg-muted rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <img 
              src={generatedImageUrl} 
              alt="Generated avatar" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                console.error('Failed to load generated avatar image');
                e.currentTarget.style.display = 'none';
              }}
            />
          </AspectRatio>
        </div>
        
        <div className={`w-full ${isMobile ? '' : 'sm:w-1/2'}`}>
          <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium mb-2 text-center font-quicksand text-amber-700`}>
            Your Current Avatar
          </h2>
          <div className={`flex justify-center items-center ${isMobile ? 'p-6' : 'p-4'} bg-muted rounded-lg h-full min-h-[120px] hover:bg-muted/80 transition-colors duration-300`}>
            <AvatarUpload 
              size={isMobile ? "md" : "lg"} 
              className="hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
      
      {isMobile && (
        <p className="text-xs text-center text-gray-500 px-2">
          Tap and hold the generated image to save it on iOS, or use the download button below
        </p>
      )}
    </div>
  );
};

export default AvatarPreview;

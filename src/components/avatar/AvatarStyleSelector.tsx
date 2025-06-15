
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles, Zap, Camera } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export type AvatarStyle = 'pixel' | 'anime' | 'realistic';

interface AvatarStyleSelectorProps {
  avatarStyle: AvatarStyle;
  setAvatarStyle: (style: AvatarStyle) => void;
}

const AvatarStyleSelector: React.FC<AvatarStyleSelectorProps> = ({ 
  avatarStyle, 
  setAvatarStyle 
}) => {
  const isMobile = useIsMobile();

  const styles = [
    {
      value: 'pixel',
      label: 'Pixel Art',
      icon: <Sparkles className="h-4 w-4" />,
      description: 'Retro 8-bit style',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      value: 'anime',
      label: 'Anime',
      icon: <Zap className="h-4 w-4" />,
      description: 'Kawaii manga style',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      value: 'realistic',
      label: 'Realistic',
      icon: <Camera className="h-4 w-4" />,
      description: 'Detailed portrait',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-1 bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent`}>
          Choose Your Style
        </h2>
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
          Pick the perfect art style for your avatar
        </p>
      </div>
      
      <RadioGroup 
        value={avatarStyle} 
        onValueChange={(value) => setAvatarStyle(value as AvatarStyle)}
        className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-3 gap-4'}`}
      >
        {styles.map((style) => (
          <div 
            key={style.value}
            className={`relative group cursor-pointer transition-all duration-300 ${
              isMobile ? 'touch-manipulation' : 'hover:scale-105'
            }`}
            onClick={() => setAvatarStyle(style.value as AvatarStyle)}
          >
            <div className={`
              relative p-4 rounded-xl border-2 transition-all duration-300
              ${avatarStyle === style.value 
                ? `bg-gradient-to-br ${style.gradient} border-transparent shadow-lg` 
                : 'bg-background border-border hover:border-muted-foreground/50'
              }
              ${isMobile ? 'active:scale-95' : ''}
            `}>
              <RadioGroupItem 
                value={style.value} 
                id={style.value} 
                className="absolute top-2 right-2 opacity-0"
              />
              
              <div className={`flex items-center gap-3 ${isMobile ? 'justify-center' : ''}`}>
                <div className={`
                  p-2 rounded-lg transition-all duration-300
                  ${avatarStyle === style.value 
                    ? 'bg-white/20 text-white' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {style.icon}
                </div>
                
                <div className={`${isMobile ? 'text-center' : 'text-left'} flex-1`}>
                  <Label 
                    htmlFor={style.value} 
                    className={`
                      font-medium cursor-pointer transition-colors duration-300
                      ${avatarStyle === style.value ? 'text-white' : 'text-foreground'}
                      ${isMobile ? 'text-base' : 'text-sm'}
                    `}
                  >
                    {style.label}
                  </Label>
                  <p className={`
                    text-xs mt-1 transition-colors duration-300
                    ${avatarStyle === style.value ? 'text-white/80' : 'text-muted-foreground'}
                  `}>
                    {style.description}
                  </p>
                </div>
              </div>
              
              {avatarStyle === style.value && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none animate-pulse" />
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default AvatarStyleSelector;

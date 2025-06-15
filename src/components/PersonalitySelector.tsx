
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Sparkles, Check, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getPersonalities, getUserAIPreferences, updateUserAIPreferences, type AIPersonality } from '@/lib/aiMemoryBank';
import { useUser } from '@/context/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface PersonalitySelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPersonalityChange?: (personality: AIPersonality) => void;
}

const PersonalitySelector: React.FC<PersonalitySelectorProps> = ({ 
  open, 
  onOpenChange,
  onPersonalityChange 
}) => {
  const [personalities, setPersonalities] = useState<AIPersonality[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { profile } = useUser();
  const isMobile = useIsMobile();

  console.log('PersonalitySelector render - open:', open, 'personalities count:', personalities.length);

  useEffect(() => {
    if (open) {
      console.log('PersonalitySelector opened, loading data...');
      loadPersonalities();
      loadUserPreferences();
    }
  }, [open, profile?.user_id]);

  const loadPersonalities = async () => {
    try {
      console.log('Loading personalities...');
      const data = await getPersonalities();
      console.log('Loaded personalities:', data);
      setPersonalities(data);
    } catch (error) {
      console.error('Error loading personalities:', error);
    }
  };

  const loadUserPreferences = async () => {
    if (!profile?.user_id) return;
    
    try {
      const preferences = await getUserAIPreferences(profile.user_id);
      if (preferences?.active_personality_id) {
        setSelectedPersonality(preferences.active_personality_id);
      } else {
        // Set default personality
        const defaultPersonality = personalities.find(p => p.is_default);
        if (defaultPersonality) {
          setSelectedPersonality(defaultPersonality.id);
        }
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const handlePersonalitySelect = async (personalityId: string) => {
    // Disabled for development
    return;
  };

  const getPersonalityIcon = (name: string) => {
    // Use different heart colors/styles for different personalities
    if (name.includes('Scholar')) return '💙';
    if (name.includes('Coach')) return '❤️';
    if (name.includes('Zen')) return '💚';
    return '💛';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh]' : 'sm:max-w-[600px] max-h-[80vh]'} overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600 animate-pulse" fill="currentColor" />
            Choose Your AI Personality
          </DialogTitle>
        </DialogHeader>
        
        <Alert className="mb-4 border-amber-200 bg-amber-50">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Under Development!</strong> AI personality selection is currently being developed. This feature will be available soon!
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4 opacity-60 pointer-events-none">
          {personalities.map((personality) => (
            <Card 
              key={personality.id}
              className="cursor-not-allowed transition-all duration-200 border-gray-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="text-2xl">{getPersonalityIcon(personality.name)}</span>
                    {personality.name}
                    {personality.is_default && (
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                    )}
                  </CardTitle>
                </div>
                <CardDescription className="text-sm">
                  {personality.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(personality.personality_traits || {}).map(([trait, value]) => (
                    <Badge 
                      key={trait} 
                      variant="outline" 
                      className="text-xs capitalize"
                    >
                      {trait}: {typeof value === 'number' ? Math.round(value * 100) + '%' : value}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Sparkles className="h-8 w-8 text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-600 mb-1">Custom Personalities</h3>
              <p className="text-sm text-gray-500 mb-3">
                Create your own AI personality
              </p>
              <Button variant="outline" disabled className="text-xs">
                Create Custom
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalitySelector;

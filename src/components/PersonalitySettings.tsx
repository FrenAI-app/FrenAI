import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, Volume2 } from 'lucide-react';
import { useChat, PersonalityType } from '../context/ChatContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const MAX_NAME_LENGTH = 15;
const MIN_NAME_LENGTH = 2;

// Available voices with their ElevenLabs IDs
const AVAILABLE_VOICES = [
  { id: 'WAYsiv3Yudejrr5Di4lf', name: 'Fren Default', description: 'Your custom Fren voice' },
  { id: 'tVkOo4DLgZb89qB0x4qP', name: 'Fren Old', description: 'Previous Fren voice' },
  { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger', description: 'Warm and friendly' },
  { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria', description: 'Clear and expressive' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Professional and calm' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', description: 'Energetic and upbeat' },
  { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', description: 'Deep and confident' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', description: 'Mature and authoritative' },
  { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', description: 'Young and enthusiastic' },
  { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River', description: 'Smooth and soothing' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', description: 'Casual and relatable' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', description: 'Bright and cheerful' }
];

const PersonalitySettings = () => {
  const [open, setOpen] = React.useState(false);
  const { personalitySettings, updatePersonalitySettings } = useChat();
  const [name, setName] = React.useState(personalitySettings.aiName);
  const [personality, setPersonality] = React.useState<PersonalityType>(personalitySettings.personalityType);
  const [voiceId, setVoiceId] = React.useState(personalitySettings.voiceId || 'WAYsiv3Yudejrr5Di4lf');
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    // Reset form when dialog opens
    if (open) {
      setName(personalitySettings.aiName);
      setPersonality(personalitySettings.personalityType);
      setVoiceId(personalitySettings.voiceId || 'WAYsiv3Yudejrr5Di4lf');
    }
  }, [open, personalitySettings]);
  
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your AI friend settings.",
        variant: "destructive"
      });
      return;
    }
    
    if (name.trim().length < MIN_NAME_LENGTH) {
      toast({
        title: "Name too short",
        description: `Your AI friend's name must be at least ${MIN_NAME_LENGTH} characters.`,
        variant: "destructive"
      });
      return;
    }
    
    if (name.trim().length > MAX_NAME_LENGTH) {
      toast({
        title: "Name too long",
        description: `Your AI friend's name must be at most ${MAX_NAME_LENGTH} characters.`,
        variant: "destructive"
      });
      return;
    }
    
    await updatePersonalitySettings({
      aiName: name.trim(),
      personalityType: personality,
      voiceId: voiceId
    });
    
    setOpen(false);
  };

  const selectedVoice = AVAILABLE_VOICES.find(voice => voice.id === voiceId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>AI Friend Settings</DialogTitle>
          <DialogDescription>
            Customize your AI friend's personality, name, and voice
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="space-y-2">
            <Label htmlFor="ai-name">Name</Label>
            <Input 
              id="ai-name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for your AI friend"
              maxLength={MAX_NAME_LENGTH}
            />
            <p className="text-xs text-muted-foreground">
              {name.length}/{MAX_NAME_LENGTH} characters
            </p>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Voice Selection
            </Label>
            <Select value={voiceId} onValueChange={setVoiceId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a voice">
                  {selectedVoice && (
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{selectedVoice.name}</span>
                      <span className="text-xs text-muted-foreground">{selectedVoice.description}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_VOICES.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{voice.name}</span>
                      <span className="text-xs text-muted-foreground">{voice.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <Label>Personality</Label>
            <RadioGroup 
              value={personality} 
              onValueChange={(value) => setPersonality(value as PersonalityType)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friendly" id="friendly" />
                <Label htmlFor="friendly" className="cursor-pointer">
                  <span className="font-medium">Friendly</span>
                  <p className="text-xs text-muted-foreground">
                    Casual, upbeat, and relatable like a good friend
                  </p>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="supportive" id="supportive" />
                <Label htmlFor="supportive" className="cursor-pointer">
                  <span className="font-medium">Supportive</span>
                  <p className="text-xs text-muted-foreground">
                    Nurturing, empathetic, and encouraging like a trusted mentor
                  </p>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="witty" id="witty" />
                <Label htmlFor="witty" className="cursor-pointer">
                  <span className="font-medium">Witty</span>
                  <p className="text-xs text-muted-foreground">
                    Playful, clever, and humorous with a light personality
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={!user}>
              {user ? 'Save Settings' : 'Sign In to Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalitySettings;

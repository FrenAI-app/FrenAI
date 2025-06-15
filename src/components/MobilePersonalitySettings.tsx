
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";

const MAX_NAME_LENGTH = 15;
const MIN_NAME_LENGTH = 2;

const MobilePersonalitySettings = () => {
  const [open, setOpen] = React.useState(false);
  const { personalitySettings, updatePersonalitySettings } = useChat();
  const [name, setName] = React.useState(personalitySettings.aiName);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    // Reset form when dialog opens
    if (open) {
      setName(personalitySettings.aiName);
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
      aiName: name.trim()
    });
    
    setOpen(false);
  };

  // Generate color for witty personality
  const getPersonalityColor = () => {
    return 'bg-amber-500';
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>AI Friend Settings</DrawerTitle>
          <DrawerDescription>
            Choose a name for your witty AI friend
          </DrawerDescription>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="px-4 overflow-y-auto">
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="ai-name-mobile">Name</Label>
              <Input 
                id="ai-name-mobile" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name for your AI friend"
                maxLength={MAX_NAME_LENGTH}
                className="text-base h-12"
              />
              <p className="text-xs text-muted-foreground">
                {name.length}/{MAX_NAME_LENGTH} characters
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <Label>Personality</Label>
              <div className="p-4 rounded-lg border border-amber-500 ring-2 ring-amber-500 ring-opacity-50">
                <div className="flex items-center gap-3">
                  <div className={`${getPersonalityColor()} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold`}>
                    W
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Witty</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Playful, clever, and humorous with a light personality
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DrawerFooter className="pt-6 pb-8">
            <Button type="submit" className="w-full h-12 text-base" disabled={!user}>
              {user ? 'Save Settings' : 'Sign In to Save'}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default MobilePersonalitySettings;

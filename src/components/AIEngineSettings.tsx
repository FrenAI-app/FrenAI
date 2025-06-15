
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sliders } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from '@/components/ui/use-toast';

const AIEngineSettings = () => {
  const [open, setOpen] = React.useState(false);
  const [model, setModel] = useState('llama-3.1-sonar-small-128k-online');
  const [temperature, setTemperature] = useState(0.7);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        // Load settings if user is signed in
        if (currentSession) {
          loadSettings(currentSession.user.id);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      // Load settings if user is signed in
      if (currentSession) {
        loadSettings(currentSession.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_engine_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setModel(data.model);
        setTemperature(data.temperature);
      } else {
        // Create default settings if none exist
        await supabase.from('ai_engine_settings').insert({
          user_id: userId,
          model: 'llama-3.1-sonar-small-128k-online',
          temperature: 0.7
        });
      }
    } catch (error) {
      console.error('Error loading AI settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save settings",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('ai_engine_settings')
        .upsert({
          user_id: session.user.id,
          model,
          temperature,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast({
        title: "Settings saved",
        description: "Your AI engine settings have been updated",
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full ml-2">
          <Sliders className="h-4 w-4" />
          <span className="sr-only">AI Engine Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Engine Settings</DialogTitle>
          <DialogDescription>
            Configure the AI engine parameters to customize your chat experience.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Model
              </Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llama-3.1-sonar-small-128k-online">Llama 3.1 Small (Fast)</SelectItem>
                  <SelectItem value="llama-3.1-sonar-large-128k-online">Llama 3.1 Large (Advanced)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="temperature" className="text-right">
                Temperature
              </Label>
              <div className="col-span-3 space-y-2">
                <Slider 
                  value={[temperature]} 
                  min={0} 
                  max={2} 
                  step={0.1}
                  onValueChange={values => setTemperature(values[0])} 
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>More Focused ({temperature.toFixed(1)})</span>
                  <span>More Creative</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AIEngineSettings;

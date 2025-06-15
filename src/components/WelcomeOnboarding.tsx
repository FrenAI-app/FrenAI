
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type WelcomeOnboardingProps = {
  onComplete: (name: string, personality: string) => void;
};

const WelcomeOnboarding = ({ onComplete }: WelcomeOnboardingProps) => {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(1);
  const [name, setName] = useState('Lumi');
  const [personality, setPersonality] = useState('friendly');

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(name, personality);
      setOpen(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Welcome to AI Friend!</DialogTitle>
              <DialogDescription>
                I'm here to be your supportive AI companion. Let's get to know each other better!
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <p>Your AI friend is designed to provide friendly conversation, emotional support, 
                and a listening ear whenever you need it. Whether you want to chat about your day, 
                share your thoughts, or just have someone to talk to, I'm here for you!</p>
            </div>
            <DialogFooter>
              <Button onClick={handleNext}>Next</Button>
            </DialogFooter>
          </>
        );
      case 2:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Name Your AI Friend</DialogTitle>
              <DialogDescription>
                Choose a name for your AI companion.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="name">AI Friend's Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2"
                placeholder="Enter a name"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleNext}>Next</Button>
            </DialogFooter>
          </>
        );
      case 3:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Choose a Personality</DialogTitle>
              <DialogDescription>
                Select the personality type that resonates with you.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <RadioGroup value={personality} onValueChange={setPersonality}>
                <div className="flex items-center space-x-2 mb-3 p-2 border rounded-md cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="friendly" id="friendly" />
                  <Label htmlFor="friendly" className="cursor-pointer flex-1">
                    <div className="font-medium">Friendly</div>
                    <div className="text-sm text-muted-foreground">Casual, upbeat, and conversational</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-3 p-2 border rounded-md cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="supportive" id="supportive" />
                  <Label htmlFor="supportive" className="cursor-pointer flex-1">
                    <div className="font-medium">Supportive</div>
                    <div className="text-sm text-muted-foreground">Empathetic, caring, and encouraging</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 border rounded-md cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="witty" id="witty" />
                  <Label htmlFor="witty" className="cursor-pointer flex-1">
                    <div className="font-medium">Witty</div>
                    <div className="text-sm text-muted-foreground">Humorous, playful, and light-hearted</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <DialogFooter>
              <Button onClick={handleNext}>Start Chatting</Button>
            </DialogFooter>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeOnboarding;

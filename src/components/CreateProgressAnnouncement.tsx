
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createProgressAnnouncement } from '@/utils/createProgressAnnouncement';
import { toast } from '@/components/ui/use-toast';
import { FileText, Loader2, Zap } from 'lucide-react';

const CreateProgressAnnouncement = () => {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateAnnouncement = async () => {
    setIsCreating(true);

    try {
      const result = await createProgressAnnouncement();
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "Comprehensive technical progress announcement has been published successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create announcement. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-amber-600" />
          Comprehensive Technical Progress Report
        </CardTitle>
        <CardDescription className="text-base">
          Publish a detailed technical progress announcement covering all major infrastructure, features, and optimizations implemented to date.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-green-700 flex items-center gap-2">
                🏗️ Infrastructure & Architecture
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                <li>React 18 + TypeScript with Vite build system</li>
                <li>Supabase PostgreSQL with real-time capabilities</li>
                <li>Tailwind CSS + Shadcn/UI design system</li>
                <li>Component-based architecture with custom hooks</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-blue-700 flex items-center gap-2">
                🔐 Authentication & Security
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                <li>Privy SDK with multi-provider authentication</li>
                <li>Web3 wallet connections (Phantom, MetaMask)</li>
                <li>JWT token management with secure storage</li>
                <li>Row-Level Security policies</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-purple-700 flex items-center gap-2">
                🤖 AI & Intelligence Features
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                <li>OpenAI GPT-4o with streaming responses</li>
                <li>Real-time sentiment analysis & mood detection</li>
                <li>Voice interaction (speech-to-text & TTS)</li>
                <li>Custom personality system with multiple personas</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-amber-700 flex items-center gap-2">
                ⛓️ Blockchain & Tokens
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                <li>Solana blockchain integration</li>
                <li>FREN token smart contract connectivity</li>
                <li>Daily rewards with streak-based bonuses</li>
                <li>Real-time balance synchronization</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-green-700 flex items-center gap-2">
                📱 Mobile & Performance
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                <li>Progressive Web App (PWA) capabilities</li>
                <li>iOS/Android touch optimizations</li>
                <li>Hardware acceleration for animations</li>
                <li>Code splitting and lazy loading</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-pink-700 flex items-center gap-2">
                🎨 UI/UX & Animations
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                <li>Framer Motion with micro-interactions</li>
                <li>Animated duck mascot with mood expressions</li>
                <li>Glassmorphism design with backdrop blur</li>
                <li>Accessibility features and keyboard navigation</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-4">
              This comprehensive report will detail the technical achievements across all areas of the FrenAI platform, 
              providing insights into the robust infrastructure and advanced features that power the user experience.
            </p>
            
            <Button 
              onClick={handleCreateAnnouncement}
              disabled={isCreating}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg"
              size="lg"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Publishing Comprehensive Report...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  Publish Comprehensive Technical Report
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateProgressAnnouncement;

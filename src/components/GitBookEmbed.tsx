
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card } from '@/components/ui/card';
import { ExternalLink, AlertCircle, Github, RefreshCw, FileText, Code, BookOpen, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FrenLittlepaper from './FrenLittlepaper';

const GitBookEmbed = () => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>("Please use the 'Open in New Tab' button to view the repository.");
  const [activeView, setActiveView] = useState<'littlepaper' | 'github'>('littlepaper');
  
  const githubUrl = "https://github.com/FrenAI-app/FrenAI";
  
  // Memoize height calculation for better performance
  const containerHeight = useMemo(() => {
    if (isMobile) {
      return 'h-[calc(100vh-400px)] min-h-[400px]';
    }
    return 'h-[650px]';
  }, [isMobile]);
  
  // Set error immediately for GitHub embedding since it's known to be blocked
  useEffect(() => {
    if (activeView === 'github') {
      setError("Please use the 'Open in New Tab' button to view the repository.");
      setIsLoading(false);
    }
  }, [activeView]);

  const openInNewTab = useCallback(() => {
    window.open(githubUrl, '_blank', 'noopener,noreferrer');
  }, [githubUrl]);

  const handleViewChange = useCallback((view: 'littlepaper' | 'github') => {
    setActiveView(view);
    if (view === 'littlepaper') {
      setError(null);
    } else if (view === 'github') {
      setError("Please use the 'Open in New Tab' button to view the repository.");
      setIsLoading(false);
    }
  }, []);

  // Enhanced GitHub repository display with better error handling
  const GitHubRepositoryDisplay = useMemo(() => {
    return (
      <div className="flex items-center justify-center h-full enhanced-glass-card p-6 rounded-2xl">
        <div className="text-center max-w-md enhanced-glass-card p-10 rounded-3xl">
          <div className="relative mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full inline-block">
              <Github className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent mb-6 font-quicksand">
            GitHub
          </h3>
          
          <div className="space-y-4">
            <Button 
              onClick={openInNewTab} 
              className="w-full shadow-xl hover:shadow-2xl transition-all duration-300 py-3 rounded-2xl font-semibold"
              size="lg"
            >
              <ExternalLink className="h-5 w-5 mr-3" />
              Explore on GitHub
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-sm text-purple-600 font-medium enhanced-glass-card rounded-xl py-2 px-4">
              <GitBranch className="h-4 w-4" />
              <span>FrenAI-app/FrenAI</span>
            </div>
          </div>
        </div>
      </div>
    );
  }, [error, openInNewTab, isMobile]);

  return (
    <div className={`${isMobile ? 'w-full px-2' : 'max-w-6xl mx-auto'}`}>
      {/* Top Navigation Buttons */}
      <div className={`flex justify-center gap-3 ${isMobile ? 'mb-4 px-2' : 'mb-6'}`}>
        <Button
          variant={activeView === 'littlepaper' ? 'default' : 'outline'}
          onClick={() => handleViewChange('littlepaper')}
          className={`${isMobile ? 'flex-1 px-4 py-3' : 'px-6 py-3'} rounded-lg font-medium`}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Manifesto
        </Button>
        
        <Button
          variant={activeView === 'github' ? 'default' : 'outline'}
          onClick={() => handleViewChange('github')}
          className={`${isMobile ? 'flex-1 px-4 py-3' : 'px-6 py-3'} rounded-lg font-medium`}
        >
          <Github className="h-4 w-4 mr-2" />
          GitHub
        </Button>
      </div>
      
      <Card className="enhanced-glass-card border-white/30 shadow-lg overflow-hidden">
        <div className={`${containerHeight} relative`}>
          {activeView === 'littlepaper' ? (
            <div className="h-full overflow-y-auto overscroll-contain">
              <FrenLittlepaper />
            </div>
          ) : (
            GitHubRepositoryDisplay
          )}
        </div>
      </Card>
    </div>
  );
};

export default GitBookEmbed;

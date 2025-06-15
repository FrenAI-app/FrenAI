import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Expand, Minimize } from 'lucide-react';
import WhitepaperSection from './whitepaper/WhitepaperSection';
import { whitepaperSections } from './whitepaper/whitepaperData';

const FrenLittlepaper = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Auto-expand the first section with error handling
      if (whitepaperSections && whitepaperSections.length > 0) {
        setExpandedSections({ [whitepaperSections[0].id]: true });
        setActiveSection(whitepaperSections[0].id);
      }
    } catch (error) {
      console.error('Error loading whitepaper sections:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleSection = (sectionId: string) => {
    try {
      setExpandedSections(prev => ({
        ...prev,
        [sectionId]: !prev[sectionId]
      }));
      setActiveSection(sectionId);
    } catch (error) {
      console.error('Error toggling section:', error);
    }
  };

  const handleExpandAll = () => {
    try {
      const allExpanded = whitepaperSections.reduce((acc, section) => {
        acc[section.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setExpandedSections(allExpanded);
    } catch (error) {
      console.error('Error expanding all sections:', error);
    }
  };

  const handleCollapseAll = () => {
    try {
      setExpandedSections({});
      setActiveSection('');
    } catch (error) {
      console.error('Error collapsing all sections:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-white/10 to-purple-50/20 backdrop-blur-md rounded-2xl">
        <div className="text-center">
          <div className="h-8 w-8 rounded-full border-4 border-t-purple-500 border-r-purple-200 border-b-purple-500 border-l-purple-200 animate-spin mx-auto mb-4"></div>
          <p className="text-purple-600 font-medium">Loading whitepaper...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-white/10 to-purple-50/20 backdrop-blur-md rounded-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img 
            src="/lovable-uploads/ef81092e-a30e-4954-8f1f-75de0119e44a.png" 
            alt="FREN Mascot" 
            className="h-12 w-12"
            onError={(e) => {
              console.error('Error loading mascot image');
              e.currentTarget.style.display = 'none';
            }}
          />
          <h1 className="text-3xl font-bold text-purple-800 font-quicksand">
            FrenAI Manifesto
          </h1>
        </div>
        <p className="text-purple-600 max-w-2xl mx-auto font-medium">
          The complete guide to our AI-powered conversation platform and community-owned token ecosystem
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mb-8">
        <Button 
          onClick={handleExpandAll}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <Expand className="h-4 w-4 mr-2" />
          Expand All
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleCollapseAll}
          className="enhanced-glass-card bg-white/20 backdrop-blur-lg border-white/30 text-purple-700 hover:bg-white/30 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Minimize className="h-4 w-4 mr-2" />
          Collapse All
        </Button>
      </div>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto space-y-4">
        {whitepaperSections && whitepaperSections.length > 0 ? (
          whitepaperSections.map((section) => (
            <div key={section.id} id={`section-${section.id}`}>
              <WhitepaperSection
                section={{
                  ...section,
                  icon: <section.icon className={`h-5 w-5 ${section.color}`} />
                }}
                isExpanded={expandedSections[section.id] || false}
                onToggle={toggleSection}
              />
            </div>
          ))
        ) : (
          <div className="text-center p-8">
            <p className="text-purple-600 font-medium">No whitepaper sections available.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <Card className="enhanced-glass-card bg-white/30 backdrop-blur-lg border-white/30 p-6 max-w-2xl mx-auto shadow-lg">
          <h3 className="text-lg font-semibold text-purple-800 mb-2 font-quicksand">
            Join the Community Vision
          </h3>
          <p className="text-purple-600 text-sm font-medium">
            This manifesto represents our shared vision for a more inclusive future of artificial intelligence. Every word reflects our commitment to community ownership, democratic governance, and the inspiring belief that AI should enhance human potential rather than serve corporate interests. Together, we're creating the future of human-AI interaction—one built by the community, for the community.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default FrenLittlepaper;


import React from 'react';
import { FileText, Users, Sparkles } from 'lucide-react';

interface LittlepaperHeaderProps {
  isVisible: boolean;
}

const LittlepaperHeader = ({ isVisible }: LittlepaperHeaderProps) => {
  return (
    <div className="relative bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 py-12 px-6 mb-8 rounded-2xl border border-slate-200/60 shadow-lg">
      <div className="text-center space-y-6">
        {/* Logo Section */}
        <div className={`transition-all duration-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <img 
            src="/lovable-uploads/ef81092e-a30e-4954-8f1f-75de0119e44a.png" 
            alt="FREN Duck Mascot" 
            className="h-16 w-16 mx-auto mb-4"
          />
        </div>
        
        {/* Title Section */}
        <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            FREN Documentation
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive guide to the AI-powered conversation platform
          </p>
        </div>
        
        {/* Stats */}
        <div className={`grid grid-cols-3 gap-4 max-w-md mx-auto transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <FileText className="h-5 w-5 text-blue-600 mr-1" />
              <span className="text-xl font-bold text-slate-800">8</span>
            </div>
            <p className="text-sm text-slate-600">Sections</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-5 w-5 text-green-600 mr-1" />
              <span className="text-xl font-bold text-slate-800">Open</span>
            </div>
            <p className="text-sm text-slate-600">Source</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Sparkles className="h-5 w-5 text-purple-600 mr-1" />
              <span className="text-xl font-bold text-slate-800">AI</span>
            </div>
            <p className="text-sm text-slate-600">Powered</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LittlepaperHeader;

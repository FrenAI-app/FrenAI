
import React, { useState } from 'react';
import { Github, Mail, TrendingUp, FileText, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import TermsAndConditions from './TermsAndConditions';
import PrivacyPolicy from './PrivacyPolicy';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleContactClick = () => {
    window.open('mailto:hellofrens@frenai.app', '_blank');
  };

  const handleGithubClick = () => {
    window.open('https://github.com/FrenAI-app/FrenAI', '_blank');
  };

  const handleDexToolsClick = () => {
    window.open('https://www.dextools.io/app/en/solana/pair-explorer/', '_blank');
  };

  return (
    <footer className="w-full border-t border-green-100 bg-gradient-to-r from-green-50/30 to-amber-50/30 backdrop-blur-sm py-2 md:py-3">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-3">
          {/* Legal links - Moved to top */}
          <div className="flex items-center justify-center gap-3 border-b border-green-100/50 pb-2">
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200 underline-offset-2 hover:underline">
                  Terms & Conditions
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] p-0">
                <TermsAndConditions />
              </DialogContent>
            </Dialog>

            <span className="text-xs text-gray-300">•</span>

            <Dialog>
              <DialogTrigger asChild>
                <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200 underline-offset-2 hover:underline">
                  Privacy Policy
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] p-0">
                <PrivacyPolicy />
              </DialogContent>
            </Dialog>
          </div>

          {/* Main footer content */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            {/* Social Icons */}
            <div className="flex items-center gap-2 md:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleContactClick}
                className="group flex items-center gap-1.5 text-green-700 hover:text-green-800 hover:bg-green-100/80 transition-all duration-200 hover:scale-105 text-xs md:text-sm px-2 py-1 h-8"
              >
                <Mail className="h-3 w-3 md:h-4 md:w-4 group-hover:animate-bounce" />
                <span className="hidden sm:inline">Contact</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGithubClick}
                className="group flex items-center gap-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100/80 transition-all duration-200 hover:scale-105 text-xs md:text-sm px-2 py-1 h-8"
                aria-label="GitHub"
              >
                <Github className="h-3 w-3 md:h-4 md:w-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="hidden sm:inline">GitHub</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDexToolsClick}
                className="group flex items-center gap-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-100/80 transition-all duration-200 hover:scale-105 text-xs md:text-sm px-2 py-1 h-8"
                aria-label="DexTools"
              >
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="hidden sm:inline">DexTools</span>
              </Button>
            </div>

            {/* Copyright */}
            <div className="text-center">
              <p className="text-xs text-gray-500/80 hover:text-gray-700 transition-colors duration-200">
                © {currentYear} FrenAI.app
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

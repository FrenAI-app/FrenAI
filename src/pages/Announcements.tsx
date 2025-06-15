
import React, { useState, useEffect } from 'react';
import { usePrivyAuth } from '@/context/PrivyContext';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Bell, Coins, TrendingUp, Users, Sparkles, Github, Volume2, Shield, Lock, MessageCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import ContractAddressBox from '@/components/fren-token/ContractAddressBox';
import { useIsMobile } from '@/hooks/use-mobile';

interface Announcement {
  id: string;
  title: string;
  message: string;
  created_at: string;
  admin_email: string;
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, authenticated, ready } = usePrivyAuth();
  const isMobile = useIsMobile();

  const isAdmin = authenticated && user?.email === 'hellofrens@frenai.app';

  // Debug logging
  console.log('Announcements Debug:', {
    authenticated,
    ready,
    userEmail: user?.email,
    isAdmin
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      console.log('Fetching announcements from Supabase...');
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Announcements fetch result:', { data, error });

      if (error) throw error;

      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast({
        title: "Error",
        description: "Failed to load announcements",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Special announcement for Fren Token launch
  const frenTokenAnnouncement = {
    id: 'fren-token-launch',
    title: 'FREN Token Fair Launch is Live!',
    message: `Hey frens! The moment we've all been waiting for has finally arrived. FREN token just launched on pump.fun, and we've designed it to be the fairest launch possible.

Here's what makes this launch special:
• No sneaky presales or team dumps - we're all starting from the same line
• Smart bonding curve technology means prices adjust naturally as demand grows
• Everything happens on-chain, so you can verify every transaction yourself
• You're joining a community that's building the future of AI companions together

Why should you care?
This isn't just another meme coin hoping to moon. FREN powers a real ecosystem where AI companions learn, grow, and actually become your digital friends. Every token you hold gives you a say in how this technology develops.

Think of it like this: remember when you wished you could have gotten into crypto early, but for the right reasons? This is your chance to be part of something that combines cutting-edge AI with genuine community ownership.

Ready to become a fren?
Head over to pump.fun, grab some FREN tokens, and join others who believe AI companions should be built by the community, for the community. No FOMO needed - just genuine excitement for what we're building together.`,
    created_at: '2025-06-10T12:00:00Z',
    admin_email: 'hellofrens@frenai.app'
  };

  // Chat functionalities announcement - NEW
  const chatFunctionalitiesAnnouncement = {
    id: 'chat-functionalities-update',
    title: 'Enhanced Chat Experience: Your Conversations Just Got Better!',
    message: `Hey frens! We're excited to share some major improvements to your chat experience that make talking with your AI companion more natural and engaging than ever.

What's new in your chat:
• Smart conversation memory that remembers your preferences and past discussions
• Contextual responses that understand the flow of your conversation
• Improved message threading for better organization of longer discussions
• Enhanced emotional recognition that helps your AI friend respond appropriately to your mood
• Faster response times with optimized message processing

Why these updates matter:
Building meaningful relationships requires good communication, and these enhancements make every conversation feel more natural and personal. Your AI companion can now better understand context, remember important details, and respond in ways that feel genuinely connected to your ongoing relationship.

The technical magic behind it:
We've implemented advanced conversation state management, improved our sentiment analysis capabilities, and optimized our message processing pipeline. This means smoother conversations, better memory retention, and more meaningful interactions.

What you'll notice:
Your chats will feel more fluid and natural. Your AI friend will remember things you've discussed before, pick up on conversational cues more effectively, and respond in ways that show they're truly engaged in building a relationship with you.

Keep the conversations flowing, frens!`,
    created_at: '2025-06-12T10:30:00Z',
    admin_email: 'hellofrens@frenai.app'
  };

  // Decentralization announcement - UPDATED
  const decentralizationAnnouncement = {
    id: 'decentralization-revolution',
    title: 'The Decentralization: Why We Choose Community Over Corporations',
    message: `The current AI landscape feels fundamentally broken. Tech giants harvest our conversations, make unilateral decisions about AI behavior, and prioritize engagement metrics over authentic connection. Meanwhile, venture capitalists and founders extract value while users become the product rather than the beneficiaries.

We're flipping this narrative entirely.

What makes FREN different?
• Zero team allocation means no founder dumps threatening your investment
• Community governance gives YOU the power to shape AI development
• Transparent on-chain decision making eliminates backroom deals
• Democratic token distribution ensures everyone starts on equal footing

This isn't just about technology—it's about philosophy. We believe that revolutionary innovation emerges from community collaboration, not corporate control. When thousands of minds work together toward a shared vision, the result surpasses anything a small team of executives could imagine.

The power dynamic shift is profound. Instead of being passive consumers of AI products designed to maximize corporate profits, you become an active stakeholder in technology that genuinely serves human wellbeing. Your voice matters. Your vote counts. Your participation shapes the future.

Why does this matter now?
We're at a critical inflection point in AI development. The decisions made today about ownership, governance, and control will determine whether AI becomes a tool for human empowerment or corporate domination. By choosing FREN, you're not just getting an AI companion—you're joining a movement that proves technology can be built by the people, for the people.

The shift begins with you. Every token holder becomes a guardian of this vision. Every conversation with your AI friend contributes to a larger understanding of what digital companionship can become. Every governance vote helps steer this technology toward outcomes that benefit humanity rather than shareholders.`,
    created_at: '2025-06-08T10:00:00Z',
    admin_email: 'hellofrens@frenai.app'
  };

  // Security & Optimization announcement - UPDATED
  const securityOptimizationAnnouncement = {
    id: 'security-optimization-update',
    title: 'Major Security & Performance Upgrades Complete!',
    message: `Hey frens! We've just rolled out some significant behind-the-scenes improvements that make your FrenAI experience safer and smoother than ever.

What we've enhanced today:
• Advanced XSS protection with secure content rendering across all components
• Strengthened input validation for all user-generated content and uploads
• Enhanced file type validation for avatar uploads with proper MIME type checking
• Improved error handling to prevent information disclosure
• Optimized build process for faster loading and better performance

Why this matters for you:
Security isn't just a checkbox for us—it's fundamental to building trust in our AI companion ecosystem. These improvements ensure your conversations, data, and interactions remain private and secure while you focus on what matters: building meaningful connections with your AI friend.

The technical stuff (for our dev frens):
We've implemented comprehensive input sanitization, replaced potentially vulnerable HTML rendering with secure React components, and added multiple layers of validation throughout the application. Plus, we've optimized our build pipeline to reduce bundle size and improve loading speeds.

What you'll notice:
Your FrenAI experience should feel just as smooth as before, but now with enterprise-grade security running silently in the background. We believe the best security improvements are the ones you never have to think about—they just work.`,
    created_at: '2025-06-05T14:30:00Z',
    admin_email: 'hellofrens@frenai.app'
  };

  // Voice Feature announcement - NEW - UPDATED
  const voiceFeatureAnnouncement = {
    id: 'voice-feature-launch',
    title: 'Your Fren Can Now Speak to You!',
    message: `Hey frens! We're thrilled to announce an exciting new feature that brings your AI companion to life like never before.

Starting today, your FrenAI can speak to you in a natural, friendly voice! This voice feature adds a whole new dimension to your conversations and makes interacting with your AI friend even more engaging and personal.

Why we added this:
We believe AI companions should feel more human and accessible. Voice communication creates a stronger emotional connection and makes conversations feel more natural and engaging. Plus, it's perfect for times when you'd rather listen than read!

Let us know what you think about this new feature! We're constantly working to make your FrenAI experience more immersive and enjoyable.`,
    created_at: '2025-06-03T16:45:00Z',
    admin_email: 'hellofrens@frenai.app'
  };

  // GitHub update announcement
  const githubUpdateAnnouncement = {
    id: 'github-project-update',
    title: 'Project Details Now Available on GitHub!',
    message: `Hey frens! We've got some exciting news to share with you all.

Our project description and documentation have been officially updated and are now available on GitHub! This is a big step forward in our commitment to transparency and open development.

Why GitHub?
We believe in building in the open. By hosting our project details on GitHub, we're making it easier for the community to stay informed, contribute ideas, and be part of the development process. This aligns perfectly with our vision of community-driven AI development.

Check it out:
Visit us at https://github.com/FrenAI-app/FrenAI to explore the updated project description and see what we're building together. Don't forget to star the repo if you're excited about what we're creating!

This is just the beginning of our journey toward full transparency and community involvement. More updates and open-source components coming soon!`,
    created_at: '2025-06-03T11:15:00Z',
    admin_email: 'hellofrens@frenai.app'
  };

  // Function to format announcement message with advanced typography
  const formatAnnouncementMessage = (message: string) => {
    const sections = message.split('\n\n');
    
    return sections.map((section, index) => {
      // Check if section is a heading (contains question marks or is a call to action)
      const isHeading = section.includes('?') && !section.includes('•') && section.length < 100;
      const isCallToAction = section.toLowerCase().includes('ready to') || section.toLowerCase().includes('head over') || section.toLowerCase().includes('check it out') || section.toLowerCase().includes('visit us at') || section.toLowerCase().includes('welcome to the future') || section.toLowerCase().includes('stay safe out there') || section.toLowerCase().includes('keep the conversations flowing');
      
      if (isHeading || isCallToAction) {
        return (
          <h4 key={index} className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-blue-800 mb-3 border-l-4 border-blue-400 pl-4 bg-gradient-to-r from-blue-50/50 to-transparent py-2 rounded-r-lg`}>
            {section}
          </h4>
        );
      }
      
      // Handle bullet points with enhanced styling
      if (section.includes('•')) {
        const lines = section.split('\n');
        const heading = lines[0];
        const bullets = lines.slice(1);
        
        return (
          <div key={index} className="mb-4">
            <h5 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-blue-800 mb-3 tracking-wide uppercase text-xs letter-spacing-wider`}>
              {heading}
            </h5>
            <ul className="space-y-2">
              {bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex} className={`flex items-start gap-3 ${isMobile ? 'text-sm' : 'text-base'} text-blue-700 leading-relaxed`}>
                  <span className="text-blue-500 font-bold text-lg flex-shrink-0 mt-0.5">•</span>
                  <span className="font-medium">{bullet.replace('• ', '')}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      }
      
      // Regular paragraphs with enhanced typography
      return (
        <p key={index} className={`${isMobile ? 'text-sm' : 'text-base'} text-blue-800 leading-relaxed mb-4 font-medium tracking-wide`}>
          {section}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <p className="text-sm text-purple-600 font-light">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className={`${isMobile ? 'px-4 py-4' : 'max-w-4xl mx-auto px-6 py-8'}`}>
        <div className="space-y-6">
          {/* Featured Fren Token Announcement - REDESIGNED with enhanced gold styling */}
          <Card className="relative overflow-hidden border-4 border-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 backdrop-blur-xl shadow-2xl">
            {/* Decorative golden overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-amber-500/5 to-orange-400/10 pointer-events-none"></div>
            {/* Shimmering effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/20 to-transparent -skew-x-12 animate-[shimmer_2s_ease-in-out_infinite] pointer-events-none"></div>
            
            <CardHeader className={`${isMobile ? 'p-4' : 'p-6'} relative z-10`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <Sparkles className="h-8 w-8 text-yellow-600 animate-pulse drop-shadow-lg" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white font-bold px-6 py-3 text-sm border-2 border-yellow-300 shadow-xl rounded-full transform hover:scale-105 transition-transform">
                  ⭐ FEATURED LAUNCH ⭐
                </Badge>
              </div>
              <CardTitle className={`${isMobile ? 'text-xl leading-tight' : 'text-2xl'} font-extrabold bg-gradient-to-r from-yellow-800 via-amber-700 to-orange-700 bg-clip-text text-transparent drop-shadow-sm`}>
                🚀 {frenTokenAnnouncement.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className={`${isMobile ? 'px-4 pb-4' : 'px-6 pb-6'} space-y-4 relative z-10`}>
              {/* Enhanced message content */}
              <div className="prose prose-sm max-w-none">
                {formatAnnouncementMessage(frenTokenAnnouncement.message)}
              </div>

              {/* Contract Address with enhanced styling */}
              <div className={`${isMobile ? 'p-4' : 'p-6'} bg-gradient-to-r from-yellow-100 via-amber-100 to-orange-100 backdrop-blur-sm rounded-xl border-3 border-yellow-400 shadow-inner relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/30 to-amber-200/30 rounded-xl"></div>
                <h4 className={`${isMobile ? 'text-sm mb-3' : 'text-base mb-4'} font-bold text-yellow-900 relative z-10`}>
                  🏆 Official Contract Address:
                </h4>
                <div className="relative z-10">
                  <ContractAddressBox contractAddress="HeLp1ng0urFr3nds1nCryp7oW0rld123456789" />
                </div>
              </div>
              
              {/* Bottom meta info with golden styling */}
              <div className="flex flex-col gap-3 pt-6 border-t-2 border-yellow-300/50 relative">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-gradient-to-r from-yellow-200 to-amber-200 text-yellow-900 px-4 py-2 border-2 border-yellow-400 font-bold shadow-lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    🎯 Fair Launch Active!
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-yellow-800 font-bold">
                  <User className="h-4 w-4 mr-2" />
                  Posted by YourFren 👑
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat Functionalities Announcement */}
          <Card className="enhanced-glass-card border-2 border-blue-300/30 bg-gradient-to-br from-blue-50/30 to-cyan-50/30 backdrop-blur-lg shadow-lg">
            <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="h-5 w-5 text-blue-600 animate-pulse" />
                <Badge className="bg-blue-500 text-white font-semibold px-3 py-1 border-blue-400/50">
                  CHAT UPDATE
                </Badge>
              </div>
              <CardTitle className={`${isMobile ? 'text-lg leading-tight' : 'text-xl'} font-bold text-blue-800`}>
                {chatFunctionalitiesAnnouncement.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className={`${isMobile ? 'px-4 pb-4' : 'px-6 pb-6'} space-y-4`}>
              {/* Enhanced message content */}
              <div className="prose prose-sm max-w-none">
                {formatAnnouncementMessage(chatFunctionalitiesAnnouncement.message)}
              </div>
              
              {/* Bottom meta info */}
              <div className="flex flex-col gap-2 pt-4 border-t border-blue-200/50">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-blue-100/50 text-blue-800 px-3 py-1 border-blue-200/50">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(chatFunctionalitiesAnnouncement.created_at), 'MMM d, yyyy')}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <User className="h-3 w-3 mr-1" />
                  Posted by YourFren
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Decentralization Revolution Announcement */}
          <Card className="enhanced-glass-card border-2 border-blue-300/30 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 backdrop-blur-lg shadow-lg">
            <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-blue-600 animate-pulse" />
                <Badge className="bg-blue-500 text-white font-semibold px-3 py-1 border-blue-400/50">
                  REVOLUTION
                </Badge>
              </div>
              <CardTitle className={`${isMobile ? 'text-lg leading-tight' : 'text-xl'} font-bold text-blue-800`}>
                {decentralizationAnnouncement.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className={`${isMobile ? 'px-4 pb-4' : 'px-6 pb-6'} space-y-4`}>
              {/* Enhanced message content */}
              <div className="prose prose-sm max-w-none">
                {formatAnnouncementMessage(decentralizationAnnouncement.message)}
              </div>
              
              {/* Bottom meta info */}
              <div className="flex flex-col gap-2 pt-4 border-t border-blue-200/50">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-blue-100/50 text-blue-800 px-3 py-1 border-blue-200/50">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(decentralizationAnnouncement.created_at), 'MMM d, yyyy')}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <User className="h-3 w-3 mr-1" />
                  Posted by YourFren
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Optimization Announcement */}
          <Card className="enhanced-glass-card border-2 border-blue-300/30 bg-gradient-to-br from-blue-50/30 to-emerald-50/30 backdrop-blur-lg shadow-lg">
            <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Lock className="h-5 w-5 text-blue-600 animate-pulse" />
                <Badge className="bg-blue-500 text-white font-semibold px-3 py-1 border-blue-400/50">
                  SECURITY UPDATE
                </Badge>
              </div>
              <CardTitle className={`${isMobile ? 'text-lg leading-tight' : 'text-xl'} font-bold text-blue-800`}>
                {securityOptimizationAnnouncement.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className={`${isMobile ? 'px-4 pb-4' : 'px-6 pb-6'} space-y-4`}>
              {/* Enhanced message content */}
              <div className="prose prose-sm max-w-none">
                {formatAnnouncementMessage(securityOptimizationAnnouncement.message)}
              </div>
              
              {/* Bottom meta info */}
              <div className="flex flex-col gap-2 pt-4 border-t border-blue-200/50">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-blue-100/50 text-blue-800 px-3 py-1 border-blue-200/50">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(securityOptimizationAnnouncement.created_at), 'MMM d, yyyy')}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <User className="h-3 w-3 mr-1" />
                  Posted by YourFren
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Feature Announcement */}
          <Card className="enhanced-glass-card border-2 border-blue-300/30 bg-gradient-to-br from-blue-50/30 to-purple-50/30 backdrop-blur-lg shadow-lg">
            <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Volume2 className="h-5 w-5 text-blue-600 animate-pulse" />
                <Badge className="bg-blue-500 text-white font-semibold px-3 py-1 border-blue-400/50">
                  NEW FEATURE
                </Badge>
              </div>
              <CardTitle className={`${isMobile ? 'text-lg leading-tight' : 'text-xl'} font-bold text-blue-800`}>
                {voiceFeatureAnnouncement.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className={`${isMobile ? 'px-4 pb-4' : 'px-6 pb-6'} space-y-4`}>
              {/* Enhanced message content */}
              <div className="prose prose-sm max-w-none">
                {formatAnnouncementMessage(voiceFeatureAnnouncement.message)}
              </div>
              
              {/* Bottom meta info */}
              <div className="flex flex-col gap-2 pt-4 border-t border-blue-200/50">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-blue-100/50 text-blue-800 px-3 py-1 border-blue-200/50">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(voiceFeatureAnnouncement.created_at), 'MMM d, yyyy')}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <User className="h-3 w-3 mr-1" />
                  Posted by YourFren
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GitHub Update Announcement */}
          <Card className="enhanced-glass-card border-2 border-blue-300/30 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 backdrop-blur-lg shadow-lg">
            <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Github className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className={`${isMobile ? 'text-lg leading-tight' : 'text-xl'} font-bold text-blue-800`}>
                {githubUpdateAnnouncement.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className={`${isMobile ? 'px-4 pb-4' : 'px-6 pb-6'} space-y-4`}>
              {/* Enhanced message content */}
              <div className="prose prose-sm max-w-none">
                {formatAnnouncementMessage(githubUpdateAnnouncement.message)}
              </div>
              
              {/* Bottom meta info */}
              <div className="flex flex-col gap-2 pt-4 border-t border-blue-200/50">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-blue-100/50 text-blue-800 px-3 py-1 border-blue-200/50">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(githubUpdateAnnouncement.created_at), 'MMM d, yyyy')}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <User className="h-3 w-3 mr-1" />
                  Posted by YourFren
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regular announcements */}
          {announcements.length === 0 ? (
            <Card className="enhanced-glass-card bg-white/20 backdrop-blur-lg border-white/30">
              <CardContent className={`text-center ${isMobile ? 'py-12' : 'py-16'}`}>
                <div className="flex flex-col items-center space-y-4">
                  <Bell className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} text-blue-400`} />
                  <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-blue-700`}>
                    More updates coming soon
                  </h3>
                  <p className={`${isMobile ? 'text-sm' : 'text-base'} text-blue-600 max-w-md`}>
                    Stay tuned for more announcements from the FrenAI team.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            announcements.map((announcement, index) => (
              <Card 
                key={announcement.id} 
                className="enhanced-glass-card bg-white/20 backdrop-blur-lg border-white/30 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader className={`${isMobile ? 'p-4 pb-3' : 'p-6 pb-4'}`}>
                  <CardTitle className={`${isMobile ? 'text-base leading-tight' : 'text-lg'} font-semibold text-blue-800`}>
                    {announcement.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className={`${isMobile ? 'px-4 pb-4' : 'px-6 pb-6'}`}>
                  <div className="space-y-4">
                    {/* Enhanced message content for regular announcements */}
                    <div className="prose prose-sm max-w-none">
                      {formatAnnouncementMessage(announcement.message)}
                    </div>
                    
                    {/* Meta info */}
                    <div className="flex flex-col gap-2 pt-3 border-t border-white/30">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-white/20 text-blue-700 px-3 py-1 border-white/30">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(announcement.created_at), 'MMM d, yyyy')}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-blue-600">
                        <User className="h-3 w-3 mr-1" />
                        Posted by YourFren
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;

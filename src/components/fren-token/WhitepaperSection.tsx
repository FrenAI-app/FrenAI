
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ChevronDown, ChevronUp, BookOpen, Target, Coins, Users, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhitepaperSection = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const sections = [
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      icon: <Target className="h-5 w-5" />,
      content: `FREN Token represents a revolutionary approach to AI-human interaction, powered by blockchain technology and community governance. Built as a community-driven token with 100% community ownership, FREN enables users to engage with AI companions in meaningful, personalized ways while maintaining privacy and autonomy.

Our platform combines cutting-edge AI technology with decentralized principles, creating an ecosystem where users can chat with AI friends, play games, earn rewards, and participate in governance decisions. The FREN token serves as the utility token that powers all interactions within the ecosystem.

Key highlights include zero team allocation, fair launch distribution, and a focus on building genuine AI-human relationships. With a total supply of 1 billion tokens, FREN is designed to create lasting value through utility and community engagement rather than speculation.`
    },
    {
      id: 'technical-architecture',
      title: 'Technical Architecture',
      icon: <Zap className="h-5 w-5" />,
      content: `The FREN ecosystem is built on a robust technical foundation that prioritizes scalability, security, and user experience:

**Blockchain Infrastructure:**
- Multi-chain compatibility with primary deployment on Solana for fast, low-cost transactions
- Smart contracts for token distribution, governance, and reward mechanisms
- Decentralized storage for user preferences and AI interaction data

**AI Engine:**
- Advanced natural language processing for contextual conversations
- Emotional intelligence algorithms for personalized responses
- Machine learning models that adapt to individual user preferences
- Privacy-preserving AI that processes data locally when possible

**Platform Components:**
- React-based frontend with responsive design for mobile and desktop
- Real-time messaging system with WebSocket connections
- Gamification engine with achievement tracking and rewards
- Voice interaction capabilities with speech-to-text and text-to-speech

**Security Features:**
- End-to-end encryption for private conversations
- Non-custodial wallet integration
- Decentralized identity management
- Regular security audits and community oversight`
    },
    {
      id: 'tokenomics',
      title: 'Tokenomics',
      icon: <Coins className="h-5 w-5" />,
      content: `FREN Token follows a fair and transparent tokenomics model designed for long-term sustainability:

**Total Supply:** 1,000,000,000 FREN tokens

**Distribution:**
- 100% Community Allocation
- 0% Team/Founder allocation
- 0% Private sale
- 0% Venture capital funding

**Utility Functions:**
- Premium AI features and advanced conversation modes
- Game participation and tournament entry fees
- Governance voting rights for platform decisions
- Staking rewards for long-term holders
- NFT avatar generation and customization
- Access to exclusive community events and features

**Burn Mechanism:**
- Quarterly token burns based on platform usage
- Deflationary pressure through utility consumption
- Community-voted special burn events

**Reward Distribution:**
- Daily login rewards
- Achievement-based token distribution
- Community contribution incentives
- Referral program bonuses
- Active participation rewards`
    },
    {
      id: 'governance',
      title: 'Governance Model',
      icon: <Users className="h-5 w-5" />,
      content: `FREN operates under a decentralized autonomous organization (DAO) structure:

**Governance Rights:**
- Token holders vote on platform improvements
- Community decides on new features and integrations
- Transparent proposal and voting system
- Progressive decentralization roadmap

**Proposal Process:**
1. Community member submits improvement proposal
2. Discussion period for feedback and refinement
3. Formal voting period with token-weighted votes
4. Implementation if proposal passes threshold

**Voting Power:**
- 1 FREN token = 1 vote
- Minimum holding period to prevent manipulation
- Delegated voting for passive participants
- Quadratic voting for major decisions

**Treasury Management:**
- Community-controlled development fund
- Marketing and partnership budgets
- Emergency reserves for platform stability
- Transparent fund allocation and reporting`
    },
    {
      id: 'roadmap',
      title: 'Development Roadmap',
      icon: <BookOpen className="h-5 w-5" />,
      content: `Our roadmap focuses on sustainable growth and community value:

**Phase 1: Foundation (Q1 2024)**
- Token launch and initial distribution
- Core AI chat functionality
- Basic gamification features
- Community establishment

**Phase 2: Enhancement (Q2 2024)**
- Advanced AI personality customization
- Mobile application launch
- Voice interaction features
- Staking and rewards system

**Phase 3: Expansion (Q3 2024)**
- Multi-chain deployment
- NFT avatar marketplace
- Advanced gaming features
- Partnership integrations

**Phase 4: Ecosystem (Q4 2024)**
- Developer SDK release
- Third-party AI model integration
- Advanced governance features
- Enterprise partnerships

**Future Phases:**
- Metaverse integration
- AI model training marketplace
- Cross-platform compatibility
- Global scaling initiatives`
    },
    {
      id: 'use-cases',
      title: 'Use Cases & Applications',
      icon: <Shield className="h-5 w-5" />,
      content: `FREN Token enables diverse applications across multiple domains:

**Personal AI Companionship:**
- Emotional support and conversation
- Language learning assistance
- Creative collaboration and brainstorming
- Mental health and wellness check-ins
- Daily motivation and goal tracking

**Gaming & Entertainment:**
- Interactive story-driven games
- Puzzle and strategy challenges
- Virtual pet care and growth
- Achievement hunting and collections
- Community tournaments and competitions

**Educational Applications:**
- Personalized tutoring sessions
- Skill development tracking
- Knowledge retention games
- Study companion features
- Learning progress analytics

**Professional Use Cases:**
- Productivity assistance and task management
- Creative writing and content generation
- Code review and programming help
- Business strategy discussions
- Team collaboration enhancement

**Community Features:**
- Social networking with AI mediation
- Group activities and events
- Collaborative decision making
- Shared experiences and memories
- Cultural exchange and learning`
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative">
            <FileText className="h-8 w-8 text-purple-600 animate-bounce" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-purple-400 rounded-full animate-ping" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
            FREN Whitepaper
          </h2>
          <div className="relative">
            <BookOpen className="h-8 w-8 text-pink-600 animate-bounce" style={{ animationDelay: '0.5s' }} />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
        
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Comprehensive technical documentation and vision for the future of AI-human interaction
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200">
            <span className="text-sm font-medium text-purple-700">📊 Technical Specs</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border border-green-200">
            <span className="text-sm font-medium text-green-700">🚀 Roadmap</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full border border-blue-200">
            <span className="text-sm font-medium text-blue-700">💡 Use Cases</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <Card 
            key={section.id} 
            className="overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader 
              className="cursor-pointer bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300"
              onClick={() => toggleSection(section.id)}
            >
              <CardTitle className="flex items-center justify-between text-purple-800 group-hover:text-purple-900 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-purple-200 group-hover:scale-110 transition-transform duration-300">
                    {section.icon}
                  </div>
                  <span className="text-lg md:text-xl font-semibold">{section.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-purple-600 hidden md:block">
                    {expandedSections[section.id] ? 'Click to collapse' : 'Click to expand'}
                  </div>
                  {expandedSections[section.id] ? (
                    <ChevronUp className="h-5 w-5 transition-transform duration-300 transform rotate-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 transition-transform duration-300 transform rotate-0" />
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            
            {expandedSections[section.id] && (
              <CardContent className="pt-6 pb-8 bg-gradient-to-br from-white to-purple-50/30 animate-fade-in">
                <div className="prose prose-purple max-w-none">
                  {section.content.split('\n\n').map((paragraph, idx) => (
                    <div key={idx} className="mb-4">
                      {paragraph.startsWith('**') && paragraph.endsWith('**') ? (
                        <h4 className="text-lg font-semibold text-purple-800 mb-2 border-l-4 border-purple-400 pl-3">
                          {paragraph.slice(2, -2)}
                        </h4>
                      ) : paragraph.includes('**') ? (
                        <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ 
                          __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-800">$1</strong>') 
                        }} />
                      ) : (
                        <p className="text-gray-700 leading-relaxed">{paragraph}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="text-center pt-8">
        <Button 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          onClick={() => {
            // Expand all sections for easy reading
            const allExpanded = sections.reduce((acc, section) => {
              acc[section.id] = true;
              return acc;
            }, {} as Record<string, boolean>);
            setExpandedSections(allExpanded);
          }}
        >
          <FileText className="h-5 w-5 mr-2" />
          Expand All Sections
        </Button>
      </div>
    </div>
  );
};

export default WhitepaperSection;

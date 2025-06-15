
import React from 'react';
import { Rocket } from 'lucide-react';
import RoadmapItem from './RoadmapItem';

console.log('RoadmapSection: Component loading started');

const RoadmapSection = () => {
  console.log('RoadmapSection: Component rendering');
  
  const roadmapPhases = [
    {
      phase: "Phase 1",
      title: "Foundation & Launch",
      status: "completed" as const,
      items: [
        "Initial token launch on pump.fun (1B supply)",
        "Core FRENAI platform development",
        "Basic AI chat functionality implementation",
        "Initial website and documentation"
      ]
    },
    {
      phase: "Phase 2", 
      title: "Platform Enhancement",
      status: "active" as const,
      items: [
        "Advanced AI personality system rollout",
        "Enhanced chat memory and context features",
        "Fren Chain (Testnet) release: Launch of dedicated blockchain infrastructure optimized for AI interactions with zero-cost transactions for developers",
        "Community governance framework setup"
      ]
    },
    {
      phase: "Phase 3",
      title: "Ecosystem Expansion", 
      status: "upcoming" as const,
      items: [
        "DAO governance token functionality",
        "NFT marketplace integration",
        "Cross-chain bridge implementation"
      ]
    },
    {
      phase: "Phase 4",
      title: "Mass Adoption",
      status: "upcoming" as const,
      items: [
        "Major exchange listings (CEX/DEX)",
        "AI-powered DeFi protocol launch",
        "Educational platform partnerships"
      ]
    },
    {
      phase: "Phase 5",
      title: "Fairsale is live!",
      status: "new-chapter" as const,
      items: [
        "This new chapter will introduce FREN as the native gas token that will power a globally distributed network designed for seamless, high-performance AI interactions. We will implement community-driven nodes, edge computing capabilities, and zero-downtime architecture, building the foundation for the future of AI-powered decentralized applications."
      ]
    }
  ];

  console.log('RoadmapSection: Roadmap phases configured', roadmapPhases.length);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
          <Rocket className="h-8 w-8 text-amber-500" />
          Project Roadmap
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our strategic vision for building the most advanced AI communication ecosystem in the crypto space
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roadmapPhases.map((phase, index) => {
          console.log('RoadmapSection: Rendering phase', phase.phase);
          return (
            <RoadmapItem key={index} {...phase} />
          );
        })}
      </div>
    </div>
  );
};

console.log('RoadmapSection: Component definition complete');

export default RoadmapSection;

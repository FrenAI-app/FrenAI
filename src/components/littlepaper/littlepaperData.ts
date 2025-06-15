
import { 
  Rocket, 
  Brain, 
  Users, 
  Shield, 
  Zap, 
  Globe,
  Code,
  Heart
} from 'lucide-react';

export const littlepaperSections = [
  {
    id: 'overview',
    title: 'Project Overview',
    icon: Rocket,
    color: 'text-blue-600',
    bgColor: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-200',
    content: `FREN is an innovative AI-powered platform designed to revolutionize human-computer interaction through natural conversation and intelligent assistance.

Key Features:
• Advanced conversational AI with emotional intelligence
• Personalized user experiences and adaptive learning
• Multi-modal interaction capabilities
• Community-driven development approach
• Seamless integration across devices and platforms

Our mission is to create meaningful connections between humans and AI, fostering a collaborative environment where technology enhances human creativity and productivity.`
  },
  {
    id: 'ai-engine',
    title: 'AI Engine',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'from-purple-50 to-purple-100',
    borderColor: 'border-purple-200',
    content: `The FREN AI engine leverages cutting-edge machine learning technologies to deliver intelligent, context-aware responses.

Core Capabilities:
• Natural language processing and understanding
• Sentiment analysis and emotional recognition
• Contextual memory and conversation continuity
• Adaptive learning from user interactions
• Multi-language support and cultural awareness

Technical Architecture:
• Transformer-based language models
• Real-time inference optimization
• Distributed processing for scalability
• Privacy-preserving AI techniques`
  },
  {
    id: 'user-experience',
    title: 'User Experience',
    icon: Heart,
    color: 'text-rose-600',
    bgColor: 'from-rose-50 to-rose-100',
    borderColor: 'border-rose-200',
    content: `FREN prioritizes user-centric design, ensuring intuitive and enjoyable interactions for users of all technical backgrounds.

Design Principles:
• Simplicity and clarity in interface design
• Accessibility for users with diverse needs
• Responsive design across all devices
• Personalization based on user preferences
• Seamless onboarding and learning curve

Features:
• Voice and text interaction modes
• Customizable interface themes
• Personal AI assistant profiles
• Smart notification management
• Cross-platform synchronization`
  },
  {
    id: 'community',
    title: 'Community & Ecosystem',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'from-green-50 to-green-100',
    borderColor: 'border-green-200',
    content: `FREN fosters a vibrant community of users, developers, and contributors working together to advance AI-human collaboration.

Community Features:
• Open-source development model
• Developer APIs and SDKs
• Community plugins and extensions
• User feedback integration
• Collaborative improvement processes

Ecosystem Benefits:
• Shared knowledge base
• Community-driven feature development
• Educational resources and tutorials
• Regular community events and updates
• Transparent development roadmap`
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: Shield,
    color: 'text-amber-600',
    bgColor: 'from-amber-50 to-amber-100',
    borderColor: 'border-amber-200',
    content: `Security and privacy are fundamental to FREN's architecture, ensuring user data protection and trustworthy AI interactions.

Security Measures:
• End-to-end encryption for all communications
• Zero-knowledge architecture principles
• Regular security audits and updates
• GDPR and privacy regulation compliance
• User-controlled data retention policies

Privacy Features:
• Local data processing options
• Granular privacy controls
• Anonymous usage analytics
• Data portability and deletion rights
• Transparent data usage policies`
  },
  {
    id: 'technology',
    title: 'Technology Stack',
    icon: Code,
    color: 'text-indigo-600',
    bgColor: 'from-indigo-50 to-indigo-100',
    borderColor: 'border-indigo-200',
    content: `FREN is built on modern, scalable technologies that ensure performance, reliability, and future-proof development.

Frontend Technologies:
• React with TypeScript for type safety
• Tailwind CSS for responsive design
• Progressive Web App capabilities
• Real-time WebSocket connections
• Modern browser compatibility

Backend Infrastructure:
• Supabase for backend services
• PostgreSQL for data management
• Real-time subscriptions and updates
• Serverless edge functions
• Global CDN distribution`
  },
  {
    id: 'performance',
    title: 'Performance & Scalability',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'from-yellow-50 to-yellow-100',
    borderColor: 'border-yellow-200',
    content: `FREN is engineered for optimal performance and seamless scalability to serve users worldwide.

Performance Features:
• Sub-second response times
• Intelligent caching strategies
• Optimized asset delivery
• Lazy loading and code splitting
• Real-time performance monitoring

Scalability Solutions:
• Microservices architecture
• Auto-scaling infrastructure
• Load balancing and failover
• Geographic distribution
• Efficient resource utilization`
  },
  {
    id: 'future',
    title: 'Future Roadmap',
    icon: Globe,
    color: 'text-teal-600',
    bgColor: 'from-teal-50 to-teal-100',
    borderColor: 'border-teal-200',
    content: `FREN's development roadmap focuses on expanding capabilities and enhancing user experiences through continuous innovation.

Upcoming Features:
• Advanced multimodal AI interactions
• Enhanced personalization algorithms
• Expanded language and cultural support
• Developer marketplace for extensions
• Enterprise solutions and integrations

Long-term Vision:
• Universal AI accessibility
• Seamless human-AI collaboration
• Educational and productivity enhancement
• Global community building
• Ethical AI development leadership`
  }
];

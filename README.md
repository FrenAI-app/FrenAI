# FrenAI
https://frenai.app
hellofrens@frenai.app

Hello frens, FrenAI is a web application that combines conversational AI with emotional intelligence to create personalized AI companions. Built with a robust tech stack and designed for scalability, it demonstrates advanced patterns in real-time communication, user learning, and Web3 integration.

Frontend Framework: 
React 18.3.1 with TypeScript 
Component-based architecture using functional components and hooks
Real-time state management through React Context API
Responsive design with mobile-first approach using Tailwind CSS

Backend Infrastructure: 
Supabase (Backend-as-a-Service)
PostgreSQL database with Row Level Security (RLS) policies
Real-time subscriptions for live chat functionality
Edge Functions for serverless API endpoints
Authentication with multiple providers (Web3, OAuth, email)

AI Integration: 
Multi-model approach for enhanced user experience
Custom sentiment analysis using Hugging Face models
ElevenLabs for high-quality text-to-speech synthesis
Real-time mood detection and emotional response adaptation

Smart Learning System

The application features an advanced AI memory bank that learns from user interactions:


// Example: AI learning data structure
interface AIMemory {
  memory_type: 'personal' | 'preference' | 'fact' | 'relationship';
  memory_key: string;
  memory_value: any;
  importance_score: number;
}

Key Learning Features:
Conversation Pattern Analysis - Adapts communication style based on user preferences
Mood Tracking - Learns emotional patterns and provides personalized responses
Behavioral Insights - Analyzes interaction patterns to improve user experience

Interactive Features

Animated Duck Mascot: 
Physics-based companion with emotional reactions
Real-time mood synchronization with user sentiment
Drag-and-drop interaction with collision detection
Dynamic animations responding to conversation context

Authentication & Security

Multi-Provider Authentication:
Web3 wallets (Privy integration for Ethereum/Solana)
Traditional OAuth (Google)
Email/password authentication

Database Security:
Row Level Security (RLS) policies ensure user data isolation
Encrypted API key storage in Supabase Vault
User-scoped data access with proper authorization

Data Management

Real-time Features:
Live chat with typing indicators
Instant mood detection and response
Real-time user presence and activity tracking

Analytics & Insights:
Conversation analytics with mood distribution
User behavior pattern analysis
Learning effectiveness metrics

Performance Optimizations

Lazy Loading - Components and routes loaded on demand
Optimistic Updates - UI updates before server confirmation
Efficient Bundling - Vite for fast development and production builds
Responsive Caching - Strategic use of React Query for API state management

Wallet Connectivity:

Support for major Web3 wallets
Seamless transaction handling
Blockchain interaction for token operations

Modern Development Practices

Type Safety: Full TypeScript implementation with strict type checking Component 
Library: Shadcn/UI for consistent, accessible design system 
Styling: Tailwind CSS with custom design tokens and animations 
State Management: Context API with custom hooks for clean separation of concerns 
Error Handling: Comprehensive error boundaries and user feedback systems

Thank you frens, YourFren

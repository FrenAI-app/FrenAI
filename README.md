#FrenAI - Your Friendly AI Companion

  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
</div>

Hello frens, FrenAI is a web application that combines conversational AI with emotional intelligence to create personalized AI companions. Built with a robust tech stack and designed for scalability, it demonstrates advanced patterns in real-time communication, user learning, and Web3 integration.

Designed for scalability and performance, it combines a sleek React frontend, a robust Supabase backend, and advanced AI integrations to create a dynamic environment for learning and interaction. Below, we dive into the architecture, features, and development practices that make this project shine. Whether you’re a developer, contributor, or curious learner, we’re excited to share this journey with you!

Frontend Framework: React with TypeScript

The frontend is built using React 18.3.1 with TypeScript, ensuring type safety and maintainable code. We embrace a component-based architecture powered by functional components and React hooks, making the codebase modular and easy to extend.
* State Management: We use the React Context API for real-time state management, providing a lightweight and scalable solution for global state without external dependencies.
* Responsive Design: The UI follows a mobile-first approach using Tailwind CSS, enabling rapid development of responsive layouts that adapt seamlessly across devices. Tailwind’s utility-first classes, combined with custom design tokens, ensure a consistent and visually appealing experience.

Backend Infrastructure: Supabase

The backend leverages Supabase, a powerful Backend-as-a-Service platform, to handle database, authentication, and serverless functions with ease. Supabase’s open-source nature and Firebase-like simplicity make it a perfect fit for our needs.
* Database: A PostgreSQL database with Row Level Security (RLS) policies ensures fine-grained access control, isolating user data for maximum security.
* Real-time Subscriptions: Supabase’s real-time capabilities power features like live chat, enabling instant updates for typing indicators and user presence.
* Edge Functions: Serverless Edge Functions provide lightweight API endpoints for custom logic, ensuring low-latency responses and scalability.
* Authentication: Multi-provider authentication supports Web3 wallets (via Privy for Ethereum/Solana), and traditional email/password login, catering to diverse user preferences.

AI Integration: Multi-Model Approach

AI is at the heart of our platform, enhancing user interactions with intelligent and adaptive features. We integrate multiple AI models to deliver a rich, emotionally intelligent experience.
* Sentiment Analysis: Custom models from Hugging Face analyze user input to detect sentiment, enabling the platform to respond empathetically.
* Text-to-Speech: ElevenLabs provides high-quality, natural-sounding voice synthesis, bringing our animated mascot to life with dynamic narration.
* Real-time Mood Detection: The system tracks user emotions and adapts responses in real time, creating a personalized and supportive interaction flow.

Smart Learning System

Our AI memory bank is the core of the platform’s learning capabilities, enabling it to grow smarter with every interaction. The system stores and processes user data using a structured format:
interface AIMemory {
  memory_type: 'personal' | 'preference' | 'fact' | 'relationship';
  memory_key: string;
  memory_value: any;
  importance_score: number;
}

Key Learning Features

* Conversation Pattern Analysis: The AI adapts its communication style based on user preferences, ensuring a natural and engaging dialogue.
* Mood Tracking: By learning emotional patterns, the system provides tailored responses to support the user’s emotional state.
* Behavioral Insights: Interaction patterns are analyzed to optimize the user experience, making the platform more intuitive over time.

Interactive Features: Animated Duck Mascot
Meet our animated duck mascot, a physics-based companion that brings joy and interactivity to the platform! Powered by dynamic animations, the duck responds to user sentiment and conversation context.
* Emotional Reactions: The duck’s animations sync with real-time mood detection, reflecting the user’s emotional state.
* Drag-and-Drop Interaction: Users can interact with the duck through drag-and-drop mechanics, complete with collision detection for a playful experience.
* Contextual Animations: The duck’s movements and expressions adapt to the conversation, creating a lively and immersive interface.

Authentication & Security

Security is a top priority, and we’ve implemented robust measures to protect user data and ensure a trustworthy experience.
* Multi-Provider Authentication:
    * Web3 Wallets: Integrated via Privy for seamless Ethereum and Solana wallet connectivity.
    * Email/Password: Traditional login with encrypted credentials.
* Database Security:
    * Row Level Security (RLS) ensures users only access their own data.
    * Supabase Vault securely stores encrypted API keys.
    * User-scoped data access enforces strict authorization policies.

Data Management

The platform excels at delivering real-time and data-driven features, ensuring a smooth and engaging user experience.
Real-time Features
* Live Chat: Includes typing indicators and instant message delivery for seamless communication.
* Mood Detection: Real-time analysis of user sentiment with adaptive responses.
* User Presence: Tracks activity and availability for collaborative interactions.
Analytics & Insights
* Conversation Analytics: Visualizes mood distribution and conversation trends.
* Behavioral Patterns: Identifies user habits to enhance personalization.
* Learning Metrics: Measures the effectiveness of the AI’s learning system.

Performance Optimizations

We’ve prioritized performance to ensure a fast and responsive experience, even under heavy usage.
* Lazy Loading: Components and routes are loaded on demand to minimize initial load times.
* Optimistic Updates: The UI updates instantly before server confirmation, creating a snappy feel.
* Efficient Bundling: Vite powers fast development and optimized production builds.
* Responsive Caching: React Query manages API state efficiently, reducing unnecessary requests.

Wallet Connectivity

The platform supports Web3 wallet integration for blockchain-based features, enabling seamless interaction with decentralized ecosystems.
* Major Wallet Support: Connect with popular Web3 wallets for secure authentication.
* Transaction Handling: Streamlined processes for blockchain transactions.
* Token Operations: Interact with tokens for in-app functionality.

Modern Development Practices

We’ve adopted industry-standard practices to ensure a high-quality, maintainable codebase.
* Type Safety: Full TypeScript implementation with strict type checking eliminates runtime errors.
* Component Library: Shadcn/UI provides a consistent, accessible design system for reusable components.
* Styling: Tailwind CSS with custom design tokens and animations ensures a cohesive look and feel.
* State Management: Context API with custom hooks separates concerns for clean architecture.
* Error Handling: Comprehensive error boundaries and user-friendly feedback systems enhance reliability.

Development Guidelines

* Use TypeScript for all new code
* Follow React best practices and hooks patterns
* Maintain responsive design principles
* Write meaningful commit messages
* Update documentation for new features

Acknowledgments

A huge thank you to Milarepa, Your feedback, ideas, and support have shaped this project into something truly special. 

App: https://frenai.app

Contact: hellofrens@frenai.app

Thank you,

YourFren

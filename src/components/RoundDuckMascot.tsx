import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUser } from '@/context/UserContext';
import { Smile } from 'lucide-react';
import { usePrivyAuth } from '@/context/PrivyContext';
import { useChat } from '@/context/ChatContext';

type Position = {
  x: number;
  y: number;
};

// Define the expanded set of possible mascot emotions/states
type DuckEmotion = 
  // Basic emotions
  'happy' | 'sad' | 'angry' | 'surprised' | 'laughing' | 'cool' | 'love' | 'sleeping' |
  // Additional emotions
  'excited' | 'confused' | 'worried' | 'scared' | 'proud' | 'tired' | 'bored' | 
  'jealous' | 'hopeful' | 'grateful' | 'curious' | 'determined' | 'shy' | 
  'disappointed' | 'calm' | 'enthusiastic' | 'nostalgic' | 'anxious' |
  'relieved' | 'embarrassed' | 'uncomfortable' | 'amused' | 'content';

// Message priority system
type MessagePriority = 'urgent' | 'high' | 'normal' | 'low';

type QueuedMessage = {
  id: string;
  text: string;
  priority: MessagePriority;
  emotion?: DuckEmotion;
  duration?: number;
  timestamp: number;
};

// Collection of duck jokes
const duckJokes = [
  "Why don't ducks tell jokes when they fly? Because they would quack up!",
  "What do you call a duck that steals? A robber ducky!",
  "How do ducks communicate? They use QuackChat!",
  "Why did the duck cross the road? To prove he wasn't chicken!",
  "What do you call a duck that's good at basketball? Nothing, just call him a slam-duck!",
  "Why was the duck arrested? For selling quack!",
  "How does a duck pay its bills? With a bill, of course!",
  "What's a duck's favorite ballet? The Nutquacker!",
  "Why don't ducks ever grow up? Because they're always down!",
  "What do you call a duck that's a detective? Sherlock Quacks!",
  "What do you get when you cross a duck with a firework? A firequacker!",
  "Why did the cxFREN token like the duck? Because it had all its bills in a row!",
  "What kind of TV shows do ducks watch? Duckumentaries!",
  "How do ducks type? With their quackers keyboard!",
  "Why are ducks good investors? They always have their bills in order!"
];

// Enhanced emotional responses with better sentiment mapping
const emotionalResponses = {
  'happy': {
    emotions: ['happy', 'excited', 'laughing'],
    messages: [
      "Your joy is contagious! Quack quack! 🦆",
      "I love seeing you happy! Let's celebrate together!",
      "Your happiness makes my feathers flutter with joy!"
    ]
  },
  'sad': {
    emotions: ['sad', 'worried', 'disappointed'],
    messages: [
      "I'm here for you, friend. Sending virtual duck hugs! 🤗",
      "It's okay to feel sad sometimes. I'll stay right here with you.",
      "Remember, after every storm comes a rainbow. Quack softly."
    ]
  },
  'angry': {
    emotions: ['surprised', 'worried', 'calm'],
    messages: [
      "Take a deep breath with me... in and out... quack peacefully.",
      "Let's find our calm together. I'm here to listen.",
      "Sometimes we need to ruffle our feathers, but we'll smooth them out together."
    ]
  },
  'anxious': {
    emotions: ['worried', 'calm', 'hopeful'],
    messages: [
      "Feeling anxious? Let's take it one quack at a time.",
      "I sense your worry. Remember, you're not alone in this pond.",
      "Breathe with me... everything will be okay. Quack gently."
    ]
  },
  'excited': {
    emotions: ['excited', 'happy', 'enthusiastic'],
    messages: [
      "Your excitement is making me do happy duck dances! 🕺",
      "I'm bouncing with you! What's got you so excited?",
      "QUACK QUACK! Your energy is absolutely contagious!"
    ]
  },
  'neutral': {
    emotions: ['content', 'curious', 'calm'],
    messages: [
      "Just paddling along peacefully with you, friend.",
      "I'm here whenever you need a chat, quack!",
      "Enjoying this calm moment together. 🦆"
    ]
  }
};

// Enhanced emotional mapping with corresponding emojis
const emotionEmojiMap: Record<DuckEmotion, {
  emoji: string;
  animation: string;
  color: string;
  position: 'top' | 'side' | 'floating';
}> = {
  happy: { emoji: '😊', animation: 'bounce', color: '#FFD700', position: 'top' },
  sad: { emoji: '😢', animation: 'drip', color: '#87CEEB', position: 'side' },
  angry: { emoji: '😠', animation: 'shake', color: '#FF6B6B', position: 'top' },
  surprised: { emoji: '😲', animation: 'pop', color: '#FFA500', position: 'floating' },
  laughing: { emoji: '😂', animation: 'wiggle', color: '#FFD700', position: 'floating' },
  cool: { emoji: '😎', animation: 'slide', color: '#4A90E2', position: 'top' },
  love: { emoji: '😍', animation: 'pulse', color: '#FF69B4', position: 'floating' },
  sleeping: { emoji: '😴', animation: 'float', color: '#B0C4DE', position: 'side' },
  excited: { emoji: '🤩', animation: 'bounce', color: '#FF1493', position: 'floating' },
  confused: { emoji: '😕', animation: 'tilt', color: '#DDA0DD', position: 'top' },
  worried: { emoji: '😟', animation: 'sway', color: '#F0E68C', position: 'side' },
  scared: { emoji: '😨', animation: 'tremble', color: '#E6E6FA', position: 'floating' },
  proud: { emoji: '😤', animation: 'puff', color: '#FFD700', position: 'top' },
  tired: { emoji: '😪', animation: 'droop', color: '#D3D3D3', position: 'side' },
  bored: { emoji: '😑', animation: 'slow', color: '#C0C0C0', position: 'top' },
  jealous: { emoji: '😒', animation: 'shift', color: '#9ACD32', position: 'side' },
  hopeful: { emoji: '🤗', animation: 'glow', color: '#FFE4B5', position: 'floating' },
  grateful: { emoji: '🥰', animation: 'warm', color: '#FFC0CB', position: 'floating' },
  curious: { emoji: '🤔', animation: 'think', color: '#87CEFA', position: 'top' },
  determined: { emoji: '😤', animation: 'firm', color: '#FF4500', position: 'top' },
  shy: { emoji: '😳', animation: 'hide', color: '#FFB6C1', position: 'side' },
  disappointed: { emoji: '😞', animation: 'slump', color: '#D2B48C', position: 'side' },
  calm: { emoji: '😌', animation: 'breathe', color: '#E0FFFF', position: 'floating' },
  enthusiastic: { emoji: '🤗', animation: 'burst', color: '#FF69B4', position: 'floating' },
  nostalgic: { emoji: '🥺', animation: 'reminisce', color: '#DDA0DD', position: 'side' },
  anxious: { emoji: '😰', animation: 'fidget', color: '#F5DEB3', position: 'floating' },
  relieved: { emoji: '😅', animation: 'exhale', color: '#98FB98', position: 'top' },
  embarrassed: { emoji: '😅', animation: 'blush', color: '#FFB6C1', position: 'side' },
  uncomfortable: { emoji: '😬', animation: 'squirm', color: '#F0E68C', position: 'side' },
  amused: { emoji: '😏', animation: 'smirk', color: '#DDA0DD', position: 'top' },
  content: { emoji: '😊', animation: 'serene', color: '#F0F8FF', position: 'floating' }
};

// Animation variants for different emoji movements
const emojiVariants = {
  bounce: {
    initial: { y: 0, scale: 0 },
    animate: { 
      y: [-5, 0, -3, 0], 
      scale: [0, 1.2, 1],
      transition: { duration: 0.8, ease: "easeOut" }
    },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.3 } }
  },
  drip: {
    initial: { y: -10, opacity: 0 },
    animate: { 
      y: [0, 15, 10], 
      opacity: [0, 1, 0.8],
      transition: { duration: 1.5, ease: "easeInOut" }
    },
    exit: { y: 20, opacity: 0, transition: { duration: 0.4 } }
  },
  shake: {
    initial: { x: 0, scale: 0 },
    animate: { 
      x: [-2, 2, -2, 2, 0], 
      scale: [0, 1.1, 1],
      transition: { duration: 0.6, ease: "easeOut" }
    },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.3 } }
  },
  pop: {
    initial: { scale: 0, rotate: 0 },
    animate: { 
      scale: [0, 1.3, 1], 
      rotate: [0, 10, -5, 0],
      transition: { duration: 0.7, ease: "easeOut" }
    },
    exit: { scale: 0, rotate: 180, transition: { duration: 0.4 } }
  },
  wiggle: {
    initial: { rotate: 0, scale: 0 },
    animate: { 
      rotate: [-5, 5, -3, 3, 0], 
      scale: [0, 1.2, 1],
      transition: { duration: 1, ease: "easeInOut" }
    },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.3 } }
  },
  slide: {
    initial: { x: -20, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    },
    exit: { x: 20, opacity: 0, transition: { duration: 0.4 } }
  },
  pulse: {
    initial: { scale: 0 },
    animate: { 
      scale: [0, 1.1, 0.9, 1.1, 1],
      transition: { duration: 1.2, ease: "easeInOut" }
    },
    exit: { scale: 0, transition: { duration: 0.3 } }
  },
  float: {
    initial: { y: 0, opacity: 0 },
    animate: { 
      y: [-3, 3, -2, 2, 0], 
      opacity: [0, 1, 1, 1, 0.8],
      transition: { duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
    },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  },
  tilt: {
    initial: { rotate: 0, scale: 0 },
    animate: { 
      rotate: [-15, 15, -10, 0], 
      scale: [0, 1.1, 1],
      transition: { duration: 0.9, ease: "easeOut" }
    },
    exit: { scale: 0, rotate: 0, transition: { duration: 0.3 } }
  },
  sway: {
    initial: { x: 0, scale: 0 },
    animate: { 
      x: [-3, 3, -2, 2, 0], 
      scale: [0, 1, 1],
      transition: { duration: 1.5, ease: "easeInOut" }
    },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.3 } }
  },
  tremble: {
    initial: { scale: 0 },
    animate: { 
      scale: [0, 1.2, 1],
      x: [-1, 1, -1, 1, 0],
      y: [-1, 1, -1, 1, 0],
      transition: { duration: 0.8, ease: "easeOut" }
    },
    exit: { scale: 0, transition: { duration: 0.3 } }
  },
  puff: {
    initial: { scale: 0 },
    animate: { 
      scale: [0, 1.4, 1.1, 1],
      transition: { duration: 0.6, ease: "easeOut" }
    },
    exit: { scale: 1.2, opacity: 0, transition: { duration: 0.4 } }
  },
  droop: {
    initial: { y: 0, scale: 0 },
    animate: { 
      y: [0, 5, 3], 
      scale: [0, 1, 1],
      transition: { duration: 1.2, ease: "easeOut" }
    },
    exit: { y: 10, scale: 0, transition: { duration: 0.5 } }
  },
  slow: {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: [0, 1], 
      opacity: [0, 0.8],
      transition: { duration: 2, ease: "easeOut" }
    },
    exit: { scale: 0, opacity: 0, transition: { duration: 1 } }
  },
  glow: {
    initial: { scale: 0 },
    animate: { 
      scale: [0, 1.1, 1],
      filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
      transition: { duration: 1, ease: "easeOut" }
    },
    exit: { scale: 0, transition: { duration: 0.3 } }
  },
  warm: {
    initial: { scale: 0 },
    animate: { 
      scale: [0, 1.2, 1],
      filter: ["hue-rotate(0deg)", "hue-rotate(20deg)", "hue-rotate(0deg)"],
      transition: { duration: 1.2, ease: "easeOut" }
    },
    exit: { scale: 0, transition: { duration: 0.3 } }
  },
  think: {
    initial: { scale: 0, rotate: 0 },
    animate: { 
      scale: [0, 1.1, 1],
      rotate: [-5, 5, -3, 0],
      transition: { duration: 1, ease: "easeOut" }
    },
    exit: { scale: 0, transition: { duration: 0.3 } }
  },
  firm: {
    initial: { scale: 0 },
    animate: { 
      scale: [0, 1.3, 1.1, 1],
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { scale: 1.1, opacity: 0, transition: { duration: 0.3 } }
  },
  hide: {
    initial: { scale: 0, x: 0 },
    animate: { 
      scale: [0, 1, 0.9], 
      x: [0, -5, -3],
      transition: { duration: 0.8, ease: "easeOut" }
    },
    exit: { scale: 0, x: -10, transition: { duration: 0.4 } }
  },
  slump: {
    initial: { y: 0, scale: 0 },
    animate: { 
      y: [0, 8, 5], 
      scale: [0, 1, 1],
      transition: { duration: 1, ease: "easeOut" }
    },
    exit: { y: 10, scale: 0, transition: { duration: 0.5 } }
  },
  breathe: {
    initial: { scale: 0 },
    animate: { 
      scale: [0, 1.05, 0.95, 1.05, 1],
      transition: { duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
    },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.5 } }
  },
  burst: {
    initial: { scale: 0, rotate: 0 },
    animate: { 
      scale: [0, 1.4, 1.1, 1],
      rotate: [0, 360],
      transition: { duration: 0.8, ease: "easeOut" }
    },
    exit: { scale: 0, transition: { duration: 0.3 } }
  },
  reminisce: {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: [0, 0.7, 1], 
      scale: [0, 1, 1],
      filter: ["sepia(0)", "sepia(0.3)", "sepia(0.1)"],
      transition: { duration: 1.5, ease: "easeOut" }
    },
    exit: { opacity: 0, scale: 0, transition: { duration: 0.6 } }
  },
  fidget: {
    initial: { scale: 0 },
    animate: { 
      scale: [0, 1.1, 1],
      x: [-1, 1, -0.5, 0.5, 0],
      transition: { duration: 0.7, ease: "easeOut" }
    },
    exit: { scale: 0, transition: { duration: 0.3 } }
  },
  exhale: {
    initial: { scale: 0 },
    animate: { 
      scale: [0, 1.2, 0.9, 1],
      transition: { duration: 1, ease: "easeOut" }
    },
    exit: { scale: 1.1, opacity: 0, transition: { duration: 0.4 } }
  },
  blush: {
    initial: { scale: 0 },
    animate: { 
      scale: [0, 1.1, 1],
      filter: ["hue-rotate(0deg)", "hue-rotate(30deg)", "hue-rotate(10deg)"],
      transition: { duration: 0.8, ease: "easeOut" }
    },
    exit: { scale: 0, transition: { duration: 0.3 } }
  },
  squirm: {
    initial: { scale: 0 },
    animate: { 
      scale: [0, 1, 1],
      x: [-2, 2, -1, 1, 0],
      y: [-1, 1, -0.5, 0],
      transition: { duration: 1, ease: "easeOut" }
    },
    exit: { scale: 0, transition: { duration: 0.3 } }
  },
  smirk: {
    initial: { scale: 0, rotate: 0 },
    animate: { 
      scale: [0, 1.1, 1],
      rotate: [0, 5, 0],
      transition: { duration: 0.6, ease: "easeOut" }
    },
    exit: { scale: 0, transition: { duration: 0.3 } }
  },
  serene: {
    initial: { scale: 0 },
    animate: { 
      scale: [0, 1.05, 1],
      filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
      transition: { duration: 1.5, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }
    },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.8 } }
  }
};

// Map emotion to animation style and effect
const emotionAnimationMap: Record<DuckEmotion, {
  animation: string,
  overlay?: string,
  effects?: string[],
  message?: string
}> = {
  happy: {
    animation: 'animate-pulse-gentle',
    effects: ['smile'],
    message: 'Quack! I feel great today!'
  },
  sad: {
    animation: 'animate-pulse-slow',
    overlay: 'tear-overlay',
    effects: ['frown', 'raindrop'],
    message: 'Quack... feeling a bit down...'
  },
  angry: {
    animation: 'animate-pulse-red',
    overlay: 'angry-overlay',
    effects: ['steam', 'redFace'],
    message: 'QUACK! That made me mad!'
  },
  surprised: {
    animation: 'animate-jump',
    overlay: 'surprised-overlay',
    effects: ['widened-eyes', 'exclamation'],
    message: 'QUACK?! What was that?!'
  },
  laughing: {
    animation: 'animate-shake-gentle',
    overlay: 'laughing-overlay',
    effects: ['tears-of-joy', 'haha-bubbles'],
    message: 'Quack quack quack! That\'s hilarious!'
  },
  cool: {
    animation: 'animate-float',
    overlay: 'cool-overlay',
    effects: ['sunglasses', 'sparkle'],
    message: 'Stayin\' cool, fren.'
  },
  love: {
    animation: 'animate-pulse-pink',
    overlay: 'love-overlay',
    effects: ['heart-eyes', 'floating-hearts'],
    message: 'Quack! I adore you, frens!'
  },
  sleeping: {
    animation: 'animate-pulse-slow',
    overlay: 'sleeping-overlay',
    effects: ['zzz', 'snore-bubble'],
    message: 'Zzzz... quack... zzzz...'
  },
  excited: {
    animation: 'animate-jump animate-shake-gentle',
    overlay: 'excited-overlay',
    effects: ['sparkles', 'movement-lines'],
    message: 'Oh boy oh boy oh boy! QUACK!'
  },
  confused: {
    animation: 'animate-float',
    overlay: 'confused-overlay',
    effects: ['question-marks', 'tilted-head'],
    message: 'Quack? I don\'t understand...'
  },
  worried: {
    animation: 'animate-pulse-slow',
    overlay: 'worried-overlay',
    effects: ['sweat-drop', 'furrowed-brow'],
    message: 'Oh no, I\'m concerned about this...'
  },
  scared: {
    animation: 'animate-shake-gentle',
    overlay: 'scared-overlay',
    effects: ['wide-eyes', 'blue-face'],
    message: 'QUACK! That\'s scary!'
  },
  proud: {
    animation: 'animate-float',
    overlay: 'proud-overlay',
    effects: ['chest-puffed', 'sparkles'],
    message: 'Look at what we accomplished! Quack!'
  },
  tired: {
    animation: 'animate-pulse-slow',
    overlay: 'tired-overlay',
    effects: ['droopy-eyes', 'yawn'],
    message: 'So sleepy... need to rest... quack...'
  },
  bored: {
    animation: 'animate-pulse-slow',
    overlay: 'bored-overlay',
    effects: ['rolling-eyes', 'tapping-foot'],
    message: 'Quack. Nothing interesting happening...'
  },
  jealous: {
    animation: 'animate-pulse',
    overlay: 'jealous-overlay',
    effects: ['green-tint', 'narrowed-eyes'],
    message: 'I wish I had that too... quack.'
  },
  hopeful: {
    animation: 'animate-float',
    overlay: 'hopeful-overlay',
    effects: ['sparkle-eyes', 'light-rays'],
    message: 'I believe good things are coming! Quack!'
  },
  grateful: {
    animation: 'animate-pulse-gentle',
    overlay: 'grateful-overlay',
    effects: ['hands-together', 'warm-glow'],
    message: 'Thank you so much! I appreciate it!'
  },
  curious: {
    animation: 'animate-float',
    overlay: 'curious-overlay',
    effects: ['magnifying-glass', 'tilted-head'],
    message: 'Quack? What\'s this? How does it work?'
  },
  determined: {
    animation: 'animate-pulse',
    overlay: 'determined-overlay',
    effects: ['furrowed-brow', 'fist'],
    message: 'I\'m going to do this! Quack!'
  },
  shy: {
    animation: 'animate-pulse-slow',
    overlay: 'shy-overlay',
    effects: ['blush', 'looking-away'],
    message: 'Oh... um... quack... hello...'
  },
  disappointed: {
    animation: 'animate-pulse-slow',
    overlay: 'disappointed-overlay',
    effects: ['downcast-eyes', 'sigh'],
    message: 'Aww... that\'s too bad... quack.'
  },
  calm: {
    animation: 'animate-float',
    overlay: 'calm-overlay',
    effects: ['closed-eyes', 'zen-circle'],
    message: 'Peaceful quacks... just breathe...'
  },
  enthusiastic: {
    animation: 'animate-jump',
    overlay: 'enthusiastic-overlay',
    effects: ['stars', 'raised-hands'],
    message: 'This is SO AMAZING! QUACK!'
  },
  nostalgic: {
    animation: 'animate-pulse-slow',
    overlay: 'nostalgic-overlay',
    effects: ['sepia-filter', 'thought-bubble'],
    message: 'Remember when we... quack... good times.'
  },
  anxious: {
    animation: 'animate-shake-gentle',
    overlay: 'anxious-overlay',
    effects: ['sweat-drops', 'nervous-movement'],
    message: 'Oh dear oh dear oh dear... quack...'
  },
  relieved: {
    animation: 'animate-pulse-gentle',
    overlay: 'relieved-overlay',
    effects: ['wiping-forehead', 'relaxed-posture'],
    message: 'Phew! What a relief! Quack!'
  },
  embarrassed: {
    animation: 'animate-pulse',
    overlay: 'embarrassed-overlay',
    effects: ['red-cheeks', 'hiding-face'],
    message: 'Oh no... that was awkward... quack...'
  },
  uncomfortable: {
    animation: 'animate-shake-gentle',
    overlay: 'uncomfortable-overlay',
    effects: ['shifting-eyes', 'tugging-collar'],
    message: 'Uh... this is awkward... quack?'
  },
  amused: {
    animation: 'animate-pulse-gentle',
    overlay: 'amused-overlay',
    effects: ['slight-smile', 'raised-eyebrow'],
    message: 'Heh, that\'s pretty funny! Quack!'
  },
  content: {
    animation: 'animate-pulse-gentle',
    overlay: 'content-overlay',
    effects: ['relaxed-smile', 'warm-glow'],
    message: 'Ahhh, this is nice. Quack contentedly.'
  }
};

const RoundDuckMascot: React.FC = () => {
  const isMobile = useIsMobile();
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [targetPosition, setTargetPosition] = useState<Position | null>(null);
  const [emotion, setEmotion] = useState<DuckEmotion>('happy');
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isVisible, setIsVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const frameRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLElement | null>(null);
  const emotionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = usePrivyAuth();
  const { profile } = useUser();
  const [jokeMode, setJokeMode] = useState(false);
  const [userMood, setUserMood] = useState<string>('neutral');
  const [isJumping, setIsJumping] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<DOMRect | null>(null);
  const [showBeam, setShowBeam] = useState(false);
  const { lastDetectedMood, personalitySettings, messages } = useChat();
  
  // FIXED: Message queue system with better state management
  const [messageQueue, setMessageQueue] = useState<QueuedMessage[]>([]);
  const [isProcessingMessage, setIsProcessingMessage] = useState(false);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageTime = useRef<number>(0);
  const processedMessagesRef = useRef<Set<string>>(new Set());
  const hasShownWelcome = useRef<boolean>(false);
  
  // FIXED: Increased debouncing and intervals
  const MIN_MESSAGE_INTERVAL = 3000; // Increased from 1s to 3s
  const MESSAGE_DEBOUNCE_TIME = 1000; // Increased from 500ms to 1s
  
  // FIXED: Behavior timing with much longer intervals
  const lastBehaviorTime = useRef<{
    joke: number;
    emotion: number;
    wave: number;
    wander: number;
  }>({
    joke: 0,
    emotion: 0,
    wave: 0,
    wander: 0
  });

  // FIXED: Enhanced message queue processing with better deduplication
  const processMessageQueue = () => {
    if (isProcessingMessage || messageQueue.length === 0) return;
    
    const now = Date.now();
    if (now - lastMessageTime.current < MIN_MESSAGE_INTERVAL) {
      setTimeout(() => processMessageQueue(), MIN_MESSAGE_INTERVAL - (now - lastMessageTime.current));
      return;
    }
    
    // Sort by priority and timestamp
    const sortedQueue = [...messageQueue].sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.timestamp - b.timestamp;
    });
    
    const nextMessage = sortedQueue[0];
    if (!nextMessage || processedMessagesRef.current.has(nextMessage.id)) {
      // Remove processed message and try next
      setMessageQueue(prev => prev.filter(msg => msg.id !== nextMessage?.id));
      return;
    }
    
    // Mark as processed to prevent loops
    processedMessagesRef.current.add(nextMessage.id);
    
    // Remove the message from queue
    setMessageQueue(prev => prev.filter(msg => msg.id !== nextMessage.id));
    
    // Display the message
    setIsProcessingMessage(true);
    setMessage(nextMessage.text);
    setShowMessage(true);
    lastMessageTime.current = now;
    
    // Set emotion if specified
    if (nextMessage.emotion) {
      setEmotion(nextMessage.emotion);
    }
    
    // Clear any existing timeout
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = null;
    }
    
    // Set timeout to hide message and process next
    const duration = nextMessage.duration || 5000; // Increased default duration
    messageTimeoutRef.current = setTimeout(() => {
      setShowMessage(false);
      setIsProcessingMessage(false);
      
      // Process next message after a longer delay
      setTimeout(() => processMessageQueue(), MESSAGE_DEBOUNCE_TIME);
    }, duration);
  };
  
  // FIXED: Enhanced message queuing function with deduplication
  const queueMessage = (
    text: string, 
    priority: MessagePriority = 'normal', 
    emotion?: DuckEmotion,
    duration?: number
  ) => {
    const now = Date.now();
    
    // Prevent duplicate messages within a longer time window
    const isDuplicate = messageQueue.some(msg => 
      msg.text === text && (now - msg.timestamp) < 10000 // Increased from 2s to 10s
    );
    
    if (isDuplicate) {
      console.log('Duck: Duplicate message prevented:', text);
      return;
    }
    
    // For urgent messages, clear current message and queue but be more conservative
    if (priority === 'urgent') {
      setMessageQueue(prev => prev.filter(msg => msg.priority !== 'low'));
      if (messageTimeoutRef.current && !isProcessingMessage) {
        clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = null;
        setIsProcessingMessage(false);
      }
    }
    
    const newMessage: QueuedMessage = {
      id: `${now}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      priority,
      emotion,
      duration: duration || 5000, // Increased default duration
      timestamp: now
    };
    
    console.log('Duck: Queuing message:', text, 'Priority:', priority);
    setMessageQueue(prev => [...prev, newMessage]);
  };
  
  // Process message queue
  useEffect(() => {
    const timer = setTimeout(() => processMessageQueue(), 100);
    return () => clearTimeout(timer);
  }, [messageQueue, isProcessingMessage]);

  // Enhanced emotional intelligence - monitor chat context and sentiment
  useEffect(() => {
    if (personalitySettings?.emotionalAwareness && messages.length > 0) {
      const userMessages = messages.filter(msg => msg.sender === 'user');
      if (userMessages.length > 0) {
        const latestMessage = userMessages[userMessages.length - 1];
        
        if (latestMessage.mood && latestMessage.mood !== userMood) {
          console.log(`Duck: Emotional intelligence detected mood change: ${userMood} -> ${latestMessage.mood}`);
          reactToSentiment(latestMessage.mood, latestMessage.sentimentScore || 0);
          setUserMood(latestMessage.mood);
        }
      }
    }
  }, [messages, personalitySettings, userMood]);

  // FIXED: Enhanced function to react to detected sentiment with better coordination
  const reactToSentiment = (detectedMood: string, sentimentScore: number = 0) => {
    if (!isVisible || !personalitySettings?.emotionalAwareness) return;
    
    // Clear any pending emotion changes
    if (emotionTimeoutRef.current) {
      clearTimeout(emotionTimeoutRef.current);
      emotionTimeoutRef.current = null;
    }
    
    // Get appropriate emotional response based on detected sentiment
    const response = emotionalResponses[detectedMood] || emotionalResponses['neutral'];
    
    // Select random emotion and message from the response set
    const randomEmotion = response.emotions[Math.floor(Math.random() * response.emotions.length)] as DuckEmotion;
    const randomMessage = response.messages[Math.floor(Math.random() * response.messages.length)];
    
    // Queue the emotional reaction with high priority
    queueMessage(randomMessage, 'high', randomEmotion, 6000);
    
    // Add physical reactions based on sentiment intensity
    if (Math.abs(sentimentScore) > 0.7) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 2000);
    }
    
    if (detectedMood === 'happy' || detectedMood === 'excited') {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 3000);
    }
    
    // Contextual follow-up emotions - with much longer coordination
    emotionTimeoutRef.current = setTimeout(() => {
      const followUpEmotions: DuckEmotion[] = ['hopeful', 'grateful', 'content', 'curious'];
      const followUpEmotion = followUpEmotions[Math.floor(Math.random() * followUpEmotions.length)];
      setEmotion(followUpEmotion);
      
      // Rarely offer encouragement with lower priority
      if (Math.random() > 0.8) { // Reduced from 0.6 to 0.8
        const encouragements = [
          "I'm always here to chat if you need me!",
          "You're doing great, friend!",
          "Thanks for sharing with me. Quack!",
          "I love our conversations together!"
        ];
        const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        queueMessage(randomEncouragement, 'low', followUpEmotion);
      }
    }, 15000); // Much longer delay from 6s to 15s
  };
  
  // Get chat container element reference
  useEffect(() => {
    chatContainerRef.current = document.querySelector('.chat-container');
    setIsVisible(false);
  }, []);

  // Listen for custom toggle event from ChatInterface
  useEffect(() => {
    const handleToggle = (event: Event) => {
      console.log("Duck: Toggle event received");
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setIsVisible(customEvent.detail.show);
        
        if (customEvent.detail.buttonPosition) {
          setButtonPosition(customEvent.detail.buttonPosition);
          
          if (customEvent.detail.show && chatContainerRef.current) {
            const chatRect = chatContainerRef.current.getBoundingClientRect();
            
            const centerX = isMobile ? 
              Math.min(chatRect.width / 2 - 30, chatRect.width - 80) : 
              chatRect.width / 2 - 30;
            
            const centerY = isMobile ? 
              Math.min(chatRect.height / 2 - 30, chatRect.height - 150) : 
              chatRect.height / 2 - 30;
            
            setPosition({
              x: Math.max(50, centerX),
              y: Math.max(60, centerY)
            });
          }
        }
        
        // FIXED: Only show welcome message once and prevent loops
        if (customEvent.detail.show && !hasShownWelcome.current) {
          hasShownWelcome.current = true;
          queueMessage("Quack! I'm your emotionally intelligent FREN duck!", 'urgent', 'happy', 4000);
        }
      }
    };

    document.addEventListener('toggleDuckMascot', handleToggle);
    
    return () => {
      document.removeEventListener('toggleDuckMascot', handleToggle);
    };
  }, [isMobile]);

  // Listen for mood change events and context changes
  useEffect(() => {
    const handleMoodChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.mood) {
        setUserMood(customEvent.detail.mood);
        
        if (isVisible && personalitySettings?.emotionalAwareness) {
          reactToSentiment(customEvent.detail.mood, customEvent.detail.score || 0);
        }
      }
    };
    
    document.addEventListener('userMoodChanged', handleMoodChange);
    
    if (lastDetectedMood && lastDetectedMood !== userMood && isVisible && personalitySettings?.emotionalAwareness) {
      console.log(`Duck: Mood change from context: ${userMood} -> ${lastDetectedMood}`);
      setUserMood(lastDetectedMood);
      reactToSentiment(lastDetectedMood);
    }
    
    return () => {
      document.removeEventListener('userMoodChanged', handleMoodChange);
    };
  }, [isVisible, lastDetectedMood, userMood, personalitySettings]);

  // FIXED: Much more conservative automatic emotion changes
  const [showEmoji, setShowEmoji] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState<string>('😊');
  const [emojiAnimation, setEmojiAnimation] = useState<string>('bounce');
  const [emojiColor, setEmojiColor] = useState<string>('#FFD700');
  const [emojiPosition, setEmojiPosition] = useState<'top' | 'side' | 'floating'>('top');
  const emojiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const emotions: DuckEmotion[] = Object.keys(emotionAnimationMap) as DuckEmotion[];
    
    const changeEmotion = () => {
      if (!isProcessingMessage && 
          !showMessage && 
          Date.now() - lastBehaviorTime.current.emotion > 30000) {
        
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        showEmotionWithEmoji(randomEmotion);
        lastBehaviorTime.current.emotion = Date.now();
        
        if (Math.random() > 0.9 && emotionAnimationMap[randomEmotion].message) {
          queueMessage(emotionAnimationMap[randomEmotion].message || '', 'low', randomEmotion);
        }
      }

      const timeout = Math.floor(Math.random() * 30000) + 45000;
      emotionTimeoutRef.current = setTimeout(changeEmotion, timeout);
    };

    if (isVisible && !emotionTimeoutRef.current) {
      emotionTimeoutRef.current = setTimeout(changeEmotion, 20000);
    }
    
    return () => {
      if (emotionTimeoutRef.current) {
        clearTimeout(emotionTimeoutRef.current);
        emotionTimeoutRef.current = null;
      }
      if (emojiTimeoutRef.current) {
        clearTimeout(emojiTimeoutRef.current);
        emojiTimeoutRef.current = null;
      }
    };
  }, [isVisible, isProcessingMessage, showMessage]);

  // FIXED: Enhanced emotion display with emojis
  const showEmotionWithEmoji = (specificEmotion: DuckEmotion) => {
    setEmotion(specificEmotion);
    
    const emojiData = emotionEmojiMap[specificEmotion];
    if (emojiData) {
      setCurrentEmoji(emojiData.emoji);
      setEmojiAnimation(emojiData.animation);
      setEmojiColor(emojiData.color);
      setEmojiPosition(emojiData.position);
      setShowEmoji(true);
      
      // Clear any existing emoji timeout
      if (emojiTimeoutRef.current) {
        clearTimeout(emojiTimeoutRef.current);
      }
      
      // Hide emoji after animation duration (varies by emotion)
      const duration = specificEmotion === 'sleeping' || specificEmotion === 'calm' ? 4000 : 2500;
      emojiTimeoutRef.current = setTimeout(() => {
        setShowEmoji(false);
      }, duration);
    }
    
    if (emotionAnimationMap[specificEmotion].message) {
      queueMessage(emotionAnimationMap[specificEmotion].message || '', 'normal', specificEmotion);
    }
  };

  // Get emoji position styles
  const getEmojiPositionStyles = () => {
    const baseSize = isMobile ? 24 : 28;
    
    switch (emojiPosition) {
      case 'top':
        return {
          top: isMobile ? '-35px' : '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: `${baseSize}px`
        };
      case 'side':
        return {
          top: '50%',
          right: isMobile ? '-35px' : '-40px',
          transform: 'translateY(-50%)',
          fontSize: `${baseSize}px`
        };
      case 'floating':
        return {
          top: isMobile ? '-25px' : '-30px',
          right: isMobile ? '-15px' : '-20px',
          fontSize: `${baseSize + 4}px`
        };
      default:
        return {
          top: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: `${baseSize}px`
        };
    }
  };

  // FIXED: Much more conservative wandering and behavior intervals
  useEffect(() => {
    const wanderInterval = setInterval(() => {
      const now = Date.now();
      
      if (!targetPosition && 
          !isProcessingMessage && 
          !showMessage &&
          Math.random() > 0.85 && // Reduced from 0.7 to 0.85
          chatContainerRef.current && 
          isVisible &&
          now - lastBehaviorTime.current.wander > 15000) { // Increased from 5s to 15s
        
        const chatRect = chatContainerRef.current.getBoundingClientRect();
        
        const maxX = chatRect.width - (isMobile ? 80 : 60);
        const maxY = isMobile ? 
          Math.min(chatRect.height - 150, chatRect.height * 0.7) : 
          chatRect.height - 60;
        
        const minX = isMobile ? 50 : 30;
        const minY = isMobile ? 60 : 30;
        
        const newX = Math.max(minX, Math.min(maxX, position.x + (Math.random() * 120 - 60)));
        const newY = Math.max(minY, Math.min(maxY, position.y + (Math.random() * 40 - 20)));
        
        setTargetPosition({ x: newX, y: newY });
        setDirection(newX > position.x ? 'right' : 'left');
        
        lastBehaviorTime.current.wander = now;
        
        // Much less frequent emotion changes when moving
        if (Math.random() > 0.9) { // Reduced from 0.7 to 0.9
          const moveEmotions: DuckEmotion[] = ['happy', 'cool', 'surprised', 'excited', 'curious', 'determined'];
          setEmotion(moveEmotions[Math.floor(Math.random() * moveEmotions.length)]);
        }
      }
    }, 8000); // Increased from 4s to 8s
    
    // FIXED: Much more conservative joke telling
    const jokeInterval = setInterval(() => {
      const now = Date.now();
      
      if (isVisible && 
          !isProcessingMessage && 
          !showMessage &&
          Math.random() > 0.95 && // Much more conservative (5% chance instead of 15%)
          now - lastBehaviorTime.current.joke > 120000) { // Minimum 2 minutes between jokes
        
        tellJoke();
        lastBehaviorTime.current.joke = now;
      }
    }, 180000); // Increased from 60s to 3 minutes
    
    // FIXED: Much more conservative waving
    const waveInterval = setInterval(() => {
      const now = Date.now();
      
      if (isVisible && 
          !isWaving && 
          !isProcessingMessage && 
          !showMessage &&
          Math.random() > 0.95 && // Much more conservative
          now - lastBehaviorTime.current.wave > 60000) { // Minimum 1 minute between waves
        
        setIsWaving(true);
        setTimeout(() => setIsWaving(false), 2000);
        lastBehaviorTime.current.wave = now;
      }
    }, 120000); // Increased from 30s to 2 minutes
    
    return () => {
      clearInterval(wanderInterval);
      clearInterval(jokeInterval);
      clearInterval(waveInterval);
    };
  }, [position, targetPosition, isVisible, isWaving, isMobile, isProcessingMessage, showMessage]);

  // Set initial position near the Release the Kraken button if available
  useEffect(() => {
    if (chatContainerRef.current && buttonPosition) {
      const chatRect = chatContainerRef.current.getBoundingClientRect();
      
      setPosition({
        x: Math.min(chatRect.width * 0.7, buttonPosition.right - chatRect.left + 20),
        y: Math.max(buttonPosition.top - chatRect.top + 30, chatRect.height * 0.3)
      });
    } else if (chatContainerRef.current) {
      const chatRect = chatContainerRef.current.getBoundingClientRect();
      setPosition({
        x: chatRect.width * 0.7,
        y: chatRect.height * 0.3
      });
    }
  }, [chatContainerRef.current, buttonPosition, isVisible]);

  // Animation frame loop for smooth movement
  useEffect(() => {
    if (!targetPosition || !chatContainerRef.current) return;
    
    const animateMovement = () => {
      const chatRect = chatContainerRef.current?.getBoundingClientRect();
      if (!chatRect) return;
      
      setPosition(currentPos => {
        const dx = targetPosition.x - currentPos.x;
        const dy = targetPosition.y - currentPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 3) {
          setTargetPosition(null);
          
          if (Math.random() > 0.8) { // Less frequent emotion changes when stopping
            const stopEmotions: DuckEmotion[] = ['happy', 'content', 'relieved', 'curious'];
            setEmotion(stopEmotions[Math.floor(Math.random() * stopEmotions.length)]);
          }
          
          return targetPosition;
        }
        
        const speed = isMobile ? 1.5 : 2.2;
        let newX = currentPos.x + (dx / distance) * speed;
        let newY = currentPos.y + (dy / distance) * speed;
        
        const minX = isMobile ? 50 : 30;
        const minY = isMobile ? 60 : 30;
        const maxX = chatRect.width - (isMobile ? 80 : 60);
        const maxY = isMobile ? 
          Math.min(chatRect.height - 150, chatRect.height * 0.7) : 
          chatRect.height - 60;
        
        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));
        
        return { x: newX, y: newY };
      });
      
      frameRef.current = requestAnimationFrame(animateMovement);
    };
    
    frameRef.current = requestAnimationFrame(animateMovement);
    
    return () => cancelAnimationFrame(frameRef.current);
  }, [targetPosition, isMobile]);

  // FIXED: Show welcome message only once when user connects
  useEffect(() => {
    if (user && isVisible && !hasShownWelcome.current) {
      let username = "Friend";
      if (profile?.username) {
        username = profile.username;
      } else if (user) {
        if (user.email) {
          username = String(user.email).split('@')[0];
        }
        
        if (user.linkedAccounts) {
          for (const account of user.linkedAccounts) {
            if (account.type === 'google_oauth' && account?.detail?.email) {
              username = account.detail.email.split('@')[0];
              break;
            }
          }
        }
      }
      
      hasShownWelcome.current = true;
      queueMessage(`Quack! Hi ${username}!`, 'high', 'excited', 4000);
    }
  }, [user, profile, isVisible]);

  // Track user's mood directly from ChatContext
  useEffect(() => {
    if (lastDetectedMood && lastDetectedMood !== userMood && isVisible && personalitySettings?.emotionalAwareness) {
      console.log(`Duck: Mood change from context: ${userMood} -> ${lastDetectedMood}`);
      setUserMood(lastDetectedMood);
      reactToSentiment(lastDetectedMood);
    }
  }, [isVisible, lastDetectedMood, userMood, personalitySettings]);

  // FIXED: Tell a random joke with better coordination and less frequency
  const tellJoke = () => {
    const randomJoke = duckJokes[Math.floor(Math.random() * duckJokes.length)];
    setJokeMode(true);
    queueMessage(randomJoke, 'normal', 'laughing', 8000); // Longer duration for jokes
    
    setTimeout(() => {
      setJokeMode(false);
      setEmotion('happy');
    }, 9000);
  };

  // Show a specific emotion with its associated message
  const showEmotion = (specificEmotion: DuckEmotion) => {
    setEmotion(specificEmotion);
    if (emotionAnimationMap[specificEmotion].message) {
      queueMessage(emotionAnimationMap[specificEmotion].message || '', 'normal', specificEmotion);
    }
  };

  // FIXED: Handle click on mascot with better message coordination
  const handleClick = () => {
    if (Math.random() > 0.8) {
      setShowBeam(true);
      setTimeout(() => setShowBeam(false), 3000);
    }
    
    if (Math.random() > 0.6) {
      tellJoke();
      return;
    }
    
    if (Math.random() > 0.3) {
      const emotions: DuckEmotion[] = Object.keys(emotionAnimationMap) as DuckEmotion[];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      showEmotionWithEmoji(randomEmotion);
      return;
    }
    
    const messages = [
      "Quack quack! 🦆",
      "Need help, friend?",
      "Get some cxFREN tokens!",
      "I'm your emotionally intelligent duck buddy!",
      "Quack quackity quack!",
      "High five! 🖐️",
      "FREN ducks understand feelings!",
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    queueMessage(randomMessage, 'normal', 'happy');
    
    const clickEmotions: DuckEmotion[] = ['happy', 'excited', 'surprised', 'grateful'];
    const clickEmotion = clickEmotions[Math.floor(Math.random() * clickEmotions.length)];
    showEmotionWithEmoji(clickEmotion);
    
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 1000);
  };

  // Handle right-click on mascot for emotion panel (for development/testing)
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const emotions: DuckEmotion[] = Object.keys(emotionAnimationMap) as DuckEmotion[];
    const currentIndex = emotions.indexOf(emotion);
    const nextIndex = (currentIndex + 1) % emotions.length;
    const nextEmotion = emotions[nextIndex];
    
    showEmotionWithEmoji(nextEmotion);
  };

  // Joke button handler
  const handleJokeButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    tellJoke();
  };

  // Drag and drop support - restricted to chat area
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', '');
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragEnd = (e: React.DragEvent) => {
    if (!chatContainerRef.current) return;
    
    const chatRect = chatContainerRef.current.getBoundingClientRect();
    let x = e.clientX - chatRect.left;
    let y = e.clientY - chatRect.top;
    
    const minX = isMobile ? 50 : 30;
    const minY = isMobile ? 60 : 30;
    const maxX = chatRect.width - (isMobile ? 80 : 60);
    const maxY = isMobile ? 
      Math.min(chatRect.height - 150, chatRect.height * 0.7) : 
      chatRect.height - 60;
    
    x = Math.max(minX, Math.min(maxX, x));
    y = Math.max(minY, Math.min(maxY, y));
    
    if (x && y) {
      setPosition({ x, y });
      setTargetPosition(null);
      setEmotion('surprised');
      setTimeout(() => setEmotion('happy'), 800);
    }
  };

  // Render the duck with emotions
  const renderDuck = () => {
    const duckBaseImage = "/lovable-uploads/535c1b5f-c4b9-43c9-9c3e-0113c908676d.png";
    
    const currentEmotionStyle = emotionAnimationMap[emotion] || emotionAnimationMap.happy;
    
    return (
      <div className={`round-duck ${targetPosition ? 'animate-bounce-gentle' : ''} ${isJumping ? 'animate-jump' : ''}`}>
        <div className="relative w-16 h-16">
          <img 
            src={duckBaseImage} 
            alt="Emotionally Intelligent Duck Mascot"
            className={`w-full h-full object-contain transition-transform duration-300 
              ${isWaving ? 'animate-wave' : ''}
              ${currentEmotionStyle.animation}
            `}
            style={{ 
              transform: `${direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`
            }}
          />
          
          {renderEmotionOverlay()}
        </div>
      </div>
    );
  };

  // Render emotion-specific overlay elements
  const renderEmotionOverlay = () => {
    switch(emotion) {
      case 'happy':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute top-1 left-0 w-full flex justify-center">
              <div className="bg-yellow-500 h-0.5 w-5 rounded-full transform rotate-12 mb-0.5"></div>
              <div className="bg-yellow-500 h-0.5 w-5 rounded-full transform -rotate-12 ml-3 mb-0.5"></div>
            </div>
          </div>
        );
      
      case 'sad':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute top-8 left-0 w-full flex justify-center">
              <div className="bg-blue-500 h-5 w-1 rounded-full transform rotate-12 animate-drip"></div>
              <div className="bg-blue-500 h-3 w-1 rounded-full transform -rotate-12 ml-3 animate-drip-delayed"></div>
            </div>
          </div>
        );
      
      case 'cool':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute top-[19px] left-0 w-full flex justify-center">
              <div className="bg-black h-2 w-10 rounded-md opacity-80"></div>
            </div>
          </div>
        );
      
      case 'angry':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute top-1 left-0 w-full flex justify-center">
              <div className="bg-red-600 h-0.5 w-5 rounded-full transform -rotate-12 mb-0.5"></div>
              <div className="bg-red-600 h-0.5 w-5 rounded-full transform rotate-12 ml-3 mb-0.5"></div>
            </div>
          </div>
        );
      
      case 'love':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute -top-2 -right-1">
              <div className="text-pink-500 text-lg animate-float">❤️</div>
            </div>
            <div className="absolute -top-3 left-2">
              <div className="text-pink-500 text-sm animate-float-delayed">❤️</div>
            </div>
          </div>
        );
      
      case 'sleeping':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute -top-1 right-0 flex flex-col items-start">
              <span className="text-blue-600 text-xs animate-float-up">z</span>
              <span className="text-blue-600 text-sm ml-1 animate-float-up-delayed">Z</span>
              <span className="text-blue-600 text-base ml-2 animate-float-up-more-delayed">Z</span>
            </div>
          </div>
        );
      
      case 'surprised':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute -top-2 right-0">
              <span className="text-yellow-500 text-lg animate-pulse">!</span>
            </div>
            <div className="absolute -top-2 left-2">
              <span className="text-yellow-500 text-lg animate-pulse-delayed">?</span>
            </div>
          </div>
        );
      
      case 'laughing':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute top-1 left-0 w-full flex justify-center">
              <div className="bg-yellow-500 h-0.5 w-4 rounded-full transform rotate-25 mb-0.5"></div>
              <div className="bg-yellow-500 h-0.5 w-4 rounded-full transform -rotate-25 ml-4 mb-0.5"></div>
            </div>
            <div className="absolute top-8 left-0 w-full flex justify-center">
              <div className="text-gray-800 text-xs">haha</div>
            </div>
          </div>
        );
      
      case 'excited':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute -top-2 -right-1">
              <div className="text-yellow-300 text-sm animate-float">✨</div>
            </div>
            <div className="absolute -top-2 left-0">
              <div className="text-yellow-300 text-sm animate-float-delayed">✨</div>
            </div>
            <div className="absolute -top-3 left-8">
              <div className="text-yellow-300 text-sm animate-float-more-delayed">✨</div>
            </div>
          </div>
        );
      
      case 'confused':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute -top-2 right-0">
              <span className="text-blue-500 text-lg animate-float">?</span>
            </div>
            <div className="absolute -top-3 left-2">
              <span className="text-blue-500 text-sm animate-float-delayed">?</span>
            </div>
          </div>
        );
      
      case 'worried':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute top-1 left-0 w-full flex justify-center">
              <div className="bg-blue-400 h-0.5 w-5 rounded-full transform -rotate-12 mb-0.5"></div>
              <div className="bg-blue-400 h-0.5 w-5 rounded-full transform rotate-12 ml-3 mb-0.5"></div>
            </div>
            <div className="absolute top-8 right-4">
              <div className="bg-blue-300 h-4 w-1 rounded-full opacity-70 animate-drip-delayed"></div>
            </div>
          </div>
        );
      
      case 'scared':
        return (
          <div className="absolute inset-0 flex items-center justify-center opacity-90">
            <div className="absolute top-5 left-0 w-full flex justify-center">
              <div className="bg-blue-100 h-8 w-8 rounded-full"></div>
              <div className="bg-blue-100 h-8 w-8 rounded-full ml-4"></div>
            </div>
            <div className="absolute top-1 left-0 w-full flex justify-center">
              <div className="border-t-2 border-blue-400 w-4 transform -rotate-25"></div>
              <div className="border-t-2 border-blue-400 w-4 transform rotate-25 ml-4"></div>
            </div>
          </div>
        );
      
      case 'proud':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute -top-2 right-0">
              <span className="text-amber-400 text-sm animate-pulse">★</span>
            </div>
            <div className="absolute -top-2 left-0">
              <span className="text-amber-400 text-sm animate-pulse-delayed">★</span>
            </div>
            <div className="absolute -top-0 left-2 w-full flex justify-center">
              <div className="bg-yellow-500 h-0.5 w-4 rounded-full transform rotate-12 mb-0.5"></div>
              <div className="bg-yellow-500 h-0.5 w-4 rounded-full transform -rotate-12 ml-4 mb-0.5"></div>
            </div>
          </div>
        );
      
      case 'tired':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute top-2 left-0 w-full flex justify-center">
              <div className="border-t-2 border-gray-400 w-4 transform -rotate-5"></div>
              <div className="border-t-2 border-gray-400 w-4 transform rotate-5 ml-4"></div>
            </div>
          </div>
        );
      
      case 'bored':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute top-2 left-0 w-full flex justify-center">
              <div className="bg-gray-500 h-0.5 w-5 rounded-full"></div>
              <div className="bg-gray-500 h-0.5 w-5 rounded-full ml-4"></div>
            </div>
            <div className="absolute bottom-2 right-0">
              <div className="text-gray-400 text-xs animate-pulse-slow">...</div>
            </div>
          </div>
        );

      case 'curious':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute -top-3 -right-3">
              <span className="text-yellow-500 text-sm">🔍</span>
            </div>
            <div className="absolute top-1 left-0 w-full flex justify-center">
              <div className="bg-yellow-500 h-0.5 w-4 rounded-full transform rotate-12 mb-0.5"></div>
              <div className="bg-yellow-500 h-0.5 w-4 rounded-full transform -rotate-12 ml-4 mb-0.5"></div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div 
        ref={containerRef}
        style={{ 
          position: 'absolute', 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          zIndex: 50,
          transform: `scale(${isMobile ? 0.7 : 0.8})`, 
          transformOrigin: 'bottom center',
          transition: 'transform 0.2s ease'
        }}
        className={`select-none ${showBeam ? 'duck-spotlight' : ''}`}
      >
        {/* Animated Emoji Display */}
        <AnimatePresence>
          {showEmoji && (
            <motion.div
              className="absolute pointer-events-none z-10"
              style={{
                ...getEmojiPositionStyles(),
                color: emojiColor,
                textShadow: '0 0 8px rgba(0,0,0,0.3)',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }}
              variants={emojiVariants[emojiAnimation] || emojiVariants.bounce}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {currentEmoji}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Speech bubble */}
        {showMessage && (
          <div 
            className={`absolute bottom-full mb-1 bg-amber-50 border-2 border-amber-400 rounded-lg p-3 shadow-lg text-sm
              ${isMobile ? 'min-w-[140px] max-w-[200px]' : 'min-w-[180px] max-w-[260px]'}
              animate-fade-in ${jokeMode ? 'min-h-[80px]' : ''}`}
          >
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-amber-50 border-r-2 border-b-2 border-amber-400"></div>
            <p className={`text-center font-medium text-amber-800 ${jokeMode ? 'text-xs' : ''} ${isMobile ? 'text-xs' : ''}`}>
              {message}
            </p>
            
            {messageQueue.length > 0 && (
              <div className="absolute top-1 left-1 flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" title={`${messageQueue.length} messages queued`}></div>
                <span className="text-xs text-blue-600">{messageQueue.length}</span>
              </div>
            )}
            
            {personalitySettings?.emotionalAwareness && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse" title="Emotionally Aware"></div>
            )}
            
            {jokeMode && (
              <div className="absolute top-2 right-2 text-yellow-500 animate-pulse-gentle">
                <Smile className="h-4 w-4" />
              </div>
            )}
          </div>
        )}
        
        <div 
          className={`absolute ${isMobile ? '-top-4 -right-4' : '-top-6 -right-6'} 
            bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full p-1 cursor-pointer 
            shadow-sm transition-all duration-200 hover:scale-110`}
          onClick={handleJokeButtonClick}
          title="Tell me a joke!"
        >
          <Smile className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
        </div>
        
        <div 
          draggable 
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={handleClick}
          onContextMenu={handleRightClick}
          className="cursor-pointer duck-body"
        >
          {renderDuck()}
        </div>
      </div>
    </>
  );
};

export default RoundDuckMascot;

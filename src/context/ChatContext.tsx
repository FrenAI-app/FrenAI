import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { detectMood } from '../lib/moodDetection';
import { analyzeSentiment, getPersonalizedAdvice } from '../lib/sentimentAnalysis';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { 
  saveConversationMessage, 
  getUserConversationHistory, 
  getUserInsights, 
  analyzeUserPatterns, 
  saveUserInsight,
  type UserInsight 
} from '../lib/conversationStorage';

// Define types
export type MessageMood = 'happy' | 'sad' | 'neutral' | 'excited' | 'angry' | 'anxious';
export type PersonalityType = 'witty';

export type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  mood?: MessageMood;
  audioUrl?: string;
  sentimentScore?: number;
};

export type PersonalitySettings = {
  aiName: string;
  personalityType: PersonalityType;
  voiceEnabled?: boolean;
  emotionalAwareness?: boolean;
  voiceId?: string;
};

type ChatContextType = {
  messages: MessageType[];
  loading: boolean;
  personalitySettings: PersonalitySettings;
  updatePersonalitySettings: (settings: Partial<PersonalitySettings>) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  generateVoiceResponse: (text: string) => Promise<string | null>;
  lastDetectedMood: MessageMood;
};

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Provider component
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [lastDetectedMood, setLastDetectedMood] = useState<MessageMood>('neutral');
  const [userInsights, setUserInsights] = useState<UserInsight[]>([]);
  const [personalitySettings, setPersonalitySettings] = useState<PersonalitySettings>({
    aiName: 'Fren',
    personalityType: 'witty',
    voiceEnabled: true,
    emotionalAwareness: true,
    voiceId: 'WAYsiv3Yudejrr5Di4lf'
  });
  
  // Set up auth listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user insights when user changes
  useEffect(() => {
    if (user?.id) {
      loadUserInsights();
      loadConversationHistory();
    }
  }, [user?.id]);

  // Load user insights from database
  const loadUserInsights = async () => {
    if (!user?.id) return;
    
    try {
      const insights = await getUserInsights(user.id);
      setUserInsights(insights);
    } catch (error) {
      console.error('Error loading user insights:', error);
    }
  };

  // Load recent conversation history
  const loadConversationHistory = async () => {
    if (!user?.id) return;
    
    try {
      const history = await getUserConversationHistory(user.id, 20);
      
      // Convert to MessageType format and set as initial messages
      const formattedMessages: MessageType[] = history
        .reverse()
        .map(msg => ({
          id: msg.id || uuidv4(),
          content: msg.content,
          sender: msg.sender as 'user' | 'ai',
          timestamp: new Date(msg.created_at || new Date()),
          mood: msg.mood as MessageMood,
          sentimentScore: msg.sentiment_score
        }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  };

  // Enhanced update personality settings with learning
  const updatePersonalitySettings = async (settings: Partial<PersonalitySettings>) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You need to sign in to save your settings.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedSettings: PersonalitySettings = {
      ...personalitySettings,
      ...(settings.aiName ? { aiName: settings.aiName } : {}),
      personalityType: 'witty',
      ...(settings.voiceEnabled !== undefined ? { voiceEnabled: settings.voiceEnabled } : {}),
      emotionalAwareness: true,
      ...(settings.voiceId ? { voiceId: settings.voiceId } : {})
    };
    
    setPersonalitySettings(updatedSettings);
    
    try {
      const { data, error } = await supabase
        .from('personality_settings')
        .upsert({
          user_id: user.id,
          ai_name: updatedSettings.aiName,
          personality_type: updatedSettings.personalityType,
          voice_id: updatedSettings.voiceId
        }, 
        { 
          onConflict: 'user_id'
        });
      
      if (error) throw error;
      
      toast({
        title: "Settings updated",
        description: "Your AI friend's settings have been saved.",
        variant: "default"
      });
      
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
    
    // Save user preference insight
    if (user?.id && settings.aiName && settings.aiName !== personalitySettings.aiName) {
      await saveUserInsight({
        user_id: user.id,
        insight_type: 'preference',
        insight_key: 'ai_name_preference',
        insight_value: { preferred_name: settings.aiName },
        confidence_score: 1.0
      });
    }

    // Save voice preference insight
    if (user?.id && settings.voiceId && settings.voiceId !== personalitySettings.voiceId) {
      await saveUserInsight({
        user_id: user.id,
        insight_type: 'preference',
        insight_key: 'voice_preference',
        insight_value: { preferred_voice: settings.voiceId },
        confidence_score: 1.0
      });
    }
  };

  // Generate voice for text - Enhanced with better error handling
  const generateVoiceResponse = async (text: string): Promise<string | null> => {
    if (!personalitySettings.voiceEnabled) {
      console.log('Voice disabled in settings');
      return null;
    }
    
    try {
      console.log('Generating voice for text:', text.substring(0, 50) + '...');
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text,
          voice: getVoiceNameFromId(personalitySettings.voiceId || 'WAYsiv3Yudejrr5Di4lf')
        }
      });
      
      if (error) {
        console.error('Voice generation error:', error);
        return null; // Return null instead of throwing to prevent chat interruption
      }
      
      if (data && data.audioContent) {
        console.log('Voice generation successful');
        return `data:audio/mp3;base64,${data.audioContent}`;
      }
      
      console.log('No audio content received');
      return null;
    } catch (error) {
      console.error('Error generating voice response:', error);
      return null; // Gracefully handle errors
    }
  };

  // Helper function to get voice name from voice ID
  const getVoiceNameFromId = (voiceId: string): string => {
    const voiceIdMap: Record<string, string> = {
      'WAYsiv3Yudejrr5Di4lf': 'FrenDefault',
      'tVkOo4DLgZb89qB0x4qP': 'FrenOld',
      'CwhRBWXzGAHq8TQ4Fs17': 'Roger',
      '9BWtsMINqrJLrRacOk9x': 'Aria',
      'EXAVITQu4vr4xnSDxMaL': 'Sarah',
      'FGY2WhTYpPnrIDTdsKH5': 'Laura',
      'IKne3meq5aSn9XLyUdCD': 'Charlie',
      'JBFqnCBsd6RMkjVDRZzb': 'George',
      'N2lVS1w4EtoT3dr4eOWO': 'Callum',
      'SAz9YHcvj6GT2YYXdXww': 'River',
      'TX3LPaxmHKxFdv7VOQHJ': 'Liam',
      'XB0fDUnXU5powFXDhCwa': 'Charlotte'
    };
    
    return voiceIdMap[voiceId] || 'FrenDefault';
  };

  // Enhanced sendMessage with user data learning
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Start sentiment analysis
    let userMood: MessageMood = 'neutral';
    let sentimentScore = 0;
    let personalizedAdvice = '';
    
    try {
      const sentimentResult = await analyzeSentiment(content);
      userMood = sentimentResult.mood;
      sentimentScore = sentimentResult.score;
      
      // Get personalized advice based on mood and user insights
      personalizedAdvice = await getPersonalizedAdvice(userMood, userInsights);
      
      setLastDetectedMood(userMood);
      
      console.log(`Detected mood: ${userMood} with score: ${sentimentScore}`);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      userMood = detectMood(content) as MessageMood;
    }
    
    // Add user message to chat
    const userMessage: MessageType = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date(),
      mood: userMood,
      sentimentScore
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Save user message to database if user is authenticated
    if (user?.id) {
      await saveConversationMessage(user.id, userMessage);
    }
    
    // Create a custom event for MoodBasedDuck
    const event = new CustomEvent('userMoodChanged', { 
      detail: { mood: userMood, score: sentimentScore } 
    });
    document.dispatchEvent(event);
    
    // Show typing indicator
    setLoading(true);
    
    try {
      // Format the message history to ensure strict alternation
      const messageHistory = [];
      const allMessages = [...messages, userMessage];
      
      let userMessages = allMessages.filter(m => m.sender === 'user').slice(0, -1);
      let aiMessages = allMessages.filter(m => m.sender === 'ai');
      
      const pairCount = Math.min(userMessages.length, aiMessages.length);
      
      for (let i = 0; i < pairCount; i++) {
        const userIndex = userMessages.length - pairCount + i;
        const aiIndex = aiMessages.length - pairCount + i;
        
        if (userIndex >= 0 && aiIndex >= 0) {
          messageHistory.push({
            content: userMessages[userIndex].content,
            is_ai: false
          });
          messageHistory.push({
            content: aiMessages[aiIndex].content,
            is_ai: true
          });
        }
      }
      
      messageHistory.push({
        content: userMessage.content,
        is_ai: false
      });
      
      // Get enhanced context from user insights
      let userContext = '';
      if (userInsights.length > 0) {
        const personalityInsights = userInsights.filter(i => i.insight_type === 'personality');
        const preferenceInsights = userInsights.filter(i => i.insight_type === 'preference');
        
        if (personalityInsights.length > 0 || preferenceInsights.length > 0) {
          userContext = `\n\n# User Context (for personalization):\n`;
          
          personalityInsights.forEach(insight => {
            userContext += `- ${insight.insight_key}: ${JSON.stringify(insight.insight_value)}\n`;
          });
          
          preferenceInsights.forEach(insight => {
            userContext += `- ${insight.insight_key}: ${JSON.stringify(insight.insight_value)}\n`;
          });
        }
      }
      
      // Call the Supabase Edge Function with mood context and user ID for learning
      const { data, error } = await supabase.functions.invoke('chat', {
        body: JSON.stringify({
          message: content,
          aiName: personalitySettings.aiName,
          aiPersonality: personalitySettings.personalityType,
          messageHistory,
          userMood,
          personalizedAdvice,
          userContext,
          userId: user?.id || null // Pass user ID for learning system
        })
      });
      
      if (error) {
        throw new Error(error.message || 'Error generating FrenAI response');
      }

      if (!data) {
        throw new Error('Invalid response from FrenAI service');
      }

      const aiResponse = data.response || "Hey there! What's up?";
      
      let audioUrl = null;
      if (personalitySettings.voiceEnabled) {
        console.log('Attempting to generate voice for AI response');
        audioUrl = await generateVoiceResponse(aiResponse);
        if (audioUrl) {
          console.log('Voice generation successful, audio URL created');
        } else {
          console.log('Voice generation failed or returned null');
        }
      } else {
        console.log('Voice generation skipped - disabled in settings');
      }
      
      const aiMessage: MessageType = {
        id: uuidv4(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        audioUrl
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI message to database if user is authenticated
      if (user?.id) {
        await saveConversationMessage(user.id, aiMessage);
        
        // Analyze patterns and update insights periodically
        if (messages.length % 10 === 0) {
          const allMessages = await getUserConversationHistory(user.id, 100);
          const newInsights = await analyzeUserPatterns(user.id, allMessages);
          
          for (const insight of newInsights) {
            await saveUserInsight(insight);
          }
          
          await loadUserInsights();
        }
      }
      
    } catch (error) {
      console.error('Error generating FrenAI response:', error);
      
      const fallbackMessage: MessageType = {
        id: uuidv4(),
        content: "Hey there! What's up?",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      
      toast({
        title: "Something went wrong",
        description: "But I'm still here! Let's keep chatting.",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };

  // Enhanced clear messages to also clear from database
  const clearMessages = async () => {
    setMessages([]);
    
    if (user?.id) {
      try {
        await supabase
          .from('messages')
          .delete()
          .eq('user_id', user.id);
          
        toast({
          title: "Chat cleared",
          description: "Your conversation history has been cleared.",
        });
      } catch (error) {
        console.error('Error clearing messages from database:', error);
      }
    }
  };

  return (
    <ChatContext.Provider value={{
      messages,
      loading,
      personalitySettings,
      updatePersonalitySettings,
      sendMessage,
      clearMessages,
      generateVoiceResponse,
      lastDetectedMood
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export { default as DuckMascot } from '../components/DuckMascot';

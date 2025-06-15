
import { supabase } from '@/integrations/supabase/client';
import { MessageType, MessageMood } from '@/context/ChatContext';

export interface UserInsight {
  id?: string;
  user_id: string;
  insight_type: 'personality' | 'preference' | 'interest' | 'pattern';
  insight_key: string;
  insight_value: any;
  confidence_score?: number;
  last_updated?: string;
  created_at?: string;
}

export interface ConversationMessage {
  id?: string;
  user_id: string;
  content: string;
  sender: 'user' | 'ai';
  mood?: string;
  sentiment_score?: number;
  created_at?: string;
  updated_at?: string;
}

// Save a conversation message using the existing messages table
export const saveConversationMessage = async (
  userId: string,
  message: MessageType
): Promise<boolean> => {
  try {
    const messageData = {
      user_id: userId,
      content: message.content,
      is_ai: message.sender === 'ai',
      mood: message.mood
    };

    const { error } = await supabase
      .from('messages')
      .insert([messageData]);

    if (error) {
      console.error('Error saving conversation message:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveConversationMessage:', error);
    return false;
  }
};

// Get user's conversation history from existing messages table
export const getUserConversationHistory = async (
  userId: string,
  limit: number = 50
): Promise<ConversationMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching conversation history:', error);
      return [];
    }

    // Convert from messages table format to ConversationMessage format
    const messages: ConversationMessage[] = (data || []).map(msg => ({
      id: msg.id,
      user_id: msg.user_id || userId,
      content: msg.content,
      sender: msg.is_ai ? 'ai' : 'user',
      mood: msg.mood,
      created_at: msg.created_at
    }));

    return messages;
  } catch (error) {
    console.error('Error in getUserConversationHistory:', error);
    return [];
  }
};

// Store insights in the profiles table bio field as a simple implementation
export const saveUserInsight = async (insight: UserInsight): Promise<boolean> => {
  try {
    // Get existing profile first
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('bio')
      .eq('user_id', insight.user_id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing profile:', fetchError);
      return false;
    }

    // Parse existing bio or create new one
    let existingInsights = {};
    if (existingProfile?.bio) {
      try {
        existingInsights = JSON.parse(existingProfile.bio);
      } catch {
        existingInsights = {};
      }
    }

    // Add new insight
    const updatedInsights = {
      ...existingInsights,
      [insight.insight_key]: insight.insight_value
    };

    // Update or insert profile
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: insight.user_id,
        bio: JSON.stringify(updatedInsights),
        // Set required fields for new profiles
        chain: 'Solana',
        wallet_address: `temp_${insight.user_id}`
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error saving user insight:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveUserInsight:', error);
    return false;
  }
};

// Get user insights from profiles table
export const getUserInsights = async (userId: string): Promise<UserInsight[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('bio')
      .eq('user_id', userId)
      .single();

    if (error || !data?.bio) {
      return [];
    }

    // Parse insights from bio field
    try {
      const parsedBio = JSON.parse(data.bio);
      const insights: UserInsight[] = Object.entries(parsedBio).map(([key, value]) => ({
        user_id: userId,
        insight_type: 'personality' as const,
        insight_key: key,
        insight_value: value,
        confidence_score: 0.5
      }));
      
      return insights;
    } catch {
      return [];
    }
  } catch (error) {
    console.error('Error in getUserInsights:', error);
    return [];
  }
};

// Analyze user patterns and extract insights
export const analyzeUserPatterns = async (
  userId: string,
  messages: ConversationMessage[]
): Promise<UserInsight[]> => {
  const insights: UserInsight[] = [];

  try {
    // Analyze mood patterns
    const userMessages = messages.filter(m => m.sender === 'user');
    const moodCounts: Record<string, number> = {};
    let totalMessages = userMessages.length;

    userMessages.forEach(msg => {
      if (msg.mood) {
        moodCounts[msg.mood] = (moodCounts[msg.mood] || 0) + 1;
      }
    });

    // Most common mood
    const dominantMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0];

    if (dominantMood && totalMessages > 0) {
      insights.push({
        user_id: userId,
        insight_type: 'personality',
        insight_key: 'dominant_mood',
        insight_value: {
          mood: dominantMood[0],
          frequency: dominantMood[1],
          percentage: (dominantMood[1] / totalMessages) * 100
        },
        confidence_score: Math.min(dominantMood[1] / 10, 1.0)
      });
    }

    // Communication patterns
    if (totalMessages > 0) {
      const avgMessageLength = userMessages.reduce((sum, msg) => sum + msg.content.length, 0) / totalMessages;
      insights.push({
        user_id: userId,
        insight_type: 'pattern',
        insight_key: 'communication_style',
        insight_value: {
          avg_message_length: avgMessageLength,
          style: avgMessageLength > 100 ? 'detailed' : avgMessageLength > 50 ? 'moderate' : 'concise',
          total_messages: totalMessages
        },
        confidence_score: Math.min(totalMessages / 10, 1.0)
      });
    }

    return insights;
  } catch (error) {
    console.error('Error analyzing user patterns:', error);
    return [];
  }
};

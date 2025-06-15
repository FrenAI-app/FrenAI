
// This file re-exports the Supabase client from the integrations directory

import { supabase } from '@/integrations/supabase/client';

export { supabase };

export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};

export const saveMessage = async (message: any) => {
  try {
    // Save messages to the database
    const { error } = await supabase
      .from('messages')
      .insert(message);
      
    if (error) {
      console.error('Error saving message:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error handling message:', err);
    return false;
  }
};

// Game taps functions
export interface GameTapsData {
  id?: string;
  user_id: string;
  tap_count: number;
  score: number;
  last_played: string;
  created_at?: string;
  updated_at?: string;
}

// Get user game data
export const getUserGameData = async (userId: string): Promise<GameTapsData | null> => {
  const { data, error } = await supabase
    .from('game_taps')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching game data:', error);
    return null;
  }
  
  return data;
};

// Create new game record
export const createGameRecord = async (userId: string): Promise<GameTapsData | null> => {
  const newRecord: Omit<GameTapsData, 'id' | 'created_at' | 'updated_at'> = {
    user_id: userId,
    tap_count: 0,
    score: 0,
    last_played: new Date().toISOString().split('T')[0]
  };
  
  const { data, error } = await supabase
    .from('game_taps')
    .insert([newRecord])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating game record:', error);
    return null;
  }
  
  return data;
};

// Update game data
export const updateGameData = async (gameData: GameTapsData): Promise<GameTapsData | null> => {
  const { data, error } = await supabase
    .from('game_taps')
    .update({
      tap_count: gameData.tap_count,
      score: gameData.score,
      last_played: gameData.last_played,
      updated_at: new Date().toISOString()
    })
    .eq('id', gameData.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating game data:', error);
    return null;
  }
  
  return data;
};

// Function to ensure avatar storage bucket exists
export const ensureAvatarBucketExists = async (): Promise<boolean> => {
  try {
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('Error checking storage buckets:', bucketsError);
      return false;
    }
    
    const avatarBucketExists = buckets.some(bucket => bucket.name === 'avatars');
    if (!avatarBucketExists) {
      const { error: createError } = await supabase
        .storage
        .createBucket('avatars', { public: true });
      
      if (createError) {
        console.error('Error creating avatars bucket:', createError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in ensureAvatarBucketExists:', error);
    return false;
  }
};

// Daily rewards interfaces and functions
export interface DailyRewardData {
  id?: string;
  user_id: string;
  check_in_date: string;
  streak_count: number;
  reward_amount: number;
  collected: boolean;
  created_at?: string;
}

// Check if user has claimed today's reward
export const hasClaimedDailyReward = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc(
      'has_claimed_daily_reward',
      { user_uuid: userId }
    );
    
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error('Error checking daily reward status:', error);
    return false;
  }
};

// Claim daily reward
export const claimDailyReward = async (userId: string): Promise<{ 
  success: boolean; 
  streak?: number; 
  reward?: number; 
  newBalance?: number;
  alreadyClaimed?: boolean;
  message?: string;
}> => {
  try {
    // Use the supabase functions object reference correctly
    const response = await fetch(`https://lxzbzyisnificdwtzddc.supabase.co/functions/v1/chat/daily-check-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      },
      body: JSON.stringify({ user_id: userId })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to claim reward: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error claiming daily reward:', error);
    return { success: false, message: 'Error claiming reward' };
  }
};

// Get user's streak history
export const getStreakHistory = async (userId: string): Promise<DailyRewardData[]> => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { data, error } = await supabase
    .from('daily_rewards')
    .select('*')
    .eq('user_id', userId)
    .gte('check_in_date', thirtyDaysAgo.toISOString().split('T')[0])
    .order('check_in_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching streak history:', error);
    return [];
  }
  
  return data || [];
};

// Get current streak
export const getCurrentStreak = async (userId: string): Promise<number> => {
  try {
    const history = await getStreakHistory(userId);
    
    if (!history || history.length === 0) {
      return 0;
    }
    
    // The most recent check-in has the current streak count
    return history[0].streak_count;
  } catch (error) {
    console.error('Error getting current streak:', error);
    return 0;
  }
};

// Enhanced functions for AI learning and analytics
export interface AILearningData {
  id?: string;
  user_id: string;
  interaction_type: 'positive_feedback' | 'negative_feedback' | 'topic_interest' | 'correction' | 'preference';
  data: any;
  confidence_score: number;
  applied: boolean;
  created_at?: string;
}

// Save AI learning data
export const saveAILearningData = async (learningData: Omit<AILearningData, 'id' | 'created_at'>): Promise<AILearningData | null> => {
  try {
    const { data, error } = await supabase
      .from('ai_learning_data')
      .insert([learningData])
      .select()
      .single();
    
    if (error) {
      console.error('Error saving AI learning data:', error);
      return null;
    }
    
    return {
      ...data,
      interaction_type: data.interaction_type as AILearningData['interaction_type']
    };
  } catch (err) {
    console.error('Error handling AI learning data:', err);
    return null;
  }
};

// Get AI learning data for a user
export const getAILearningData = async (userId: string): Promise<AILearningData[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_learning_data')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching AI learning data:', error);
      return [];
    }
    
    return (data || []).map(item => ({
      ...item,
      interaction_type: item.interaction_type as AILearningData['interaction_type']
    }));
  } catch (err) {
    console.error('Error handling AI learning data fetch:', err);
    return [];
  }
};

// Enhanced conversation storage with sentiment tracking
export const saveConversationMessage = async (userId: string, message: any): Promise<boolean> => {
  try {
    // Save to existing messages table
    const messageData = {
      user_id: userId,
      content: message.content,
      is_ai: message.sender === 'ai',
      mood: message.mood || null,
      created_at: message.timestamp.toISOString()
    };

    const { error } = await supabase
      .from('messages')
      .insert([messageData]);
      
    if (error) {
      console.error('Error saving conversation message:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error handling conversation message:', err);
    return false;
  }
};

// Get conversation history with enhanced analytics
export const getConversationHistory = async (userId: string, limit: number = 50) => {
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
    
    return data || [];
  } catch (err) {
    console.error('Error handling conversation history fetch:', err);
    return [];
  }
};

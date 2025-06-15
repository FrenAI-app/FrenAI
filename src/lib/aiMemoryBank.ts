
import { supabase } from '@/lib/supabaseClient';

export interface AIMemory {
  id?: string;
  user_id: string;
  memory_type: 'personal' | 'preference' | 'fact' | 'relationship' | 'goal' | 'interest';
  memory_key: string;
  memory_value: any;
  importance_score: number;
  last_accessed?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AIPersonality {
  id: string;
  name: string;
  description: string;
  system_prompt: string;
  personality_traits: Record<string, any>;
  voice_settings: Record<string, any>;
  is_default: boolean;
  is_custom: boolean;
  created_by?: string;
}

export interface ConversationAnalytics {
  id?: string;
  user_id: string;
  date: string;
  total_messages: number;
  ai_messages: number;
  user_messages: number;
  mood_distribution: Record<string, number>;
  avg_response_time_seconds?: number;
  topics_discussed: string[];
  session_duration_minutes?: number;
}

export interface UserLearningInsight {
  id?: string;
  user_id: string;
  insight_type: 'behavior_pattern' | 'preference_change' | 'mood_trend' | 'topic_interest' | 'communication_style';
  insight_data: any;
  confidence_score: number;
  actionable: boolean;
  applied: boolean;
  created_at?: string;
}

// Enhanced AI Memory Bank Functions with better learning capabilities
export const saveMemory = async (memory: Omit<AIMemory, 'id' | 'created_at' | 'updated_at'>): Promise<AIMemory | null> => {
  try {
    const { data, error } = await supabase
      .from('ai_memory_bank')
      .upsert({
        ...memory,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,memory_key'
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      memory_type: data.memory_type as AIMemory['memory_type']
    };
  } catch (error) {
    console.error('Error saving memory:', error);
    return null;
  }
};

export const getMemories = async (userId: string, memoryType?: string): Promise<AIMemory[]> => {
  try {
    let query = supabase
      .from('ai_memory_bank')
      .select('*')
      .eq('user_id', userId)
      .order('importance_score', { ascending: false });

    if (memoryType) {
      query = query.eq('memory_type', memoryType);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Update last_accessed timestamp
    if (data && data.length > 0) {
      await supabase
        .from('ai_memory_bank')
        .update({ last_accessed: new Date().toISOString() })
        .in('id', data.map(m => m.id));
    }

    return (data || []).map(item => ({
      ...item,
      memory_type: item.memory_type as AIMemory['memory_type']
    }));
  } catch (error) {
    console.error('Error fetching memories:', error);
    return [];
  }
};

// Enhanced learning analysis functions
export const analyzeUserBehaviorPatterns = async (userId: string): Promise<UserLearningInsight[]> => {
  try {
    // Get recent conversation data
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (messagesError) throw messagesError;

    // Get learning data
    const { data: learningData, error: learningError } = await supabase
      .from('ai_learning_data')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (learningError) throw learningError;

    const insights: UserLearningInsight[] = [];

    // Analyze communication patterns
    if (messages && messages.length > 0) {
      const userMessages = messages.filter(m => !m.is_ai);
      const avgLength = userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length;
      
      insights.push({
        user_id: userId,
        insight_type: 'communication_style',
        insight_data: {
          avg_message_length: avgLength,
          message_count: userMessages.length,
          style: avgLength > 100 ? 'detailed' : avgLength > 50 ? 'moderate' : 'concise',
          last_analyzed: new Date().toISOString()
        },
        confidence_score: Math.min(userMessages.length / 20, 1.0),
        actionable: true,
        applied: false
      });

      // Analyze mood patterns
      const moodCounts: Record<string, number> = {};
      userMessages.forEach(m => {
        if (m.mood) {
          moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
        }
      });

      if (Object.keys(moodCounts).length > 0) {
        const dominantMood = Object.entries(moodCounts)
          .sort(([,a], [,b]) => b - a)[0];

        insights.push({
          user_id: userId,
          insight_type: 'mood_trend',
          insight_data: {
            dominant_mood: dominantMood[0],
            mood_distribution: moodCounts,
            total_messages: userMessages.length,
            last_analyzed: new Date().toISOString()
          },
          confidence_score: dominantMood[1] / userMessages.length,
          actionable: true,
          applied: false
        });
      }
    }

    // Analyze learning data for preference changes
    if (learningData && learningData.length > 0) {
      const preferences = learningData.filter(d => d.interaction_type === 'preference');
      if (preferences.length > 0) {
        insights.push({
          user_id: userId,
          insight_type: 'preference_change',
          insight_data: {
            recent_preferences: preferences.slice(0, 5).map(p => p.data),
            preference_count: preferences.length,
            last_analyzed: new Date().toISOString()
          },
          confidence_score: Math.min(preferences.length / 10, 1.0),
          actionable: true,
          applied: false
        });
      }
    }

    return insights;
  } catch (error) {
    console.error('Error analyzing user behavior patterns:', error);
    return [];
  }
};

// Save learning insights
export const saveLearningInsight = async (insight: Omit<UserLearningInsight, 'id' | 'created_at'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ai_learning_data')
      .upsert({
        user_id: insight.user_id,
        interaction_type: 'behavior_analysis',
        data: insight.insight_data,
        confidence_score: insight.confidence_score,
        applied: insight.applied
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving learning insight:', error);
    return false;
  }
};

// Enhanced conversation analytics with learning insights
export const updateConversationAnalytics = async (
  userId: string, 
  data: Partial<ConversationAnalytics>
): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('conversation_analytics')
      .upsert({
        user_id: userId,
        date: today,
        ...data,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,date'
      });

    if (error) throw error;

    // Trigger learning analysis for every 10th conversation
    if (data.total_messages && data.total_messages % 10 === 0) {
      const insights = await analyzeUserBehaviorPatterns(userId);
      for (const insight of insights) {
        await saveLearningInsight(insight);
      }
    }
  } catch (error) {
    console.error('Error updating conversation analytics:', error);
  }
};

// AI Personalities Functions
export const getPersonalities = async (): Promise<AIPersonality[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_personalities')
      .select('*')
      .order('is_default', { ascending: false });

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      personality_traits: typeof item.personality_traits === 'string' 
        ? JSON.parse(item.personality_traits) 
        : item.personality_traits || {},
      voice_settings: typeof item.voice_settings === 'string' 
        ? JSON.parse(item.voice_settings) 
        : item.voice_settings || {}
    }));
  } catch (error) {
    console.error('Error fetching personalities:', error);
    return [];
  }
};

export const getUserAIPreferences = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_ai_preferences')
      .select(`
        *,
        active_personality:ai_personalities(*)
      `)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    if (data?.active_personality) {
      data.active_personality = {
        ...data.active_personality,
        personality_traits: typeof data.active_personality.personality_traits === 'string' 
          ? JSON.parse(data.active_personality.personality_traits) 
          : data.active_personality.personality_traits || {},
        voice_settings: typeof data.active_personality.voice_settings === 'string' 
          ? JSON.parse(data.active_personality.voice_settings) 
          : data.active_personality.voice_settings || {}
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user AI preferences:', error);
    return null;
  }
};

export const updateUserAIPreferences = async (userId: string, preferences: Partial<any>) => {
  try {
    const { data, error } = await supabase
      .from('user_ai_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user AI preferences:', error);
    return null;
  }
};

export const getConversationAnalytics = async (userId: string, days: number = 30): Promise<ConversationAnalytics[]> => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('conversation_analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      mood_distribution: typeof item.mood_distribution === 'string' 
        ? JSON.parse(item.mood_distribution) 
        : item.mood_distribution || {},
      topics_discussed: Array.isArray(item.topics_discussed) 
        ? item.topics_discussed 
        : (typeof item.topics_discussed === 'string' ? JSON.parse(item.topics_discussed) : [])
    }));
  } catch (error) {
    console.error('Error fetching conversation analytics:', error);
    return [];
  }
};

// Export enhanced learning functions
export const getUserLearningData = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_learning_data')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching learning data:', error);
    return [];
  }
};

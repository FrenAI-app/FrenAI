
import { supabase } from '@/lib/supabaseClient';

export interface SentimentResult {
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'angry' | 'anxious';
  score: number;
  confidence: number;
}

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

// Enhanced sentiment analysis using FrenAI
export const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
  try {
    console.log('Analyzing sentiment with FrenAI for:', text.substring(0, 50));
    
    // Call FrenAI sentiment analysis endpoint
    const { data, error } = await supabase.functions.invoke('sentiment-analysis', {
      body: { text }
    });

    if (error) {
      console.error('FrenAI sentiment analysis error:', error);
      return fallbackSentimentAnalysis(text);
    }

    if (data && data.mood && data.score !== undefined) {
      console.log('FrenAI sentiment result:', data);
      return {
        mood: data.mood,
        score: data.score,
        confidence: data.confidence || 0.7
      };
    }

    return fallbackSentimentAnalysis(text);
  } catch (error) {
    console.error('Error in FrenAI sentiment analysis:', error);
    return fallbackSentimentAnalysis(text);
  }
};

// Fallback sentiment analysis for when FrenAI is unavailable
const fallbackSentimentAnalysis = (text: string): SentimentResult => {
  const lowerText = text.toLowerCase();
  
  // Enhanced keyword-based sentiment analysis
  const sentimentKeywords = {
    happy: ['happy', 'joy', 'excited', 'love', 'amazing', 'wonderful', 'great', 'awesome', 'fantastic', 'brilliant', 'perfect', 'excellent'],
    sad: ['sad', 'down', 'depressed', 'upset', 'crying', 'tears', 'horrible', 'awful', 'terrible', 'worst', 'disappointed'],
    angry: ['angry', 'mad', 'furious', 'rage', 'hate', 'annoyed', 'frustrated', 'irritated', 'pissed', 'outraged'],
    anxious: ['anxious', 'worried', 'nervous', 'scared', 'fear', 'stressed', 'panic', 'overwhelmed', 'concerned', 'uneasy'],
    excited: ['excited', 'thrilled', 'pumped', 'energetic', 'enthusiastic', 'eager', 'can\'t wait', 'amazing', 'incredible']
  };

  let maxScore = 0;
  let detectedMood: SentimentResult['mood'] = 'neutral';
  
  Object.entries(sentimentKeywords).forEach(([mood, keywords]) => {
    const score = keywords.reduce((acc, keyword) => {
      const count = (lowerText.match(new RegExp(keyword, 'g')) || []).length;
      return acc + count;
    }, 0);
    
    if (score > maxScore) {
      maxScore = score;
      detectedMood = mood as SentimentResult['mood'];
    }
  });

  // Calculate confidence based on keyword matches and text length
  const confidence = Math.min(maxScore / Math.max(text.split(' ').length / 10, 1), 1);
  
  return {
    mood: detectedMood,
    score: maxScore,
    confidence: Math.max(confidence, 0.3) // Minimum confidence
  };
};

// Enhanced personalized advice using FrenAI learning data
export const getPersonalizedAdvice = async (mood: string, userInsights: UserInsight[]): Promise<string> => {
  try {
    // Analyze user insights for personalized advice
    const personalityInsights = userInsights.filter(i => i.insight_type === 'personality');
    const preferenceInsights = userInsights.filter(i => i.insight_type === 'preference');
    
    let advice = '';
    
    switch (mood) {
      case 'sad':
        if (personalityInsights.some(i => i.insight_key.includes('introvert'))) {
          advice = "I notice you might prefer some quiet time. Would you like to talk about what's bothering you, or would you prefer a gentle distraction?";
        } else {
          advice = "It seems like you're feeling down. Sometimes talking about it helps - I'm here to listen.";
        }
        break;
      
      case 'anxious':
        if (preferenceInsights.some(i => JSON.stringify(i.insight_value).includes('meditation'))) {
          advice = "Since you've mentioned enjoying meditation before, maybe some breathing exercises could help right now?";
        } else {
          advice = "When anxiety hits, focusing on what you can control often helps. What's one small thing you could do right now?";
        }
        break;
        
      case 'excited':
        advice = "Your excitement is contagious! I love seeing you this enthusiastic. What's got you so pumped up?";
        break;
        
      case 'angry':
        advice = "I can sense your frustration. It's totally valid to feel this way. Want to talk through what happened?";
        break;
        
      case 'happy':
        advice = "Your positive energy is amazing! I'd love to hear what's making you feel so good today.";
        break;
        
      default:
        advice = "How are you feeling today? I'm here to chat about whatever's on your mind.";
    }
    
    return advice;
  } catch (error) {
    console.error('Error generating personalized advice:', error);
    return "I'm here to listen and chat about whatever's on your mind.";
  }
};

// Enhanced mood detection with FrenAI learning patterns
export const detectMoodPatterns = async (userId: string): Promise<{
  dominantMood: string;
  moodTrends: Record<string, number>;
  recommendations: string[];
}> => {
  try {
    // Get recent mood data from conversation history
    const { data: messages, error } = await supabase
      .from('messages')
      .select('mood, created_at')
      .eq('user_id', userId)
      .not('mood', 'is', null)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    const moodCounts: Record<string, number> = {};
    const recommendations: string[] = [];
    
    messages?.forEach(message => {
      if (message.mood) {
        moodCounts[message.mood] = (moodCounts[message.mood] || 0) + 1;
      }
    });

    const dominantMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

    // Generate FrenAI-powered recommendations based on patterns
    if (dominantMood === 'sad') {
      recommendations.push("I notice you've been feeling down lately. Would you like to explore some mood-lifting activities?");
    } else if (dominantMood === 'anxious') {
      recommendations.push("You seem to experience anxiety sometimes. I can help you develop coping strategies if you'd like.");
    } else if (dominantMood === 'happy') {
      recommendations.push("You've been in great spirits! Let's keep this positive momentum going.");
    }

    return {
      dominantMood,
      moodTrends: moodCounts,
      recommendations
    };
  } catch (error) {
    console.error('Error detecting mood patterns:', error);
    return {
      dominantMood: 'neutral',
      moodTrends: {},
      recommendations: ["I'm here to support you through all your moods and feelings."]
    };
  }
};

// FrenAI learning integration for sentiment analysis improvements
export const improveSentimentAccuracy = async (userId: string, actualMood: string, predictedMood: string, text: string): Promise<void> => {
  try {
    // Save learning data to improve FrenAI's sentiment analysis
    const { error } = await supabase
      .from('ai_learning_data')
      .insert({
        user_id: userId,
        interaction_type: 'correction',
        data: {
          text_sample: text.substring(0, 200),
          predicted_mood: predictedMood,
          actual_mood: actualMood,
          correction_timestamp: new Date().toISOString()
        },
        confidence_score: 0.9,
        applied: false
      });

    if (error) throw error;
    console.log('FrenAI sentiment learning data saved for user:', userId);
  } catch (error) {
    console.error('Error saving sentiment learning data:', error);
  }
};

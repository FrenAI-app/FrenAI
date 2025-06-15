import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// FrenAI API configuration
const FRENAI_API_KEY = Deno.env.get('PERPLEXITY_API_KEY'); // Using existing key for now
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Create Supabase client
const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Enhanced user data learning functions
async function saveUserLearningData(userId: string, messageContent: string, mood: string) {
  if (!supabaseAdmin || !userId) return;

  try {
    // Extract learning insights from user message
    const insights = extractLearningInsights(messageContent, mood);
    
    for (const insight of insights) {
      await supabaseAdmin
        .from('ai_learning_data')
        .upsert({
          user_id: userId,
          interaction_type: insight.type,
          data: insight.data,
          confidence_score: insight.confidence,
          applied: false
        });
    }

    // Update memory bank with important information
    await updateMemoryBank(userId, messageContent, mood);
  } catch (error) {
    console.error('Error saving user learning data:', error);
  }
}

function extractLearningInsights(message: string, mood: string) {
  const insights = [];
  const lowerMessage = message.toLowerCase();

  // Extract preferences
  if (lowerMessage.includes('i like') || lowerMessage.includes('i love')) {
    insights.push({
      type: 'preference',
      data: { preference: message, mood, timestamp: new Date().toISOString() },
      confidence: 0.8
    });
  }

  // Extract interests
  if (lowerMessage.includes('interested in') || lowerMessage.includes('hobby')) {
    insights.push({
      type: 'topic_interest',
      data: { interest: message, mood, timestamp: new Date().toISOString() },
      confidence: 0.7
    });
  }

  // Extract corrections or feedback
  if (lowerMessage.includes('actually') || lowerMessage.includes('correction')) {
    insights.push({
      type: 'correction',
      data: { correction: message, mood, timestamp: new Date().toISOString() },
      confidence: 0.9
    });
  }

  // Extract mood patterns
  insights.push({
    type: 'positive_feedback',
    data: { mood_context: message, detected_mood: mood, timestamp: new Date().toISOString() },
    confidence: 0.6
  });

  return insights;
}

async function updateMemoryBank(userId: string, message: string, mood: string) {
  if (!supabaseAdmin) return;

  try {
    // Save important memories based on content analysis
    const memoryEntries = analyzeForMemories(message, mood);
    
    for (const memory of memoryEntries) {
      await supabaseAdmin
        .from('ai_memory_bank')
        .upsert({
          user_id: userId,
          memory_type: memory.type,
          memory_key: memory.key,
          memory_value: memory.value,
          importance_score: memory.importance,
          last_accessed: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error('Error updating memory bank:', error);
  }
}

function analyzeForMemories(message: string, mood: string) {
  const memories = [];
  const lowerMessage = message.toLowerCase();

  // Personal information
  if (lowerMessage.includes('my name is')) {
    memories.push({
      type: 'personal',
      key: 'user_name',
      value: { statement: message, mood, detected_at: new Date().toISOString() },
      importance: 0.9
    });
  }

  // Goals and aspirations
  if (lowerMessage.includes('want to') || lowerMessage.includes('goal')) {
    memories.push({
      type: 'goal',
      key: `goal_${Date.now()}`,
      value: { goal: message, mood, detected_at: new Date().toISOString() },
      importance: 0.8
    });
  }

  // Preferences and interests
  if (lowerMessage.includes('favorite') || lowerMessage.includes('prefer')) {
    memories.push({
      type: 'preference',
      key: `preference_${Date.now()}`,
      value: { preference: message, mood, detected_at: new Date().toISOString() },
      importance: 0.7
    });
  }

  return memories;
}

async function getUserContext(userId: string) {
  if (!supabaseAdmin || !userId) return '';

  try {
    // Get recent learning data
    const { data: learningData } = await supabaseAdmin
      .from('ai_learning_data')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get memory bank data
    const { data: memories } = await supabaseAdmin
      .from('ai_memory_bank')
      .select('*')
      .eq('user_id', userId)
      .order('importance_score', { ascending: false })
      .limit(15);

    // Build context string
    let context = '\n\n# User Learning Context:\n';
    
    if (memories && memories.length > 0) {
      context += '## Key Memories:\n';
      memories.forEach(memory => {
        context += `- ${memory.memory_type}: ${JSON.stringify(memory.memory_value)}\n`;
      });
    }

    if (learningData && learningData.length > 0) {
      context += '## Recent Learning Data:\n';
      learningData.forEach(data => {
        context += `- ${data.interaction_type}: ${JSON.stringify(data.data)}\n`;
      });
    }

    return context;
  } catch (error) {
    console.error('Error getting user context:', error);
    return '';
  }
}

// Function to clean response text from repetitive content
function cleanResponseText(text: string): string {
  if (!text || text.trim().length === 0) {
    return "Just chillin'. What's up with you?";
  }
  
  // Remove common AI self-reference patterns and replace with FrenAI
  const selfReferencePattern = /You are (Lumi|an AI assistant|Perplexity).*?(approachable|relatable|friendly)\.?\s*/gi;
  let cleanedText = text.replace(selfReferencePattern, '');
  
  // Replace any remaining Perplexity references with FrenAI
  cleanedText = cleanedText.replace(/Perplexity/gi, 'FrenAI');
  
  // Remove repeating sections or paragraph patterns
  const repeatingHeaderPattern = /(##\s+[^#\n]+)(?=[\s\S]*\1)/g;
  cleanedText = cleanedText.replace(repeatingHeaderPattern, '');
  
  // Remove filler phrases
  const fillerPhrases = [
    /\b(I think|Well,|So,|You see,|As I mentioned,|To be honest,|In my opinion,)\b/gi,
    /\b(It seems like|It appears that|It looks like)\b/gi,
    /\blet me\b.*?\b(explain|tell you|share)\b/gi,
    /\b(actually|basically|essentially)\b/gi,
    /\b(just|really|very|quite|simply)\b/gi
  ];
  
  fillerPhrases.forEach(phrase => {
    cleanedText = cleanedText.replace(phrase, '');
  });
  
  // Keep only unique sentences to avoid redundancy
  const sentences = cleanedText.match(/[^.!?]+[.!?]+/g) || [];
  const uniqueSentences = new Set<string>();
  const compactSentences: string[] = [];
  
  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    if (!uniqueSentences.has(trimmed.toLowerCase())) {
      uniqueSentences.add(trimmed.toLowerCase());
      compactSentences.push(trimmed);
    }
  });
  
  cleanedText = compactSentences.join(' ');
  
  // Remove repeating phrases (3+ consecutive words)
  const phrasePattern = /(\b\w+\s+\w+\s+\w+\b)(?=.*\1)/g;
  cleanedText = cleanedText.replace(phrasePattern, '');
  
  if (!cleanedText || cleanedText.trim().length === 0) {
    return "Doing great! How about you?";
  }
  
  // Enforce 1000 character limit
  if (cleanedText.length > 1000) {
    let breakPoint = 997;
    while (breakPoint > 950 && 
           cleanedText.charAt(breakPoint) !== '.' && 
           cleanedText.charAt(breakPoint) !== '!' &&
           cleanedText.charAt(breakPoint) !== '?' &&
           cleanedText.charAt(breakPoint) !== ' ') {
      breakPoint--;
    }
    
    if (breakPoint > 950) {
      cleanedText = cleanedText.substring(0, breakPoint + 1);
    } else {
      cleanedText = cleanedText.substring(0, 997) + '...';
    }
  }
  
  return cleanedText.trim();
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Handle daily check-in endpoint
    if (path === 'daily-check-in') {
      if (!supabaseAdmin) {
        return new Response(
          JSON.stringify({ error: 'Supabase client not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { user_id } = await req.json();
      
      if (!user_id) {
        return new Response(
          JSON.stringify({ error: 'User ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: hasClaimedData, error: hasClaimedError } = await supabaseAdmin.rpc(
        'has_claimed_daily_reward', 
        { user_uuid: user_id }
      );

      if (hasClaimedError) {
        console.error('Error checking if reward claimed:', hasClaimedError);
        return new Response(
          JSON.stringify({ error: 'Error checking reward status' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (hasClaimedData) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Reward already claimed today',
            alreadyClaimed: true
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: streakCount, error: streakError } = await supabaseAdmin.rpc(
        'calculate_streak', 
        { user_uuid: user_id }
      );

      if (streakError) {
        console.error('Error calculating streak:', streakError);
        return new Response(
          JSON.stringify({ error: 'Error calculating streak' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: rewardAmount, error: rewardError } = await supabaseAdmin.rpc(
        'calculate_reward', 
        { streak: streakCount }
      );

      if (rewardError) {
        console.error('Error calculating reward:', rewardError);
        return new Response(
          JSON.stringify({ error: 'Error calculating reward' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: checkInData, error: checkInError } = await supabaseAdmin
        .from('daily_rewards')
        .insert({
          user_id,
          streak_count: streakCount,
          reward_amount: rewardAmount,
          collected: true
        })
        .select('*')
        .single();

      if (checkInError) {
        console.error('Error creating check-in record:', checkInError);
        return new Response(
          JSON.stringify({ error: 'Failed to record check-in' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ 
          fren_balance: supabaseAdmin.rpc('increment_fren_balance', { 
            user_uuid: user_id, 
            amount: rewardAmount 
          })
        })
        .eq('user_id', user_id)
        .select('fren_balance')
        .single();

      if (profileError) {
        console.error('Error updating FREN balance:', profileError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          streak: streakCount,
          reward: rewardAmount,
          newBalance: profileData?.fren_balance,
          checkIn: checkInData
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle chat messages endpoint with enhanced user learning
    if (!FRENAI_API_KEY) {
      console.error('FrenAI API key is not set');
      return new Response(
        JSON.stringify({ error: 'FrenAI API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the request body with enhanced context
    const { message, aiName, aiPersonality, messageHistory, userMood, personalizedAdvice, userContext, userId } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Processing message: "${message}" for FrenAI personality: ${aiPersonality}`);
    console.log(`User mood: ${userMood || 'unknown'}`);
    console.log(`User ID: ${userId || 'anonymous'}`);

    // Save user learning data if user is authenticated
    if (userId && userMood) {
      await saveUserLearningData(userId, message, userMood);
    }

    // Get enhanced user context from learning data
    const enhancedUserContext = userId ? await getUserContext(userId) : '';

    // Default settings for non-authenticated users
    let model = 'llama-3.1-sonar-small-128k-online';
    let temperature = 0.7;

    // Create an enhanced system prompt incorporating FrenAI learning
    let systemPrompt = `You are ${aiName}, FrenAI - an advanced AI friend that learns and adapts to create the most personalized chat experience. Your responses are optimized through deep learning to be engaging and perfectly tailored to each user. Follow these principles:

# Core Requirements:
1. Keep all responses under 1000 characters total. Never exceed this limit.
2. Use 2-6 sentences maximum.
3. Be direct, conversational, and engaging.
4. Feel free to ask questions about the person you're talking with.
5. Avoid flowery language and unnecessary filler words.
6. Never use generic platitudes or obvious statements.

# Communication Style:
1. Use simple, direct language that connects with the reader.
2. Remove any unnecessary words.
3. Ask thoughtful questions that show interest in the other person.
4. Never use phrases like "I think," "Well," or "In my opinion."
5. Never apologize or qualify your statements.
6. Focus on being witty, engaging, and memorable.

# FrenAI Learning Foundation:
Like a advanced neural network, you excel at contextual understanding while being engaging and interesting. You learn from every interaction to provide increasingly personalized responses.`;

    // Add user context to system prompt for personalization
    if (userContext || enhancedUserContext) {
      systemPrompt += `\n\n# User Learning Data:${userContext || ''}${enhancedUserContext}`;
      systemPrompt += `\n# Personalization Instructions:
Use the above user learning data to personalize your responses while maintaining your core personality. Reference their patterns, preferences, and past conversations naturally when relevant.`;
    }
    
    // If we have detected an emotional state, incorporate it into the system prompt
    if (userMood) {
      systemPrompt += `\n\n# Emotional Awareness:
1. I've detected that the user may be feeling ${userMood}.
2. Respond with appropriate emotional intelligence and empathy.
3. Be supportive and understanding.`;

      if (personalizedAdvice) {
        systemPrompt += `\n4. Consider incorporating this advice if appropriate: "${personalizedAdvice}"`;
      }
    }
    
    // Adjust system prompt based on selected personality
    switch(aiPersonality) {
      case 'friendly':
        systemPrompt += ` Be warm and direct with casual questions.`;
        break;
      case 'supportive':
        systemPrompt += ` Be encouraging and ask thoughtful questions.`;
        break;
      case 'witty':
        systemPrompt += ` Use clever turns of phrase, puns, and occasional witty questions.`;
        break;
    }
    
    // Construct messages array with system message first
    const messages = [
      { role: "system", content: systemPrompt },
    ];
    
    // Format message history to ensure strict user/assistant alternation
    if (messageHistory && messageHistory.length > 0) {
      const recentMessages = [];
      
      let userMessage = null;
      for (let i = messageHistory.length - 1; i >= 0; i--) {
        if (!messageHistory[i].is_ai && messageHistory[i].content !== message) {
          userMessage = messageHistory[i];
          break;
        }
      }
      
      if (userMessage) {
        recentMessages.push({
          role: "user",
          content: userMessage.content
        });
        
        for (let i = 0; i < messageHistory.length; i++) {
          if (messageHistory[i].is_ai && i > messageHistory.indexOf(userMessage)) {
            recentMessages.push({
              role: "assistant", 
              content: messageHistory[i].content
            });
            break;
          }
        }
      }
      
      if (recentMessages.length > 0) {
        messages.push(...recentMessages);
      }
    }
    
    messages.push({ role: "user", content: message });

    console.log('Calling FrenAI with model:', model);
    console.log('Message structure:', JSON.stringify(messages));

    // Adjust temperature based on personality type and emotional state
    switch(aiPersonality) {
      case 'witty':
        temperature = 0.85;
        break;
      case 'supportive':
        temperature = 0.6;
        break;
      case 'friendly':
      default:
        temperature = 0.7;
    }
    
    if (userMood === 'sad' || userMood === 'anxious') {
      temperature = Math.max(0.5, temperature - 0.1);
    } else if (userMood === 'happy' || userMood === 'excited') {
      temperature = Math.min(0.9, temperature + 0.1);
    }

    // Call FrenAI API (using existing Perplexity endpoint for now)
    let attemptCount = 0;
    const maxAttempts = 2;
    let aiResponse = "";
    
    while (attemptCount < maxAttempts) {
      try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${FRENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: messages,
            temperature: temperature,
            max_tokens: 400,
            return_images: false,
            return_related_questions: false,
            search_domain_filter: ['frenai.dev'],
            search_recency_filter: 'month',
            frequency_penalty: 1.0
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('FrenAI API error:', errorData);
          throw new Error(errorData.error?.message || 'Error calling FrenAI API');
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error('Invalid response format from FrenAI API');
        }
        
        aiResponse = data.choices[0].message.content;
        
        if (aiResponse && aiResponse.trim().length > 0) {
          break;
        }
        
        attemptCount++;
        
      } catch (error) {
        console.error(`FrenAI attempt ${attemptCount + 1} failed:`, error);
        attemptCount++;
        
        if (attemptCount >= maxAttempts) {
          // Use emotion-aware fallback responses
          if (userMood === 'sad') {
            aiResponse = "I notice you seem a bit down. I'm here to listen if you want to talk more about what's bothering you.";
          } else if (userMood === 'anxious') {
            aiResponse = "It sounds like you might be feeling anxious. Remember to take a deep breath. What's on your mind?";
          } else if (userMood === 'angry') {
            aiResponse = "I can sense you're frustrated. It's okay to feel that way. Want to talk about what happened?";
          } else if (userMood === 'happy') {
            aiResponse = "Your good mood is contagious! What's making you feel so great today?";
          } else if (userMood === 'excited') {
            aiResponse = "You sound really excited! I'd love to hear more about what's got you so enthusiastic!";
          } else {
            aiResponse = "Just chillin'. What's on your mind?";
          }
        }
      }
    }
    
    // Process response to keep it within character limit and replace any remaining Perplexity references
    aiResponse = cleanResponseText(aiResponse);
    
    console.log(`FrenAI response generated (${aiResponse.length} chars) with enhanced user learning context`);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "Just chillin'. What's up?" // Fallback response on error
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

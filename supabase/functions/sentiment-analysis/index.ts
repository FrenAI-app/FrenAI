
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Hugging Face API configuration
const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_API_KEY');
const HUGGING_FACE_MODEL = "finiteautomata/bertweet-base-sentiment-analysis";

// Create Supabase client for edge function
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, userId } = await req.json();
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing sentiment analysis for text: "${text}"`);

    // Call Hugging Face API for sentiment analysis
    const response = await fetch(`https://api-inference.huggingface.co/models/${HUGGING_FACE_MODEL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: text })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Hugging Face API error:', error);
      throw new Error(`Hugging Face API error: ${error}`);
    }

    const result = await response.json();
    console.log('Sentiment analysis result:', result);

    // Process the results to get the sentiment with highest score
    let topSentiment = { label: 'NEU', score: 0 };
    
    if (Array.isArray(result) && result.length > 0) {
      // Find the sentiment with the highest score
      for (const prediction of result[0]) {
        if (prediction.score > topSentiment.score) {
          topSentiment = prediction;
        }
      }
    }

    // Map Hugging Face sentiment labels to our application's mood labels
    const sentimentToMoodMap = {
      'POS': 'happy',
      'NEG': 'sad',
      'NEU': 'neutral'
    };

    // Convert to our application's mood format
    const mood = sentimentToMoodMap[topSentiment.label] || 'neutral';
    
    // Store the analysis result in the database if userId is provided
    if (userId) {
      const { error: dbError } = await supabase
        .from('emotional_tracking')
        .insert({
          user_id: userId,
          text: text,
          sentiment_label: topSentiment.label,
          sentiment_score: topSentiment.score,
          detected_mood: mood,
          timestamp: new Date().toISOString()
        });

      if (dbError) {
        console.error('Error storing sentiment analysis:', dbError);
      }
    }

    // Return the sentiment analysis result
    return new Response(
      JSON.stringify({ 
        sentiment: topSentiment.label,
        score: topSentiment.score,
        mood: mood
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

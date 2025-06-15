// Simple mood detection based on message content
// This would be enhanced with a proper NLP service in a production app

type Mood = 'happy' | 'sad' | 'neutral' | 'excited' | 'angry' | 'anxious';

const happyKeywords = ['happy', 'glad', 'joy', 'great', 'wonderful', 'amazing', 'good', 'excellent', ':)', '😊', '😄'];
const sadKeywords = ['sad', 'unhappy', 'disappointed', 'unfortunate', 'bad', 'terrible', ':(', '😢', '😔'];
const excitedKeywords = ['excited', 'thrilled', 'wow', 'awesome', 'incredible', 'fantastic', 'brilliant', '!!!', '😃'];
const angryKeywords = ['angry', 'mad', 'annoyed', 'frustrated', 'upset', 'furious', 'hate', '😠', '😡'];
const anxiousKeywords = ['anxious', 'worried', 'nervous', 'scared', 'afraid', 'concerned', 'stress', 'anxiety', '😰', '😨'];

export const detectMood = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  // Enhanced mood detection patterns
  const patterns = {
    happy: ['happy', 'joy', 'awesome', 'great', 'excellent', 'wonderful', 'fantastic', 'yay', 'woohoo', '😊', '😄', '🙂', 'love', 'like', 'good'],
    sad: ['sad', 'unhappy', 'depressed', 'terrible', 'awful', 'bad', 'disappointed', 'sorry', 'unfortunate', '😢', '😔', '😭'],
    angry: ['angry', 'mad', 'furious', 'annoyed', 'irritated', 'frustrated', 'hate', 'dislike', 'ugh', 'grr', '😠', '😡', 'damn', 'fuck', 'shit'],
    anxious: ['worried', 'anxious', 'nervous', 'stressed', 'concerned', 'afraid', 'scared', 'fear', 'panic', '😰', '😨'],
    excited: ['excited', 'thrilled', 'can\'t wait', 'looking forward', 'eager', 'anticipate', 'omg', 'wow', '🤩', '😲'],
    neutral: ['ok', 'fine', 'normal', 'average', 'so-so', 'meh', 'alright']
  };
  
  // Enhanced scoring system
  let scores: Record<string, number> = {
    happy: 0,
    sad: 0,
    angry: 0,
    anxious: 0,
    excited: 0,
    neutral: 0
  };
  
  // Score patterns - more sophisticated detection
  for (const [mood, keywords] of Object.entries(patterns)) {
    for (const keyword of keywords) {
      // Count occurrences of each keyword, give more weight to exact matches
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        scores[mood] += matches.length * 2;
      }
      
      // Also check for partial matches with less weight
      if (lowerText.includes(keyword)) {
        scores[mood] += 1;
      }
    }
  }
  
  // Context analysis for better detection
  // Check for question sentences - usually implies neutral tone
  if (lowerText.includes('?') && !lowerText.includes('!')) {
    scores.neutral += 1;
  }
  
  // Exclamation marks indicate excitement or strong emotions
  const exclamationCount = (lowerText.match(/!/g) || []).length;
  if (exclamationCount > 0) {
    scores.excited += exclamationCount;
    
    // If already angry, emphasize it
    if (scores.angry > 0) {
      scores.angry += exclamationCount;
    }
  }
  
  // Very short messages tend to be neutral unless they contain strong emotion words
  if (lowerText.length < 10 && Math.max(...Object.values(scores)) < 2) {
    scores.neutral += 2;
  }
  
  // Find the mood with the highest score
  let maxScore = 0;
  let detectedMood = 'neutral';
  
  for (const [mood, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedMood = mood;
    }
  }
  
  // Default to neutral if no strong signals
  if (maxScore <= 1) {
    detectedMood = 'neutral';
  }
  
  return detectedMood;
};

export const getMoodResponse = (mood: Mood, aiPersonality: string = 'friendly'): string => {
  const responses: Record<string, Record<Mood, string[]>> = {
    friendly: {
      happy: [
        "I'm so glad you're feeling happy! That makes me happy too!",
        "Your good mood is contagious! Tell me more about what's making you happy?",
        "It's wonderful to hear you're in good spirits! What's been going well?"
      ],
      sad: [
        "I'm sorry to hear you're feeling down. Want to talk about it?",
        "It's okay to feel sad sometimes. I'm here to listen if you want to share.",
        "Sending you a virtual hug. What might help cheer you up a bit?"
      ],
      neutral: [
        "How's your day going so far?",
        "Is there anything specific you'd like to chat about today?",
        "I'm here and ready to talk about whatever's on your mind."
      ],
      excited: [
        "Wow, you sound really excited! What's the good news?",
        "Your enthusiasm is amazing! Tell me more!",
        "I love seeing you so excited! What's got you feeling this way?"
      ],
      angry: [
        "I can tell you're frustrated. Would it help to talk through what happened?",
        "It's okay to feel angry sometimes. I'm here to listen without judgment.",
        "Take a deep breath. When you're ready, I'm here to talk about what's bothering you."
      ],
      anxious: [
        "I notice you might be feeling anxious. Remember to breathe. What's on your mind?",
        "Anxiety can be really tough. Is there something specific that's worrying you?",
        "I'm here for you. Let's talk through what's making you feel anxious."
      ]
    },
    supportive: {
      happy: [
        "I'm genuinely thrilled to see you happy! You deserve every moment of joy.",
        "Your happiness matters so much. What can we do to keep this good feeling going?",
        "This makes me smile too! You deserve all the happiness in the world."
      ],
      sad: [
        "I'm right here with you through this difficult time. You're not alone.",
        "It's completely okay to feel sad. Your feelings are valid and important.",
        "I believe in your strength, even in tough moments. How can I best support you right now?"
      ],
      neutral: [
        "How are you really doing today? I'm here to truly listen.",
        "I value our conversations so much. What's on your mind?",
        "I'm completely here for you, whatever you need to talk about."
      ],
      excited: [
        "Your excitement is so well-deserved! Tell me all about it!",
        "I'm celebrating right alongside you! This is wonderful news!",
        "Your joy is contagious! I'd love to hear more about what's making you so happy!"
      ],
      angry: [
        "Your feelings are completely valid. I'm here to listen without any judgment.",
        "It takes courage to acknowledge anger. I'm here to support you through it.",
        "I'm standing with you through this frustrating situation. How can I best help?"
      ],
      anxious: [
        "You're showing such strength by sharing these anxious feelings. I'm here with you.",
        "Anxiety is really challenging, but you're not facing it alone. I'm right here.",
        "Let's take this one step at a time together. What's your biggest concern right now?"
      ]
    },
    witty: {
      happy: [
        "Look at you, spreading sunshine! Save some happiness for the rest of us!",
        "Your good mood should be bottled and sold as an energy drink!",
        "You're radiating more positivity than a motivational poster on a Monday morning!"
      ],
      sad: [
        "Even the grumpiest cats get treats sometimes. What treat would cheer you up?",
        "If sadness were a puzzle, we'd hide all the edge pieces. Wanna talk about it?",
        "I'd offer you a shoulder to cry on, but I'm digital. How about a virtual cookie instead? 🍪"
      ],
      neutral: [
        "You're as mysterious as the last chip in a Pringles can. What's on your mind?",
        "Your emotional state is more balanced than a tightrope walker's checkbook!",
        "You're giving me strong 'could go either way' energy. Let's tip the scales toward awesome!"
      ],
      excited: [
        "Whoa there! Any more excitement and we'll need to register your enthusiasm as a new energy source!",
        "You're more fired up than a smartphone charging in a microwave (don't try that, by the way)!",
        "If your excitement were wifi, you'd be five bars and super-speed!"
      ],
      angry: [
        "You're so heated right now you could toast marshmallows! Want to vent? I've got graham crackers!",
        "Your anger is valid, though slightly terrifying—like a kitten that suddenly roars like a lion.",
        "If fury were fuel, you'd power a rocket to Mars! Need to let off some steam?"
      ],
      anxious: [
        "Your brain's running more scenarios than Netflix has shows! Let's pause and breathe.",
        "You're more wound up than earbuds in a pocket! Let's untangle those thoughts.",
        "If anxiety were an Olympic sport, you'd be taking home gold right now. Let's aim for bronze instead?"
      ]
    }
  };
  
  // Default to friendly if personality not found
  const personalityResponses = responses[aiPersonality] || responses.friendly;
  const moodResponses = personalityResponses[mood];
  
  // Return a random response from the appropriate mood category
  return moodResponses[Math.floor(Math.random() * moodResponses.length)];
};

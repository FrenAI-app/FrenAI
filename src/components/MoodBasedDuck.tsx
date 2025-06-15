
import React, { useEffect, useState } from 'react';
import { useChat, MessageMood } from '@/context/ChatContext';

interface MoodEventDetail {
  mood: MessageMood;
  score?: number;
}

const MoodBasedDuck: React.FC = () => {
  const { messages, lastDetectedMood } = useChat();
  const [currentMood, setCurrentMood] = useState<MessageMood>('neutral');
  const [sentimentScore, setSentimentScore] = useState<number>(0);
  
  // INSTANT mood dispatch function
  const dispatchMoodEvent = (mood: MessageMood, score?: number) => {
    // Create event immediately
    const event = new CustomEvent<MoodEventDetail>('userMoodChanged', { 
      detail: { 
        mood: mood,
        score: score
      },
      bubbles: true,
      cancelable: false
    });
    
    // Dispatch immediately - no delays
    document.dispatchEvent(event);
    console.log(`MoodBasedDuck: INSTANT mood dispatch: ${mood} (score: ${score})`);
  };
  
  // Track user's mood based on their latest message - INSTANT processing
  useEffect(() => {
    if (messages.length > 0) {
      // Find the most recent user message
      const userMessages = messages.filter(msg => msg.sender === 'user');
      if (userMessages.length > 0) {
        const latestMessage = userMessages[userMessages.length - 1];
        if (latestMessage.mood && latestMessage.mood !== currentMood) {
          setCurrentMood(latestMessage.mood);
          setSentimentScore(latestMessage.sentimentScore || 0);
          
          // INSTANT dispatch - highest priority
          dispatchMoodEvent(latestMessage.mood, latestMessage.sentimentScore);
        }
      }
    }
  }, [messages, currentMood]);
  
  // Also listen for the lastDetectedMood changes from context - INSTANT processing
  useEffect(() => {
    if (lastDetectedMood && lastDetectedMood !== currentMood) {
      setCurrentMood(lastDetectedMood);
      
      // INSTANT dispatch from context changes
      dispatchMoodEvent(lastDetectedMood);
    }
  }, [lastDetectedMood, currentMood]);
  
  return null; // This is a non-visual component that just processes mood data
};

export default MoodBasedDuck;

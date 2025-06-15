import { useState, useRef } from 'react';
import { DuckEmotion } from './DuckEmotions';

export const useDuckBehavior = () => {
  const [emotion, setEmotion] = useState<DuckEmotion>('happy');
  
  const emotionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userMoodActiveRef = useRef<boolean>(false);

  // INSTANT user mood reaction - HIGHEST PRIORITY
  const reactToUserMood = (mood: string) => {
    console.log('Duck: INSTANT mood reaction to:', mood);
    
    // IMMEDIATELY clear any existing timeouts - user mood takes absolute priority
    if (emotionTimeoutRef.current) {
      clearTimeout(emotionTimeoutRef.current);
      emotionTimeoutRef.current = null;
    }
    
    // Mark that user mood is active to block other emotion changes
    userMoodActiveRef.current = true;
    
    // INSTANT emotion change based on user mood
    switch (mood) {
      case 'happy':
        setEmotion('happy');
        break;
      case 'sad':
        setEmotion('sad');
        break;
      case 'angry':
        setEmotion('surprised'); // Initial reaction
        setTimeout(() => {
          if (userMoodActiveRef.current) {
            setEmotion('love'); // Then show love to calm anger
          }
        }, 1500);
        break;
      case 'anxious':
        setEmotion('sad');
        break;
      case 'excited':
        setEmotion('laughing');
        break;
      case 'neutral':
        setEmotion('cool');
        break;
      default:
        setEmotion('happy');
        break;
    }
    
    // Keep user mood active for longer duration
    emotionTimeoutRef.current = setTimeout(() => {
      userMoodActiveRef.current = false;
      // Only change if no new user mood has been detected
      if (!userMoodActiveRef.current) {
        const neutralEmotions: DuckEmotion[] = ['happy', 'cool'];
        const randomEmotion = neutralEmotions[Math.floor(Math.random() * neutralEmotions.length)];
        setEmotion(randomEmotion);
      }
    }, 12000); // Extended duration for user mood priority
  };

  // Enhanced setEmotion that respects user mood priority
  const setEmotionWithPriority = (newEmotion: DuckEmotion) => {
    // Only allow emotion changes if user mood is not active
    if (!userMoodActiveRef.current) {
      setEmotion(newEmotion);
    } else {
      console.log('Duck: Emotion change blocked - user mood has priority');
    }
  };

  return {
    emotion,
    setEmotion: setEmotionWithPriority,
    reactToUserMood,
    emotionTimeoutRef,
    userMoodActiveRef
  };
};


import React from 'react';
import { motion } from 'framer-motion';

export type DuckEmotion = 'happy' | 'laughing' | 'cool' | 'sad' | 'angry' | 'love' | 'sleeping' | 'surprised';

interface DuckEmotionsProps {
  emotion: DuckEmotion;
  direction: 'left' | 'right';
}

const DuckEmotions: React.FC<DuckEmotionsProps> = ({ emotion, direction }) => {
  // Emoji mapping for each emotion
  const getEmoji = (emotion: DuckEmotion) => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'laughing': return '😄';
      case 'cool': return '😎';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'love': return '😍';
      case 'sleeping': return '😴';
      case 'surprised': return '😲';
      default: return '😊';
    }
  };

  // Position variants for different emotions
  const getPosition = (emotion: DuckEmotion) => {
    switch (emotion) {
      case 'love':
        return { top: '-25px', right: '-15px' };
      case 'angry':
        return { top: '-20px', left: '-20px' };
      case 'sleeping':
        return { top: '-15px', right: '0px' };
      default:
        return { top: '-20px', right: '-10px' };
    }
  };

  return (
    <motion.div
      key={`${emotion}-${Date.now()}`}
      initial={{ scale: 0, opacity: 0, y: 10 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: 0,
        transition: { 
          type: "spring", 
          stiffness: 500, 
          damping: 30,
          duration: 0.4
        }
      }}
      exit={{ 
        scale: 0, 
        opacity: 0,
        y: -10,
        transition: { duration: 0.2 }
      }}
      className="absolute pointer-events-none"
      style={{
        ...getPosition(emotion),
        fontSize: '24px',
        zIndex: 100,
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
      }}
    >
      <div className="relative">
        {getEmoji(emotion)}
      </div>
    </motion.div>
  );
};

export default DuckEmotions;

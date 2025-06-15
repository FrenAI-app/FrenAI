
import React, { useState } from 'react';
import { Clock, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import MessageReactions from './MessageReactions';

interface MessageProps {
  message: {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    mood?: string;
    audioUrl?: string;
  };
  aiName?: string;
  personalityColor?: string;
  renderAvatar?: (size: 'sm' | 'lg') => React.ReactNode;
  onAvatarClick?: () => void;
}

const Message = ({ message, aiName = 'Fren', personalityColor = 'text-purple-600', renderAvatar, onAvatarClick }: MessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  const isAI = message.sender === 'ai';
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const playAudio = async () => {
    if (!message.audioUrl) {
      setAudioError('No audio available');
      return;
    }
    
    if (audio) {
      audio.pause();
      setAudio(null);
      setIsPlaying(false);
      setAudioError(null);
      return;
    }
    
    try {
      const newAudio = new Audio(message.audioUrl);
      
      newAudio.onerror = () => {
        console.error('Audio playback error');
        setAudioError('Audio playback failed');
        setIsPlaying(false);
        setAudio(null);
      };
      
      newAudio.onended = () => {
        setIsPlaying(false);
        setAudio(null);
        setAudioError(null);
      };
      
      newAudio.onloadstart = () => {
        console.log('Audio loading started');
      };
      
      newAudio.oncanplay = () => {
        console.log('Audio can start playing');
      };
      
      await newAudio.play();
      setAudio(newAudio);
      setIsPlaying(true);
      setAudioError(null);
    } catch (error) {
      console.error('Audio play error:', error);
      setAudioError('Failed to play audio');
      setIsPlaying(false);
      setAudio(null);
    }
  };

  // User message (right side)
  if (!isAI) {
    return (
      <div className="flex justify-end items-start gap-3 mb-4 animate-slide-in-right">
        <div className="flex flex-col items-end max-w-[85%]">
          <div className="bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-3xl rounded-tr-lg px-5 py-3 shadow-lg">
            <p className={`${isMobile ? 'text-base leading-relaxed' : 'text-base leading-relaxed'} whitespace-pre-wrap break-words`}>
              {message.content}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-purple-600 flex items-center gap-1`}>
              <Clock className="h-3 w-3" />
              {formatTime(message.timestamp)}
            </span>
            {message.mood && (
              <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-purple-600 bg-purple-100/50 px-2 py-1 rounded-full capitalize backdrop-blur-sm`}>
                {message.mood}
              </span>
            )}
          </div>
        </div>
        <div className={`${isMobile ? 'w-9 h-9' : 'w-10 h-10'} flex items-center justify-center flex-shrink-0`}>
          {renderAvatar ? (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg border-2 border-white/20 overflow-hidden">
              {renderAvatar('sm')}
            </div>
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg border-2 border-white/20">
              {message.content.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    );
  }

  // AI message (left side)
  return (
    <div className="flex items-start gap-3 mb-4 animate-slide-in-left">
      <div 
        className={`${isMobile ? 'w-9 h-9' : 'w-10 h-10'} flex items-center justify-center flex-shrink-0 ${onAvatarClick ? 'cursor-pointer hover:scale-110 transition-transform duration-200 touch-manipulation' : ''}`}
        onClick={onAvatarClick}
      >
        {renderAvatar ? renderAvatar('sm') : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            {aiName.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex flex-col max-w-[85%]">
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl rounded-tl-lg px-5 py-3 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <span className={`${isMobile ? 'text-sm' : 'text-sm'} font-semibold ${personalityColor}`}>
              {aiName}
            </span>
            {message.audioUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={playAudio}
                className={`${isMobile ? 'h-7 w-7 p-1' : 'h-7 w-7 p-1'} hover:bg-white/20 touch-manipulation ${audioError ? 'text-red-500' : 'text-purple-600'}`}
                title={audioError || (isPlaying ? "Stop audio" : "Play audio")}
              >
                {isPlaying ? (
                  <VolumeX className={`${isMobile ? 'h-3 w-3' : 'h-3 w-3'}`} />
                ) : (
                  <Volume2 className={`${isMobile ? 'h-3 w-3' : 'h-3 w-3'}`} />
                )}
              </Button>
            )}
          </div>
          <p className={`${isMobile ? 'text-base leading-relaxed' : 'text-base leading-relaxed'} text-gray-800 whitespace-pre-wrap break-words`}>
            {message.content}
          </p>
          {audioError && (
            <p className="text-xs text-red-500 mt-1">{audioError}</p>
          )}
        </div>
        
        {/* Message Reactions */}
        <MessageReactions messageId={message.id} isAIMessage={true} />
        
        <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-purple-600 flex items-center gap-1 mt-1`}>
          <Clock className="h-3 w-3" />
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default Message;

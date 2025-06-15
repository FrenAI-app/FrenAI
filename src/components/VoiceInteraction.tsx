import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useChat } from '@/context/ChatContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface VoiceInteractionProps {
  onMessageSend?: (message: string) => void;
}

const VoiceInteraction: React.FC<VoiceInteractionProps> = ({ onMessageSend }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState('');
  const [audioResponse, setAudioResponse] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { personalitySettings } = useChat();
  const isMobile = useIsMobile();

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Start recording function
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Convert to base64 for sending to server
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(',')[1];
          if (base64Audio) {
            try {
              const { data, error } = await supabase.functions.invoke('speech-to-text', {
                body: { audio: base64Audio }
              });
              
              if (error) throw error;
              if (data && data.text) {
                setTranscript(data.text);
                if (onMessageSend) {
                  onMessageSend(data.text);
                }
              }
            } catch (error) {
              console.error('Error converting speech to text:', error);
              toast({
                title: "Speech recognition failed",
                description: "Could not process audio. Please try again.",
                variant: "destructive"
              });
            }
          }
        };
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice features.",
        variant: "destructive"
      });
    }
  };
  
  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks of the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  // Generate voice response from AI text
  const generateVoiceResponse = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text,
          voice: 'Roger' // Default voice for the duck
        }
      });
      
      if (error) throw error;
      
      if (data && data.audioContent) {
        setAudioResponse(`data:audio/mp3;base64,${data.audioContent}`);
      }
    } catch (error) {
      console.error('Error generating voice response:', error);
      toast({
        title: "Voice generation failed",
        description: "Could not generate voice response. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Play audio response
  const playAudioResponse = () => {
    if (audioResponse && audioRef.current) {
      audioRef.current.src = audioResponse;
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };
  
  // Stop audio playback
  const stopAudioPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        className={`rounded-full h-10 w-10 ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'} transition-all duration-300`}
        title={isRecording ? "Stop recording" : "Start recording"}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
        type="button"
      >
        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      
      {audioResponse && (
        <Button
          onClick={isPlaying ? stopAudioPlayback : playAudioResponse}
          className={`rounded-full h-10 w-10 ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'} transition-all duration-300`}
          title={isPlaying ? "Stop playing" : `Play ${personalitySettings.aiName}'s voice`}
          aria-label={isPlaying ? "Stop playing" : "Play voice response"}
          type="button"
        >
          {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      )}
      
      {transcript && !isMobile && (
        <span className="text-xs text-muted-foreground truncate max-w-[150px]">
          "{transcript}"
        </span>
      )}
    </div>
  );
};

export default VoiceInteraction;

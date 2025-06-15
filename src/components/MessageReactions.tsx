
import React, { useState, useEffect } from 'react';
import { Heart, ThumbsUp, Laugh, Frown, Angry, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { addReaction, removeReaction, getUserReactions, type MessageReaction } from '@/lib/messageReactions';
import { useUser } from '@/context/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface MessageReactionsProps {
  messageId: string;
  isAIMessage?: boolean;
}

const reactionIcons = {
  like: ThumbsUp,
  love: Heart,
  laugh: Laugh,
  sad: Frown,
  angry: Angry,
  wow: Zap
};

const reactionLabels = {
  like: 'Like',
  love: 'Love',
  laugh: 'Laugh',
  sad: 'Sad',
  angry: 'Angry',
  wow: 'Wow'
};

const MessageReactions: React.FC<MessageReactionsProps> = ({ messageId, isAIMessage }) => {
  const [userReactions, setUserReactions] = useState<MessageReaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { profile } = useUser();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (profile?.user_id) {
      loadUserReactions();
    }
  }, [messageId, profile?.user_id]);

  const loadUserReactions = async () => {
    if (!profile?.user_id) return;
    
    try {
      const reactions = await getUserReactions(profile.user_id, [messageId]);
      setUserReactions(reactions);
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  const handleReaction = async (reactionType: MessageReaction['reaction_type']) => {
    if (!profile?.user_id || loading) return;

    setLoading(true);
    try {
      const existingReaction = userReactions.find(r => r.reaction_type === reactionType);
      
      if (existingReaction) {
        // Remove reaction
        const success = await removeReaction(profile.user_id, messageId, reactionType);
        if (success) {
          setUserReactions(prev => prev.filter(r => r.reaction_type !== reactionType));
          toast({
            title: "Reaction removed",
            description: `Removed ${reactionLabels[reactionType]} reaction`,
          });
        }
      } else {
        // Add reaction
        const newReaction = await addReaction(profile.user_id, messageId, reactionType);
        if (newReaction) {
          setUserReactions(prev => [...prev, newReaction]);
          toast({
            title: "Reaction added",
            description: `Added ${reactionLabels[reactionType]} reaction`,
          });
        }
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Error",
        description: "Failed to update reaction",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Only show reactions for AI messages and authenticated users
  if (!isAIMessage || !profile?.user_id) {
    return null;
  }

  return (
    <div className={`flex gap-0.5 mt-2 ${isMobile ? 'flex-wrap justify-start' : ''}`}>
      {Object.entries(reactionIcons).map(([type, Icon]) => {
        const reactionType = type as MessageReaction['reaction_type'];
        const isActive = userReactions.some(r => r.reaction_type === reactionType);
        
        return (
          <Button
            key={type}
            variant="ghost"
            size="sm"
            className={`${isMobile ? 'h-4 w-4 p-0' : 'h-3.5 w-3.5 p-0'} transition-all duration-200 rounded-full touch-manipulation ${
              isActive 
                ? 'bg-amber-100 text-amber-600 hover:bg-amber-200 active:bg-amber-300' 
                : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600 active:bg-gray-200'
            }`}
            onClick={() => handleReaction(reactionType)}
            disabled={loading}
            title={reactionLabels[reactionType]}
          >
            <Icon className={`${isMobile ? 'h-1.5 w-1.5' : 'h-1.5 w-1.5'}`} />
          </Button>
        );
      })}
    </div>
  );
};

export default MessageReactions;

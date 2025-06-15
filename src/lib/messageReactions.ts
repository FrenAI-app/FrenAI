
import { supabase } from '@/lib/supabaseClient';

export interface MessageReaction {
  id?: string;
  user_id: string;
  message_id: string;
  reaction_type: 'like' | 'love' | 'laugh' | 'sad' | 'angry' | 'wow';
  created_at?: string;
}

export const addReaction = async (
  userId: string,
  messageId: string,
  reactionType: MessageReaction['reaction_type']
): Promise<MessageReaction | null> => {
  try {
    const { data, error } = await supabase
      .from('message_reactions')
      .upsert({
        user_id: userId,
        message_id: messageId,
        reaction_type: reactionType
      }, {
        onConflict: 'user_id,message_id,reaction_type'
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      reaction_type: data.reaction_type as MessageReaction['reaction_type']
    };
  } catch (error) {
    console.error('Error adding reaction:', error);
    return null;
  }
};

export const removeReaction = async (
  userId: string,
  messageId: string,
  reactionType: MessageReaction['reaction_type']
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('message_reactions')
      .delete()
      .eq('user_id', userId)
      .eq('message_id', messageId)
      .eq('reaction_type', reactionType);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing reaction:', error);
    return false;
  }
};

export const getMessageReactions = async (messageId: string): Promise<MessageReaction[]> => {
  try {
    const { data, error } = await supabase
      .from('message_reactions')
      .select('*')
      .eq('message_id', messageId);

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      reaction_type: item.reaction_type as MessageReaction['reaction_type']
    }));
  } catch (error) {
    console.error('Error fetching reactions:', error);
    return [];
  }
};

export const getUserReactions = async (userId: string, messageIds: string[]): Promise<MessageReaction[]> => {
  try {
    const { data, error } = await supabase
      .from('message_reactions')
      .select('*')
      .eq('user_id', userId)
      .in('message_id', messageIds);

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      reaction_type: item.reaction_type as MessageReaction['reaction_type']
    }));
  } catch (error) {
    console.error('Error fetching user reactions:', error);
    return [];
  }
};

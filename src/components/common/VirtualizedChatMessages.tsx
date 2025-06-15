
import React, { useMemo } from 'react';
import { useAdvancedVirtualScrolling } from '@/hooks/useAdvancedVirtualScrolling';
import { useIsMobile } from '@/hooks/use-mobile';
import Message from '@/components/Message';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  reactions?: string[];
}

interface VirtualizedChatMessagesProps {
  messages: ChatMessage[];
  onReaction?: (messageId: string, reaction: string) => void;
}

const VirtualizedChatMessages: React.FC<VirtualizedChatMessagesProps> = ({
  messages,
  onReaction
}) => {
  const isMobile = useIsMobile();

  // Dynamic message height estimation
  const getMessageHeight = (message: ChatMessage) => {
    const baseHeight = isMobile ? 80 : 60;
    const contentLines = Math.ceil(message.content.length / (isMobile ? 40 : 80));
    return baseHeight + (contentLines * 20);
  };

  const averageItemHeight = useMemo(() => {
    if (messages.length === 0) return isMobile ? 100 : 80;
    const totalHeight = messages.reduce((sum, msg) => sum + getMessageHeight(msg), 0);
    return totalHeight / messages.length;
  }, [messages, isMobile]);

  const containerHeight = isMobile ? 400 : 500;

  const {
    visibleItems,
    startIndex,
    totalHeight,
    containerRef
  } = useAdvancedVirtualScrolling(messages, {
    itemHeight: averageItemHeight,
    containerHeight,
    overscan: 2
  });

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-purple-600">
        No messages yet. Start a conversation!
      </div>
    );
  }

  // Use regular rendering for small lists
  if (messages.length <= 10) {
    return (
      <div className="space-y-4">
        {messages.map(message => (
          <Message
            key={message.id}
            message={message}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="overflow-auto"
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${startIndex * averageItemHeight}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((message, index) => (
            <div
              key={message.id}
              style={{ minHeight: getMessageHeight(message) }}
              className="mb-4"
            >
              <Message
                message={message}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(VirtualizedChatMessages);


import { useEffect, useRef } from 'react';

export const useChatContainer = (isVisible: boolean) => {
  const chatContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const findChatContainer = () => {
      const selectors = [
        '.chat-container', 
        '.messages-container', 
        '[class*="chat"]', 
        '[class*="message"]'
      ];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          console.log('Duck: Found chat container with selector:', selector);
          return element as HTMLElement;
        }
      }
      
      const fallback = document.querySelector('main') || document.body;
      console.log('Duck: Using fallback container');
      return fallback as HTMLElement;
    };

    chatContainerRef.current = findChatContainer();
  }, [isVisible]);

  return chatContainerRef;
};

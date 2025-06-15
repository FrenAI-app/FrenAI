
import { Position } from '../types/movement';

export const isPositionClear = (
  x: number,
  y: number,
  chatContainer: HTMLElement,
  isMobile: boolean
): boolean => {
  const messageSelectors = [
    '.message-bubble',
    '[class*="message"]',
    '[class*="bubble"]',
    '.animate-message-appear'
  ];
  
  const duckSize = isMobile ? 50 : 60;
  const buffer = isMobile ? 20 : 30;
  
  for (const selector of messageSelectors) {
    const elements = chatContainer.querySelectorAll(selector);
    
    for (const element of elements) {
      const elementRect = element.getBoundingClientRect();
      const chatRect = chatContainer.getBoundingClientRect();
      
      const elementX = elementRect.left - chatRect.left;
      const elementY = elementRect.top - chatRect.top;
      const elementWidth = elementRect.width;
      const elementHeight = elementRect.height;
      
      if (x < elementX + elementWidth + buffer &&
          x + duckSize > elementX - buffer &&
          y < elementY + elementHeight + buffer &&
          y + duckSize > elementY - buffer) {
        return false;
      }
    }
  }
  
  return true;
};

export const findSafePosition = (
  chatContainer: HTMLElement,
  isMobile: boolean
): Position | null => {
  const chatRect = chatContainer.getBoundingClientRect();
  const duckSize = isMobile ? 50 : 60;
  const margin = isMobile ? 15 : 20;
  const maxX = chatRect.width - duckSize - margin;
  const maxY = chatRect.height - duckSize - margin;
  
  // Try random positions first
  const attempts = isMobile ? 8 : 15;
  for (let i = 0; i < attempts; i++) {
    const newX = margin + Math.random() * (maxX - margin);
    const newY = margin + Math.random() * (maxY - margin);
    
    if (isPositionClear(newX, newY, chatContainer, isMobile)) {
      console.log('Duck: Found safe random position', { x: newX, y: newY });
      return { x: newX, y: newY };
    }
  }
  
  // Try corner positions as fallback
  const cornerPositions = [
    { x: margin, y: margin },
    { x: maxX, y: margin },
    { x: margin, y: maxY },
    { x: maxX, y: maxY },
    { x: chatRect.width / 2 - duckSize / 2, y: margin },
    { x: chatRect.width / 2 - duckSize / 2, y: maxY }
  ];
  
  for (const pos of cornerPositions) {
    if (pos.x >= margin && pos.y >= margin && isPositionClear(pos.x, pos.y, chatContainer, isMobile)) {
      console.log('Duck: Found safe corner position', pos);
      return pos;
    }
  }
  
  console.log('Duck: No safe position found, staying put');
  return null;
};

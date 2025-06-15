
import { Position } from '../types/movement';

export const calculateSafePosition = (
  chatContainer: HTMLElement,
  isMobile: boolean
): Position => {
  const chatRect = chatContainer.getBoundingClientRect();
  const safeX = Math.min(chatRect.width * (isMobile ? 0.6 : 0.7), chatRect.width - (isMobile ? 60 : 80));
  const safeY = Math.min(chatRect.height * 0.3, chatRect.height - (isMobile ? 60 : 80));
  
  return {
    x: Math.max(20, safeX),
    y: Math.max(20, safeY)
  };
};

export const keepWithinBounds = (
  position: Position,
  chatRect: DOMRect,
  isMobile: boolean
): Position => {
  const margin = isMobile ? 10 : 15;
  const duckSize = isMobile ? 50 : 60;
  
  return {
    x: Math.max(margin, Math.min(chatRect.width - duckSize - margin, position.x)),
    y: Math.max(margin, Math.min(chatRect.height - duckSize - margin, position.y))
  };
};

export const findCornerPositions = (
  chatRect: DOMRect,
  isMobile: boolean
): Position[] => {
  const margin = isMobile ? 15 : 20;
  const duckSize = isMobile ? 50 : 60;
  const maxX = chatRect.width - duckSize - margin;
  const maxY = chatRect.height - duckSize - margin;
  
  return [
    { x: margin, y: margin },
    { x: maxX, y: margin },
    { x: margin, y: maxY },
    { x: maxX, y: maxY },
    { x: chatRect.width / 2 - duckSize / 2, y: margin },
    { x: chatRect.width / 2 - duckSize / 2, y: maxY }
  ];
};

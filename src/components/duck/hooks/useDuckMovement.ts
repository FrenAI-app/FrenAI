
import { useState, useCallback } from 'react';
import { Position, Direction } from '../types/movement';
import { useChatContainer } from './useChatContainer';
import { useMovementAnimation } from './useMovementAnimation';
import { calculateSafePosition, findCornerPositions } from '../utils/positionUtils';
import { findSafePosition } from '../utils/collisionDetection';
import { useIsMobile } from '@/hooks/use-mobile';

export const useDuckMovement = (isVisible: boolean) => {
  const isMobile = useIsMobile();
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [targetPosition, setTargetPosition] = useState<Position | null>(null);
  const [direction, setDirection] = useState<Direction>('right');
  const [isDragging, setIsDragging] = useState(false);
  
  const chatContainerRef = useChatContainer(isVisible);
  
  useMovementAnimation(
    targetPosition,
    setPosition,
    setTargetPosition,
    setDirection,
    chatContainerRef,
    isMobile,
    isVisible
  );

  // Initialize position when chat container is found
  useState(() => {
    if (chatContainerRef.current && isVisible) {
      const initialPosition = calculateSafePosition(chatContainerRef.current, isMobile);
      setPosition(initialPosition);
      console.log('Duck: Initial position set', initialPosition);
    }
  });

  // Handle drag start
  const handleDragStart = useCallback((e: React.DragEvent) => {
    setIsDragging(true);
    setTargetPosition(null);
    console.log('Duck: Drag started');
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback((e: React.DragEvent) => {
    if (!chatContainerRef.current) return;

    setIsDragging(false);
    const chatRect = chatContainerRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(e.clientX - chatRect.left - 30, chatRect.width - 60));
    const newY = Math.max(0, Math.min(e.clientY - chatRect.top - 30, chatRect.height - 60));
    
    setPosition({ x: newX, y: newY });
    console.log('Duck: Dragged to position', { x: newX, y: newY });
  }, [chatContainerRef]);

  // Move to random safe position
  const moveToRandomPosition = useCallback(() => {
    if (!chatContainerRef.current || isDragging) return;

    const safePosition = findSafePosition(chatContainerRef.current, isMobile);
    if (safePosition) {
      setTargetPosition(safePosition);
      setDirection(safePosition.x > position.x ? 'right' : 'left');
      console.log('Duck: Moving to random position', safePosition);
    }
  }, [chatContainerRef, isMobile, isDragging, position.x]);

  return {
    position,
    targetPosition,
    direction,
    setDirection,
    handleDragStart,
    handleDragEnd,
    moveToRandomPosition
  };
};


import { useEffect, useRef, useCallback } from 'react';
import { Position } from '../types/movement';
import { keepWithinBounds } from '../utils/positionUtils';
import { isPositionClear, findSafePosition } from '../utils/collisionDetection';

export const useMovementAnimation = (
  targetPosition: Position | null,
  setPosition: React.Dispatch<React.SetStateAction<Position>>,
  setTargetPosition: React.Dispatch<React.SetStateAction<Position | null>>,
  setDirection: React.Dispatch<React.SetStateAction<'left' | 'right'>>,
  chatContainerRef: React.RefObject<HTMLElement>,
  isMobile: boolean,
  isVisible: boolean
) => {
  const frameRef = useRef<number>(0);
  const lastPositionRef = useRef<Position>({ x: 0, y: 0 });

  const animateMovement = useCallback(() => {
    const chatRect = chatContainerRef.current?.getBoundingClientRect();
    if (!chatRect || !targetPosition) return;
    
    setPosition(currentPos => {
      const dx = targetPosition.x - currentPos.x;
      const dy = targetPosition.y - currentPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 5) {
        setTargetPosition(null);
        return targetPosition;
      }
      
      const speed = isMobile ? 1.0 : 1.5;
      let newX = currentPos.x + (dx / distance) * speed;
      let newY = currentPos.y + (dy / distance) * speed;
      
      const boundedPosition = keepWithinBounds({ x: newX, y: newY }, chatRect, isMobile);
      newX = boundedPosition.x;
      newY = boundedPosition.y;
      
      // Only check collision if position changed significantly
      const positionChanged = Math.abs(newX - lastPositionRef.current.x) > 1 || 
                             Math.abs(newY - lastPositionRef.current.y) > 1;
      
      if (positionChanged && !isPositionClear(newX, newY, chatContainerRef.current!, isMobile)) {
        const alternativeTarget = findSafePosition(chatContainerRef.current!, isMobile);
        if (alternativeTarget) {
          setTargetPosition(alternativeTarget);
          setDirection(alternativeTarget.x > currentPos.x ? 'right' : 'left');
        } else {
          setTargetPosition(null);
        }
        return currentPos;
      }
      
      lastPositionRef.current = { x: newX, y: newY };
      return { x: newX, y: newY };
    });
    
    frameRef.current = requestAnimationFrame(animateMovement);
  }, [targetPosition, isMobile, setPosition, setTargetPosition, setDirection, chatContainerRef]);

  useEffect(() => {
    if (!targetPosition || !chatContainerRef.current || !isVisible) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      return;
    }
    
    frameRef.current = requestAnimationFrame(animateMovement);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [targetPosition, isVisible, animateMovement]);

  return frameRef;
};

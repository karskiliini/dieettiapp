"use client";

import { useRef, useState, useCallback, type TouchEvent } from "react";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function useSwipe({ onSwipeLeft, onSwipeRight }: SwipeHandlers) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const locked = useRef<"horizontal" | "vertical" | null>(null);

  const onTouchStart = useCallback((e: TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    locked.current = null;
    setIsDragging(false);
    setDragX(0);
  }, []);

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!touchStart.current) return;

      const dx = e.touches[0].clientX - touchStart.current.x;
      const dy = e.touches[0].clientY - touchStart.current.y;

      // Lock direction after 10px movement
      if (locked.current === null && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
        locked.current = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
      }

      if (locked.current !== "horizontal") return;

      // Only track rightward drag (back gesture) when onSwipeRight exists
      if (onSwipeRight && dx > 0) {
        setIsDragging(true);
        setDragX(dx);
      }
    },
    [onSwipeRight]
  );

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!touchStart.current) return;

      const deltaX = e.changedTouches[0].clientX - touchStart.current.x;

      if (locked.current === "horizontal" && Math.abs(deltaX) > 80) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }

      touchStart.current = null;
      locked.current = null;
      setIsDragging(false);
      setDragX(0);
    },
    [onSwipeLeft, onSwipeRight]
  );

  return { onTouchStart, onTouchMove, onTouchEnd, dragX, isDragging };
}

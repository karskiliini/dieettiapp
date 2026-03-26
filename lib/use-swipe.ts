"use client";

import { useRef, useState, useCallback, type TouchEvent } from "react";

interface SwipeConfig {
  canSwipeBack: boolean;
  onSwipeBack: () => void;
}

export function useSwipeBack({ canSwipeBack, onSwipeBack }: SwipeConfig) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const locked = useRef<"horizontal" | "vertical" | null>(null);
  const screenWidth = useRef(typeof window !== "undefined" ? window.innerWidth : 375);

  const onTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!canSwipeBack) return;
      if (e.touches[0].clientX > 40) return;
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      locked.current = null;
      setIsDragging(false);
      setDragX(0);
      screenWidth.current = window.innerWidth;
    },
    [canSwipeBack]
  );

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!touchStart.current || !canSwipeBack) return;

      const dx = e.touches[0].clientX - touchStart.current.x;
      const dy = e.touches[0].clientY - touchStart.current.y;

      if (locked.current === null && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
        locked.current = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
      }

      if (locked.current !== "horizontal") return;
      if (dx <= 0) return;

      e.preventDefault();
      setIsDragging(true);
      setDragX(dx);
    },
    [canSwipeBack]
  );

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!touchStart.current || !isDragging) {
        touchStart.current = null;
        locked.current = null;
        return;
      }

      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const threshold = screenWidth.current * 0.5;

      touchStart.current = null;
      locked.current = null;

      if (dx > threshold) {
        // Animate off-screen, then complete
        setIsCompleting(true);
        setDragX(screenWidth.current);
        setTimeout(() => {
          // All state changes in one synchronous batch = one React render
          onSwipeBack();
          setIsDragging(false);
          setIsCompleting(false);
          setDragX(0);
        }, 250);
      } else {
        // Snap back
        setIsCompleting(true);
        setDragX(0);
        setTimeout(() => {
          setIsDragging(false);
          setIsCompleting(false);
        }, 250);
      }
    },
    [isDragging, onSwipeBack]
  );

  const progress = isDragging ? Math.min(dragX / screenWidth.current, 1) : 0;

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isDragging,
    isCompleting,
    dragX,
    progress,
  };
}

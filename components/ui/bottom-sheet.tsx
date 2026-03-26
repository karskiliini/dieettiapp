"use client";

import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
  children: ReactNode;
  showCloseButton?: boolean;
}

export function BottomSheet({ onClose, children, showCloseButton = true }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStart = useRef<{ y: number } | null>(null);
  const isAtTop = useRef(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setIsOpen(true));
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    isAtTop.current = e.currentTarget.scrollTop <= 0;
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStart.current = { y: e.touches[0].clientY };
    setIsDragging(false);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const dy = e.touches[0].clientY - touchStart.current.y;
    if (dy > 0 && isAtTop.current) {
      e.preventDefault();
      setIsDragging(true);
      setDragY(dy);
    }
  }

  function handleTouchEnd() {
    if (!isDragging) { touchStart.current = null; return; }
    if (dragY > 120) {
      close();
    } else {
      setDragY(0);
    }
    setIsDragging(false);
    touchStart.current = null;
  }

  const sheetHeight = typeof window !== "undefined" ? window.innerHeight * 0.85 : 600;
  const dismissProgress = Math.min(dragY / sheetHeight, 1);
  const backdropOpacity = 0.5 - dismissProgress * 0.5;
  const sheetTranslateY = isDragging ? dragY : 0;
  const transition = isDragging ? "none" : "transform 0.3s ease-out, opacity 0.3s ease-out";

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: `rgba(0,0,0,${isOpen ? backdropOpacity : 0})`,
          transition: isDragging ? "none" : "background 0.3s ease-out",
        }}
        onClick={close}
      />

      {/* Sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 mx-auto max-w-lg rounded-t-[16px] flex flex-col"
        style={{
          background: "var(--ios-gray6)",
          maxHeight: "85dvh",
          paddingBottom: "env(safe-area-inset-bottom)",
          transform: isOpen ? `translateY(${sheetTranslateY}px)` : "translateY(100%)",
          transition,
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Grab handle */}
        <div className="flex justify-center pt-2 pb-1 shrink-0 cursor-grab">
          <div className="w-9 h-[5px] rounded-full" style={{ background: "var(--ios-gray3)" }} />
        </div>

        {showCloseButton && (
          <div className="flex justify-end px-4 pb-1 shrink-0">
            <button onClick={close} className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: "var(--ios-gray4)" }}>
              <X className="h-4 w-4" style={{ color: "var(--ios-secondary-label)" }} />
            </button>
          </div>
        )}

        {/* Scrollable content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-4 pb-6" onScroll={handleScroll}>
          {children}
        </div>
      </div>
    </div>
  );
}

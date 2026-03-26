"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "dieettiapp-favorites";

interface FavoritesData {
  ids: number[]; // ordered list of favorite recipe IDs
}

function load(): FavoritesData {
  if (typeof window === "undefined") return { ids: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { ids: [] };
}

function save(data: FavoritesData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load on mount
  useEffect(() => {
    setFavorites(load().ids);
  }, []);

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (id: number) => {
      setFavorites((prev) => {
        const next = prev.includes(id)
          ? prev.filter((f) => f !== id)
          : [...prev, id];
        save({ ids: next });
        return next;
      });
    },
    []
  );

  const reorderFavorites = useCallback(
    (fromIndex: number, toIndex: number) => {
      setFavorites((prev) => {
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        save({ ids: next });
        return next;
      });
    },
    []
  );

  return { favorites, isFavorite, toggleFavorite, reorderFavorites };
}

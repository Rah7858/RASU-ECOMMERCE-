import { useState, useCallback, useEffect } from "react";
import type { Product } from "@/data/products";

const STORAGE_KEY = "rasu-recently-viewed";
const MAX_ITEMS = 8;

function loadFromStorage(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_ITEMS) : [];
  } catch {
    return [];
  }
}

function persistToStorage(items: Product[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    /* localStorage unavailable */
  }
}

export function useRecentlyViewed(excludeProductId?: number) {
  const [items, setItems] = useState<Product[]>(loadFromStorage);

  useEffect(() => {
    persistToStorage(items);
  }, [items]);

  const addProduct = useCallback((product: Product) => {
    setItems((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const filteredItems = excludeProductId
    ? items.filter((p) => p.id !== excludeProductId)
    : items;

  return {
    items: filteredItems,
    addProduct,
    clearHistory,
    count: filteredItems.length,
  } as const;
}

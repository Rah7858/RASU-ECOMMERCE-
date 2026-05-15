import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { Product } from "@/data/products";
import { apiRequest, API_BASE_URL } from "@/lib/api";

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
  wishlistCount: number;
  isSyncing: boolean;
}

const STORAGE_KEY = "rasu-wishlist";

function loadLocalWishlist(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistLocalWishlist(items: Product[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* localStorage unavailable */
  }
}

function getAuthToken(): string | null {
  try {
    return localStorage.getItem("rasu_token");
  } catch {
    return null;
  }
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>(loadLocalWishlist);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    persistLocalWishlist(wishlist);
  }, [wishlist]);

  const syncToServer = useCallback(async (action: "add" | "remove", productId: number) => {
    const token = getAuthToken();
    if (!token) return;

    setIsSyncing(true);
    try {
      if (action === "add") {
        await apiRequest("/api/users/wishlist", {
          method: "POST",
          token,
          body: JSON.stringify({ productId }),
        });
      } else {
        await apiRequest(`/api/users/wishlist/${productId}`, {
          method: "DELETE",
          token,
        });
      }
    } catch {
      /* Silently fail — localStorage is the source of truth for now */
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const addToWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
    syncToServer("add", product.id);
  }, [syncToServer]);

  const removeFromWishlist = useCallback((productId: number) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
    syncToServer("remove", productId);
  }, [syncToServer]);

  const isInWishlist = useCallback((productId: number) => {
    return wishlist.some((p) => p.id === productId);
  }, [wishlist]);

  const toggleWishlist = useCallback((product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }, [isInWishlist, removeFromWishlist, addToWishlist]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  const value = useMemo<WishlistContextType>(
    () => ({
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      clearWishlist,
      wishlistCount: wishlist.length,
      isSyncing,
    }),
    [wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, clearWishlist, isSyncing]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

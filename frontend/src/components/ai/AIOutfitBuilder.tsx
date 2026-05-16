import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShoppingBag, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────
interface OutfitItem {
  category: string;
  name: string;
  reason: string;
  priceRange: string;
}

interface OutfitResult {
  items: OutfitItem[];
  outfitNote: string;
}

interface AIOutfitBuilderProps {
  productId: number;
  productName: string;
  productCategory: string;
  productSubcategory: string;
  productGender?: string;
  productPrice: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a fashion stylist for RASU streetwear.
Given a product, suggest exactly 2 complementary items to complete the outfit.

Available items to suggest from:
Men's: Hoodies, Joggers, Jackets, Tees, Bomber Jackets, Caps, Crossbody Bags
Women's: Co-ord Sets, Hoodies, Trousers, Crop Jackets, Caps, Sunglasses
Accessories: Caps, Bags, Sunglasses

Rules:
- Never suggest same category as input product
- Always suggest items from matching gender
- One clothing item + one accessory
- Keep styling note under 10 words

Response format (JSON only):
{
  "items": [
    {
      "category": "Joggers",
      "name": "Urban Cargo Joggers",
      "reason": "Perfect street-ready pairing",
      "priceRange": "₹999 - ₹1999"
    },
    {
      "category": "Caps",
      "name": "Structured Logo Cap",
      "reason": "Completes the urban aesthetic",
      "priceRange": "₹299 - ₹799"
    }
  ],
  "outfitNote": "One sentence complete outfit description"
}
Return ONLY valid JSON. No other text.`;

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? "";

// Category to emoji mapping for icons
const CATEGORY_ICONS: Record<string, string> = {
  Hoodies: "🧥", Joggers: "👖", Jackets: "🧣", Tees: "👕",
  "Bomber Jackets": "🫱", Caps: "🧢", Bags: "👜", "Crossbody Bags": "👜",
  Sunglasses: "🕶️", "Co-ord Sets": "✨", Trousers: "👖", "Crop Jackets": "🧥",
  "Wide Leg Trousers": "👖", Accessories: "💎",
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function OutfitSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="rounded-2xl p-5 space-y-3 animate-pulse"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="w-12 h-12 rounded-xl bg-white/8 flex items-center justify-center text-2xl">
            <div className="w-8 h-8 rounded-lg bg-white/10" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded bg-white/10" />
            <div className="h-3 w-1/2 rounded bg-white/8" />
            <div className="h-3 w-2/3 rounded bg-white/6" />
          </div>
          <div className="h-9 rounded-xl bg-white/8" />
        </div>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function AIOutfitBuilder({
  productId,
  productName,
  productCategory,
  productSubcategory,
  productGender = "men",
  productPrice,
}: AIOutfitBuilderProps) {
  const [outfit, setOutfit] = useState<OutfitResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateOutfit = useCallback(async () => {
    // Check sessionStorage cache first
    const cacheKey = `rasu_outfit_${productId}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        setOutfit(JSON.parse(cached));
        setHasGenerated(true);
        return;
      } catch {
        sessionStorage.removeItem(cacheKey);
      }
    }

    if (!API_KEY) {
      setError("Please add VITE_GEMINI_API_KEY to Vercel environment variables");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    const userMessage = `Product: ${productName}
Category: ${productSubcategory || productCategory}
Gender: ${productGender}
Price: ₹${productPrice}

Please suggest 2 complementary items to complete this outfit.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const [response] = await Promise.all([
        fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: SYSTEM_PROMPT }],
              },
              contents: [
                { role: "user", parts: [{ text: userMessage }] },
              ],
              generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
              },
            }),
            signal: controller.signal,
          }
        ),
        new Promise((r) => setTimeout(r, 800)),
      ]);

      clearTimeout(timeoutId);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || "API error");
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Parse error");

      const parsed: OutfitResult = JSON.parse(jsonMatch[0]);

      if (!parsed.items || parsed.items.length < 2) throw new Error("Invalid response");

      // Cache in sessionStorage
      sessionStorage.setItem(cacheKey, JSON.stringify(parsed));
      setOutfit(parsed);
      setHasGenerated(true);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err?.name === "AbortError") {
        setError("Our AI stylist is busy, try again!");
      } else if (!navigator.onLine) {
        setError("Check your connection and try again.");
      } else if (err?.message && err.message.includes("API key")) {
        setError(`AI Error: ${err.message}`);
      } else if (err?.message === "API error") {
        setError("Gemini API Key Expired or Invalid. Please update VITE_GEMINI_API_KEY in Vercel.");
      } else {
        setError(err?.message || "Our AI stylist is busy, try again!");
      }
    } finally {
      setIsLoading(false);
    }
  }, [productId, productName, productCategory, productSubcategory, productGender, productPrice]);

  // Auto-generate on mount
  useEffect(() => {
    if (!hasGenerated) {
      generateOutfit();
    }
  }, [generateOutfit, hasGenerated]);

  return (
    <section className="mt-12 pt-8 border-t border-border">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Complete The Look
          </h2>
          <p className="text-muted-foreground text-sm mt-1">AI-curated outfit for this piece</p>
        </div>
        {hasGenerated && !isLoading && (
          <button
            onClick={() => {
              sessionStorage.removeItem(`rasu_outfit_${productId}`);
              setOutfit(null);
              setHasGenerated(false);
              generateOutfit();
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Loader2 className="w-3 h-3" />
            Refresh
          </button>
        )}
      </div>

      {/* Outfit Note */}
      <AnimatePresence>
        {outfit?.outfitNote && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-muted-foreground text-sm italic mb-5 px-1"
          >
            "{outfit.outfitNote}"
          </motion.p>
        )}
      </AnimatePresence>

      {/* Loading Skeleton */}
      {isLoading && <OutfitSkeleton />}

      {/* Error State */}
      {error && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3 py-8 text-center"
        >
          <p className="text-muted-foreground text-sm">{error}</p>
          <button
            onClick={generateOutfit}
            className="text-xs px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Outfit Cards */}
      {outfit && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid sm:grid-cols-2 gap-4"
        >
          {outfit.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="group rounded-2xl p-5 space-y-4 transition-all duration-300 hover:border-primary/30"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Icon + Title */}
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  {CATEGORY_ICONS[item.category] ?? "✨"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                    {item.category}
                  </p>
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                </div>
              </div>

              {/* Reason + Price */}
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">{item.reason}</p>
                <p className="text-primary font-semibold text-sm">{item.priceRange}</p>
              </div>

              {/* Shop Now Button */}
              <Link
                to={`/shop?category=${encodeURIComponent(item.category.toLowerCase())}`}
                className="flex items-center justify-center gap-2 w-full h-9 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] group-hover:bg-primary group-hover:text-primary-foreground"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Shop Now
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}

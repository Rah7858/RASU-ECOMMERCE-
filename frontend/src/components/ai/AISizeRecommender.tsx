import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ChevronRight, Loader2, AlertCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SizeRecommenderProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize: (size: string) => void;
  productName: string;
  productCategory: string;
}

type FitPreference = "Slim Fit" | "Regular Fit" | "Oversized Fit";

interface AISizeResult {
  size: string;
  reason: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const VALID_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const FIT_OPTIONS: FitPreference[] = ["Slim Fit", "Regular Fit", "Oversized Fit"];

const SYSTEM_PROMPT = `You are a fashion sizing expert for RASU streetwear. Given height (cm), weight (kg), and fit preference, recommend ONE size from: XS, S, M, L, XL, XXL.

RASU sizing guide:
XS: height 155-163cm, weight 45-52kg
S:  height 163-170cm, weight 52-60kg
M:  height 170-176cm, weight 60-70kg
L:  height 176-182cm, weight 70-82kg
XL: height 182-188cm, weight 82-95kg
XXL: height 188cm+,   weight 95kg+

Adjust for fit preference:
- Slim fit: recommend one size down
- Oversized fit: recommend one size up
- Regular fit: recommend standard size

Response format (JSON only):
{
  "size": "L",
  "reason": "One sentence explanation"
}
Return ONLY valid JSON. No other text.`;

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? "";

// ─── Component ────────────────────────────────────────────────────────────────
export function AISizeRecommender({
  isOpen,
  onClose,
  onSelectSize,
  productName,
}: SizeRecommenderProps) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fitPref, setFitPref] = useState<FitPreference>("Regular Fit");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AISizeResult | null>(null);
  const [error, setError] = useState("");

  const handleGetSize = useCallback(async () => {
    if (!height || !weight) {
      setError("Please enter your height and weight.");
      return;
    }

    setError("");
    setResult(null);
    setIsLoading(true);

    const userMessage = `Height: ${height}cm, Weight: ${weight}kg, Fit preference: ${fitPref}. What size should I get?`;

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
                temperature: 0.3,
              },
            }),
            signal: controller.signal,
          }
        ),
        new Promise((r) => setTimeout(r, 800)), // minimum loading
      ]);

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Parse error");

      const parsed: AISizeResult = JSON.parse(jsonMatch[0]);

      if (!VALID_SIZES.includes(parsed.size)) throw new Error("Invalid size");

      setResult(parsed);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err?.name === "AbortError") {
        setError("Our AI stylist is busy, try again!");
      } else if (!navigator.onLine) {
        setError("Check your connection and try again.");
      } else if (err?.message === "Parse error" || err?.message === "Invalid size") {
        setError("Could not determine size. Please check our size guide.");
      } else {
        setError("Our AI stylist is busy, try again!");
      }
    } finally {
      setIsLoading(false);
    }
  }, [height, weight, fitPref]);

  const handleSelectAndClose = () => {
    if (result?.size) {
      onSelectSize(result.size);
      onClose();
    }
  };

  const handleClose = () => {
    setResult(null);
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[10000]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-md rounded-2xl overflow-hidden z-[10001] shadow-2xl"
            style={{
              background: "rgba(10, 10, 10, 0.97)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div>
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  AI Size Recommender
                </h2>
                <p className="text-white/40 text-xs mt-0.5">Get your perfect fit in seconds</p>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs font-medium mb-1.5 block">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    min={100}
                    max={250}
                    className="w-full h-11 rounded-xl px-4 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs font-medium mb-1.5 block">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min={30}
                    max={200}
                    className="w-full h-11 rounded-xl px-4 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                </div>
              </div>

              {/* Fit Preference */}
              <div>
                <label className="text-white/60 text-xs font-medium mb-2 block">
                  Fit Preference
                </label>
                <div className="flex gap-2">
                  {FIT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setFitPref(opt)}
                      className={`flex-1 text-xs py-2.5 rounded-xl font-medium transition-all ${
                        fitPref === opt
                          ? "bg-primary text-primary-foreground"
                          : "text-white/60 hover:text-white/80"
                      }`}
                      style={
                        fitPref !== opt
                          ? { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }
                          : {}
                      }
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-xl"
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Result Card */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl p-4 space-y-3"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-black text-primary">{result.size}</span>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs font-medium mb-0.5">Recommended Size</p>
                        <p className="text-white font-bold text-xl">{result.size}</p>
                      </div>
                      <div className="ml-auto text-green-400 text-2xl">✅</div>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">"{result.reason}"</p>

                    <button
                      onClick={handleSelectAndClose}
                      className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:scale-[1.02]"
                    >
                      Select Size {result.size}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA Button */}
              {!result && (
                <button
                  onClick={handleGetSize}
                  disabled={isLoading || !height || !weight}
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-[1.01]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      AI is calculating your size...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Get My Size
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}

              {result && (
                <button
                  onClick={() => setResult(null)}
                  className="w-full text-center text-xs text-white/30 hover:text-white/60 transition-colors py-1"
                >
                  Try different measurements
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

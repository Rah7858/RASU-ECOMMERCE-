import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, MessageCircle, RotateCcw } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are RASU AI Stylist — a premium fashion assistant for RASU, a futuristic streetwear brand.

Products available:
- Men: Hoodies (₹999-₹2999), Jackets (₹1999-₹4999), Joggers (₹799-₹1999), Oversized Tees (₹599-₹1299), Bomber Jackets (₹2499-₹4999)
- Women: Co-ord Sets (₹1499-₹3999), Oversized Hoodies (₹999-₹2499), Wide Leg Trousers (₹899-₹1999), Crop Jackets (₹1499-₹3499)
- Accessories: Caps (₹299-₹799), Crossbody Bags (₹599-₹1499), Sunglasses (₹399-₹999)

Your personality:
- Stylish, confident, friendly
- Keep responses under 4 sentences
- Always end with a specific product suggestion
- Use fashion terminology naturally
- Never say you are an AI — you are RASU Stylist`;

const STARTER_CHIPS = [
  { emoji: "👔", label: "Build me an outfit" },
  { emoji: "💰", label: "Under ₹1000 picks" },
  { emoji: "🌙", label: "Night out look" },
  { emoji: "📏", label: "Help with sizing" },
];

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? "";

// ─── Helper ───────────────────────────────────────────────────────────────────
function formatTime(date: Date) {
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

// ─── Component ────────────────────────────────────────────────────────────────
export function StyleChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const callClaude = useCallback(async (userMessage: string, history: Message[]) => {
    const apiMessages = history.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: SYSTEM_PROMPT }],
            },
            contents: [
              ...apiMessages.map((m) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }],
              })),
              { role: "user", parts: [{ text: userMessage }] },
            ],
            generationConfig: {
              maxOutputTokens: 1000,
              temperature: 0.7,
            },
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Let me help you find the perfect RASU look!";
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err?.name === "AbortError") {
        return "Our AI stylist is busy, try again! ✨";
      }
      if (!navigator.onLine) {
        return "Check your connection and try again!";
      }
      return "Our AI stylist is busy, try again! ✨";
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: Message = {
        id: `u_${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      const newHistory = [...messages, userMsg];
      setMessages(newHistory);
      setInput("");
      setIsLoading(true);

      // Keep last 10 messages for context
      const contextMessages = newHistory.slice(-10);

      // Minimum 800ms loading to prevent flash
      const [reply] = await Promise.all([
        callClaude(trimmed, contextMessages.slice(0, -1)),
        new Promise((r) => setTimeout(r, 800)),
      ]);

      const aiMsg: Message = {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: reply as string,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    },
    [messages, isLoading, callClaude]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleClear = () => {
    setMessages([]);
    setInput("");
  };

  const showChips = messages.length === 0;

  return (
    <>
      {/* ── Chat Window ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatwindow"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-[9998] w-[calc(100vw-2rem)] max-w-[380px] md:w-[380px] rounded-[20px] overflow-hidden shadow-2xl"
            style={{
              background: "rgba(10, 10, 10, 0.95)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              height: "520px",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  R
                </div>
                <div>
                  <p className="text-white font-semibold text-sm flex items-center gap-1">
                    ✨ RASU AI Stylist
                  </p>
                  <p className="text-white/40 text-xs">Your personal fashion AI</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={handleClear}
                    title="Clear conversation"
                    className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="overflow-y-auto px-4 py-4 space-y-4"
              style={{ height: "calc(520px - 130px)" }}
            >
              {/* Welcome message */}
              {showChips && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-1">
                      R
                    </div>
                    <div
                      className="rounded-2xl rounded-tl-sm px-3 py-2.5 text-sm text-white/90 max-w-[85%]"
                      style={{ background: "rgba(255,255,255,0.07)" }}
                    >
                      Hey! I'm your RASU AI Stylist. Ask me anything about fashion, outfits, or sizing! 👋
                    </div>
                  </div>

                  {/* Starter chips */}
                  <div className="flex flex-wrap gap-2 pl-8">
                    {STARTER_CHIPS.map((chip) => (
                      <button
                        key={chip.label}
                        onClick={() => sendMessage(chip.label)}
                        className="text-xs px-3 py-1.5 rounded-full text-white/80 hover:text-white transition-all hover:scale-105"
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        {chip.emoji} {chip.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Message list */}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                      R
                    </div>
                  )}
                  <div className="max-w-[80%] space-y-1">
                    <div
                      className={`rounded-2xl px-3 py-2.5 text-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "text-white/90 rounded-tl-sm"
                      }`}
                      style={
                        msg.role === "assistant"
                          ? { background: "rgba(255,255,255,0.07)" }
                          : {}
                      }
                    >
                      {msg.content}
                    </div>
                    <p
                      className={`text-[10px] text-white/30 ${
                        msg.role === "user" ? "text-right pr-1" : "pl-1"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                    R
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl rounded-tl-sm"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-white/50"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="px-4 py-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about style..."
                  disabled={isLoading}
                  className="flex-1 h-10 rounded-xl px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 transition-all"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-all hover:scale-105 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Trigger Button ─────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-[9999]" title="AI Style Assistant">
        <motion.button
          onClick={() => setIsOpen((o) => !o)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl"
          aria-label="AI Style Assistant"
        >
          {/* Pulsing glow */}
          {!isOpen && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary"
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <MessageCircle className="w-6 h-6" />
                <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Tooltip */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-medium px-2.5 py-1 rounded-lg pointer-events-none"
            style={{
              background: "rgba(10,10,10,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            AI Style Assistant
          </motion.div>
        )}
      </div>
    </>
  );
}

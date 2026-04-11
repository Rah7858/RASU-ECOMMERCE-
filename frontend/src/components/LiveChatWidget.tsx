import { FormEvent, useMemo, useState } from "react";
import { MessageCircle, SendHorizontal, X } from "lucide-react";
import { apiRequest } from "@/lib/api";

const END_MESSAGE =
  "Thank you for visiting RASU Site. Hope you are satisfied with the service. I recommend you refer this site to your friends and family members. Thank you so much. Lots of love from Team RASU.";

type ChatRole = "user" | "agent";

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}

interface ChatResponse {
  reply: string;
  endConversation: boolean;
}

const starterMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "agent",
    text: "Hi there. Welcome to RASU support. How can we help you today?",
  },
];

export function LiveChatWidget() {
  const sessionId = useMemo(() => {
    const existing = localStorage.getItem("rasu-chat-session-id");
    if (existing) return existing;

    const generated = `chat_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("rasu-chat-session-id", generated);
    return generated;
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  const appendEndMessage = () => {
    setMessages((prev) => {
      if (prev.some((message) => message.text === END_MESSAGE)) return prev;
      return [
        ...prev,
        {
          id: `a_end_${Date.now()}`,
          role: "agent",
          text: END_MESSAGE,
        },
      ];
    });
    setIsEnded(true);
  };

  const handleCloseChat = () => {
    if (!isEnded) {
      appendEndMessage();
      setTimeout(() => setIsOpen(false), 900);
      return;
    }

    setIsOpen(false);
  };

  const handleToggle = () => {
    if (isOpen) {
      handleCloseChat();
      return;
    }

    if (isEnded) {
      setMessages(starterMessages);
      setIsEnded(false);
      setInput("");

      apiRequest<ChatResponse>("/api/support/chat", {
        method: "POST",
        body: JSON.stringify({
          message: "start",
          sessionId,
          resetContext: true,
        }),
      }).catch(() => {
        // Non-blocking reset call.
      });
    }

    setIsOpen(true);
  };

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || isEnded || isLoading) return;

    const userMessage: ChatMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      setIsLoading(true);
      const data = await apiRequest<ChatResponse>("/api/support/chat", {
        method: "POST",
        body: JSON.stringify({
          message: text,
          sessionId,
        }),
      });

      const replyText = data?.reply || "I am here to help with your RASU queries.";
      setMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: "agent",
          text: replyText,
        },
      ]);

      if (data?.endConversation) {
        setIsEnded(true);
        setTimeout(() => setIsOpen(false), 1200);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `a_err_${Date.now()}`,
          role: "agent",
          text:
            error instanceof Error
              ? error.message
              : "Support is temporarily unavailable. Please use Call Us, Email Support, or WhatsApp.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[70]">
      {isOpen && (
        <div className="mb-3 w-[92vw] max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold">RASU Live Chat</p>
              <p className="text-xs text-muted-foreground">Usually replies within 2-4 hours</p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={handleCloseChat}
              className="rounded-md p-1.5 transition hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-72 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your message..."
                aria-label="Chat message"
                disabled={isLoading || isEnded}
                className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={!canSend || isLoading || isEnded}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <SendHorizontal className="h-4 w-4" />
              </button>
            </div>
            {(isLoading || isEnded) && (
              <p className="mt-2 text-xs text-muted-foreground">
                {isLoading ? "RASU AI is typing..." : "Chat ended. Reopen to start a new conversation."}
              </p>
            )}
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={handleToggle}
        aria-label={isOpen ? "Close live chat" : "Open live chat"}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition hover:scale-105"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}

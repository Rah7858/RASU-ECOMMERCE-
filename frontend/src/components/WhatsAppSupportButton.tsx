import { MessageCircle } from "lucide-react";

interface WhatsAppSupportButtonProps {
  number: string;
  message?: string;
  className?: string;
}

export function WhatsAppSupportButton({
  number,
  message = "Hello RASU Support",
  className = "",
}: WhatsAppSupportButtonProps) {
  const cleanNumber = number.replace(/\D/g, "");
  const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`inline-flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground ${className}`}
    >
      <MessageCircle className="h-4 w-4" />
      WhatsApp Support
    </a>
  );
}

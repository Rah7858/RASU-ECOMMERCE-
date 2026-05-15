import { useState, useCallback, useRef } from "react";
import { apiRequest } from "@/lib/api";

interface RazorpayOrderResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  key: string;
}

interface RazorpayVerifyResponse {
  verified: boolean;
  message: string;
  orderId: string;
  amount?: number;
}

interface RazorpayCheckoutOptions {
  items: Array<{
    productId?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    size?: string;
    color?: string;
  }>;
  shippingAddress: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  phone?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (data: RazorpayVerifyResponse) => void;
  onFailure: (error: string) => void;
  onDismiss?: () => void;
}

interface RazorpayWindow {
  Razorpay: new (options: Record<string, unknown>) => {
    open: () => void;
    on: (event: string, handler: () => void) => void;
  };
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as unknown as RazorpayWindow).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function useRazorpay() {
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);

  const initiatePayment = useCallback(async (options: RazorpayCheckoutOptions) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setIsProcessing(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        options.onFailure("Failed to load payment gateway. Check your connection.");
        return;
      }

      const token = localStorage.getItem("rasu_token");
      if (!token) {
        options.onFailure("Please log in to complete your purchase.");
        return;
      }

      const orderData = await apiRequest<RazorpayOrderResponse>("/api/payments/order", {
        method: "POST",
        token,
        body: JSON.stringify({
          items: options.items,
          shippingAddress: options.shippingAddress,
          phone: options.phone,
        }),
      });

      const razorpayOptions = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "RASU",
        description: "Premium Fashion Purchase",
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: options.prefill?.name || "",
          email: options.prefill?.email || "",
          contact: options.prefill?.contact || "",
        },
        theme: {
          color: "#6d28d9",
          backdrop_color: "rgba(0,0,0,0.7)",
        },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyData = await apiRequest<RazorpayVerifyResponse>("/api/payments/verify", {
              method: "POST",
              token,
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.orderId,
              }),
            });

            if (verifyData.verified) {
              options.onSuccess(verifyData);
            } else {
              options.onFailure("Payment verification failed. Contact support.");
            }
          } catch (err) {
            options.onFailure(err instanceof Error ? err.message : "Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            options.onDismiss?.();
          },
          escape: true,
          confirm_close: true,
        },
      };

      const razorpay = new (window as unknown as RazorpayWindow).Razorpay(razorpayOptions);
      razorpay.open();
    } catch (err) {
      options.onFailure(err instanceof Error ? err.message : "Payment initiation failed");
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, []);

  return { initiatePayment, isProcessing } as const;
}

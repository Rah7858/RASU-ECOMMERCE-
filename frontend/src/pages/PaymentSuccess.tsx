import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import confetti from "canvas-confetti";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, amount } = useMemo(() => {
    const state = location.state as { orderId?: string; amount?: number } | null;
    return {
      orderId: state?.orderId || "N/A",
      amount: state?.amount || 0,
    };
  }, [location.state]);

  useEffect(() => {
    if (!location.state) {
      navigate("/", { replace: true });
      return;
    }

    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#6d28d9", "#a855f7", "#e879f9"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#6d28d9", "#a855f7", "#e879f9"],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  }, [location.state, navigate]);

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date()),
    []
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>

            <h1 className="text-3xl font-bold mb-3">Payment Successful!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your purchase. Your order has been confirmed.
            </p>

            {/* Order details card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl border border-border/50 p-6 mb-8 text-left space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Order ID</span>
                <span className="font-mono text-sm font-medium">{orderId}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount Paid</span>
                <span className="text-lg font-bold text-green-500">{formatPrice(amount)}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="text-sm">{formattedDate}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Payment Method</span>
                <span className="text-sm">Razorpay</span>
              </div>
            </motion.div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={`/orders/track/${orderId}`}>
                <Button size="lg" className="gap-2 rounded-full w-full sm:w-auto">
                  <Package className="w-4 h-4" />
                  Track Order
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/shop">
                <Button variant="outline" size="lg" className="gap-2 rounded-full w-full sm:w-auto">
                  <ShoppingBag className="w-4 h-4" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

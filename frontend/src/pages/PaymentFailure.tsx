import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, RefreshCw, ShoppingBag, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PaymentFailure() {
  const location = useLocation();
  const navigate = useNavigate();

  const { errorMessage, orderId } = useMemo(() => {
    const state = location.state as { errorMessage?: string; orderId?: string } | null;
    return {
      errorMessage: state?.errorMessage || "Something went wrong with your payment.",
      orderId: state?.orderId,
    };
  }, [location.state]);

  const handleRetry = () => {
    if (orderId) {
      navigate(`/checkout`, { state: { retryOrderId: orderId } });
    } else {
      navigate("/cart");
    }
  };

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
            {/* Failure icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-8"
            >
              <XCircle className="w-10 h-10 text-destructive" />
            </motion.div>

            <h1 className="text-3xl font-bold mb-3">Payment Failed</h1>
            <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
              {errorMessage}
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Don&apos;t worry — no money has been deducted from your account.
            </p>

            {/* Error details */}
            {orderId && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card rounded-2xl border border-border/50 p-6 mb-8"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Order Reference</span>
                  <span className="font-mono text-sm">{orderId}</span>
                </div>
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleRetry}
                size="lg"
                className="gap-2 rounded-full"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Payment
              </Button>
              <Link to="/shop">
                <Button variant="outline" size="lg" className="gap-2 rounded-full w-full">
                  <ShoppingBag className="w-4 h-4" />
                  Continue Shopping
                </Button>
              </Link>
              <a href="mailto:rahul.work1017@gmail.com">
                <Button variant="ghost" size="lg" className="gap-2 rounded-full w-full">
                  <Headphones className="w-4 h-4" />
                  Contact Support
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

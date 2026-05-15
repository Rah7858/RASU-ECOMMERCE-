import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ShoppingBag, Headphones, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { products } from "@/data/products";

const ACTION_BUTTONS = [
  { label: "Go Home", href: "/", icon: Home },
  { label: "Browse Products", href: "/shop", icon: ShoppingBag },
  { label: "Contact Support", href: "mailto:rahul.work1017@gmail.com", icon: Headphones, external: true },
] as const;

function getRandomProducts(count: number) {
  const shuffled = [...products].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

const NotFound = () => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const randomProducts = useMemo(() => getRandomProducts(4), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    // production-grade: report to error tracking service
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="relative pt-24 pb-20 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <motion.div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/[0.04] blur-3xl"
            animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Geometric lines like hero */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[20, 40, 60, 80].map((pos, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={mounted ? { scaleX: 1, opacity: 0.3 } : {}}
              transition={{ duration: 1.5, delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 right-0 origin-left"
              style={{ top: `${pos}%` }}
            >
              <div className="h-[1px] bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
            </motion.div>
          ))}
        </div>

        <div className="relative container mx-auto px-4 md:px-8">
          {/* 404 Glitch Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center pt-16 md:pt-24 pb-12"
          >
            {/* Glitch 404 */}
            <div className="relative inline-block mb-8" aria-label="404 error">
              <h1 className="glitch-text text-[120px] sm:text-[160px] md:text-[200px] font-black leading-none tracking-tighter select-none">
                404
              </h1>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-2xl md:text-3xl font-semibold text-foreground mb-3"
            >
              Lost in the future?
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-muted-foreground text-lg max-w-md mx-auto mb-10"
            >
              The page you&apos;re looking for doesn&apos;t exist or has been moved to another dimension.
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {ACTION_BUTTONS.map(({ label, href, icon: Icon, external }) => {
                const buttonContent = (
                  <Button
                    variant={label === "Go Home" ? "default" : "outline"}
                    size="lg"
                    className="gap-2 rounded-full"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                );

                if (external) {
                  return (
                    <a key={label} href={href}>
                      {buttonContent}
                    </a>
                  );
                }

                return (
                  <Link key={label} to={href}>
                    {buttonContent}
                  </Link>
                );
              })}
            </motion.div>
          </motion.div>

          {/* You might like these */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="pt-8 pb-12"
            aria-label="Suggested products"
          >
            <h2 className="text-xl font-semibold text-center mb-8">
              You might like these
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {randomProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="group block bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        width={300}
                        height={375}
                      />
                    </div>
                    <div className="p-3 md:p-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        {product.subcategory}
                      </p>
                      <h3 className="font-medium text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />

      {/* Glitch animation CSS */}
      <style>{`
        .glitch-text {
          position: relative;
          color: hsl(var(--foreground));
          text-shadow: 
            0.05em 0 0 hsl(var(--primary) / 0.75),
            -0.025em -0.05em 0 hsl(var(--accent) / 0.75),
            0.025em 0.05em 0 hsl(var(--destructive) / 0.75);
          animation: glitch 2s infinite;
        }

        @keyframes glitch {
          0% {
            text-shadow: 
              0.05em 0 0 hsl(var(--primary) / 0.75),
              -0.025em -0.05em 0 hsl(var(--accent) / 0.75),
              0.025em 0.05em 0 hsl(var(--destructive) / 0.75);
          }
          14% {
            text-shadow: 
              0.05em 0 0 hsl(var(--primary) / 0.75),
              -0.025em -0.05em 0 hsl(var(--accent) / 0.75),
              0.025em 0.05em 0 hsl(var(--destructive) / 0.75);
          }
          15% {
            text-shadow: 
              -0.05em -0.025em 0 hsl(var(--primary) / 0.75),
              0.025em 0.025em 0 hsl(var(--accent) / 0.75),
              -0.05em -0.05em 0 hsl(var(--destructive) / 0.75);
          }
          49% {
            text-shadow: 
              -0.05em -0.025em 0 hsl(var(--primary) / 0.75),
              0.025em 0.025em 0 hsl(var(--accent) / 0.75),
              -0.05em -0.05em 0 hsl(var(--destructive) / 0.75);
          }
          50% {
            text-shadow: 
              0.025em 0.05em 0 hsl(var(--primary) / 0.75),
              0.05em 0 0 hsl(var(--accent) / 0.75),
              0 -0.05em 0 hsl(var(--destructive) / 0.75);
          }
          99% {
            text-shadow: 
              0.025em 0.05em 0 hsl(var(--primary) / 0.75),
              0.05em 0 0 hsl(var(--accent) / 0.75),
              0 -0.05em 0 hsl(var(--destructive) / 0.75);
          }
          100% {
            text-shadow: 
              -0.025em 0 0 hsl(var(--primary) / 0.75),
              -0.025em -0.025em 0 hsl(var(--accent) / 0.75),
              -0.025em -0.05em 0 hsl(var(--destructive) / 0.75);
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;

import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Eye, Sparkles } from "lucide-react";
import rasuLogo from "@/assets/rasu-logo.png";
import { useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const products = [
  {
    id: 1,
    name: "Urban Tech Jacket",
    price: 189,
    originalPrice: 249,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    category: "Outerwear",
    isNew: true,
  },
  {
    id: 2,
    name: "Minimal Hoodie",
    price: 89,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
    category: "Hoodies",
    isNew: false,
  },
  {
    id: 3,
    name: "Street Cargo Pants",
    price: 129,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    category: "Pants",
    isNew: true,
  },
  {
    id: 4,
    name: "Classic Tee",
    price: 49,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    category: "T-Shirts",
    isNew: false,
  },
  {
    id: 5,
    name: "Premium Sneakers",
    price: 199,
    originalPrice: 259,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    category: "Footwear",
    isNew: true,
  },
  {
    id: 6,
    name: "Tech Backpack",
    price: 149,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    category: "Accessories",
    isNew: false,
  },
];

export function ProductsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { t } = useLanguage();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Animated geometric background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 geometric-lines opacity-30" />
        
        {/* Floating orbs */}
        <motion.div
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
        />
      </motion.div>

      {/* Animated horizontal lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[15, 50, 85].map((pos, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            style={{ top: `${pos}%`, transformOrigin: i % 2 === 0 ? "left" : "right" }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-8 relative">
        {/* Section Header with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-primary mb-4"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.span>
              {t("products.featured")}
            </motion.span>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: 100, skewY: 5 }}
                animate={isInView ? { y: 0, skewY: 0 } : {}}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              >
                {t("products.title")}
              </motion.h2>
            </div>
          </div>
          
          <Link to="/shop">
            <motion.button
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
              whileHover={{ scale: 1.05, x: 5, backgroundColor: "hsl(var(--foreground))", color: "hsl(var(--background))" }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 border border-foreground/20 rounded-full font-medium transition-all duration-300 relative overflow-hidden group"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <span className="relative z-10">{t("products.viewAll")} →</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.4 + index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <ProductCard product={product} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -12 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-colors duration-500"
      >
        {/* Glow effect on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-0"
              style={{
                boxShadow: "inset 0 0 60px hsl(var(--primary) / 0.1)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Animated overlay gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"
            animate={{ opacity: isHovered ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          />

          {/* RASU brand watermark */}
          <motion.div
            className="absolute bottom-4 right-4 opacity-30"
            animate={{ opacity: isHovered ? 0.5 : 0.3 }}
          >
            <img loading="lazy" src={rasuLogo} alt="" className="h-8 dark:invert" />
          </motion.div>

          {/* Badges with animation */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <motion.span
                initial={{ opacity: 0, x: -30, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, type: "spring", bounce: 0.5 }}
                className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-glow-sm"
              >
                <motion.span
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  NEW
                </motion.span>
              </motion.span>
            )}
            {product.originalPrice && (
              <motion.span
                initial={{ opacity: 0, x: -30, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1, type: "spring", bounce: 0.5 }}
                className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full"
              >
                SALE
              </motion.span>
            )}
          </div>

          {/* Quick Actions with staggered reveal */}
          <motion.div
            className="absolute top-4 right-4 flex flex-col gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            {[Heart, Eye].map((Icon, i) => (
              <motion.button
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 1 : 0 }}
                transition={{ delay: i * 0.1, type: "spring", bounce: 0.5 }}
                whileHover={{ scale: 1.2, backgroundColor: "hsl(var(--primary))" }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:text-primary-foreground transition-colors"
                aria-label={i === 0 ? "Add to wishlist" : "Quick view"}
              >
                <Icon className="w-4 h-4" />
              </motion.button>
            ))}
          </motion.div>

          {/* Add to Cart overlay with slide-up */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 0 30px hsl(var(--primary) / 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              />
              <ShoppingBag className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Add to Cart</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          <motion.p
            className="text-xs text-muted-foreground uppercase tracking-wider mb-2"
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {product.category}
          </motion.p>
          <motion.h3
            className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors"
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            {product.name}
          </motion.h3>
          <motion.div
            className="flex items-center gap-2"
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <span className="text-xl font-bold">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </motion.div>
        </div>

        {/* Bottom animated line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>
    </Link>
  );
}

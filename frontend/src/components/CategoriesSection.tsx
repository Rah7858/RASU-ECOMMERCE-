import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const categories = [
  {
    name: "Men",
    href: "/shop?category=men",
    images: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80",
      "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&q=80",
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80",
    ],
    count: "120+ Products",
  },
  {
    name: "Women",
    href: "/shop?category=women",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    ],
    count: "150+ Products",
  },
  {
    name: "Accessories",
    href: "/shop?category=accessories",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
      "https://images.unsplash.com/photo-1509941943102-10c232fc06e0?w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
    ],
    count: "80+ Products",
  },
  {
    name: "Trending",
    href: "/shop?category=trending",
    images: [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
    count: "New Arrivals",
  },
];

export function CategoriesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { t } = useLanguage();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Animated background decorations */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.5 }}
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
        />
      </motion.div>

      {/* Animated grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        {[20, 40, 60, 80].map((pos, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 0.1 } : {}}
            transition={{ duration: 1.5, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
            style={{ top: `${pos}%`, transformOrigin: i % 2 === 0 ? "left" : "right" }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-8 relative">
        {/* Section Header with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-block text-sm font-medium tracking-widest uppercase text-primary mb-4"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {t("categories.browse")}
            </motion.span>
          </motion.span>
          
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: 100, skewY: 5 }}
              animate={isInView ? { y: 0, skewY: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              {t("categories.title")}
            </motion.h2>
          </div>
        </motion.div>

        {/* Categories Grid with staggered reveal and parallax */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <ParallaxCard key={category.name} index={index} isInView={isInView}>
              <CategoryCard category={category} index={index} />
            </ParallaxCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function ParallaxCard({ children, index, isInView }: { children: React.ReactNode; index: number; isInView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Different parallax speeds for each card
  const parallaxOffsets = [30, -20, 40, -30];
  const yOffset = useTransform(
    scrollYProgress, 
    [0, 1], 
    [parallaxOffsets[index % 4], -parallaxOffsets[index % 4]]
  );

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.8,
        delay: 0.4 + index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div style={{ y: yOffset }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

function CategoryCard({ category, index }: { category: typeof categories[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Auto-rotate images on hover
  useEffect(() => {
    if (!isHovered) {
      setCurrentImageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % category.images.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [isHovered, category.images.length]);

  // Reset loaded state when image changes
  useEffect(() => {
    setImageLoaded(false);
  }, [currentImageIndex]);

  return (
    <Link 
      to={category.href} 
      className="group block relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        ref={cardRef}
        whileHover={{ scale: 1.03, y: -10 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative aspect-[3/4] rounded-2xl overflow-hidden"
      >
        {/* Shimmer skeleton loader */}
        <AnimatePresence>
          {!imageLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-muted z-10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" 
                style={{ 
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite linear'
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image with Ken Burns effect */}
        <div className="absolute inset-0 bg-muted overflow-hidden">
          <AnimatePresence mode="sync">
            <motion.img
              key={currentImageIndex}
              src={category.images[currentImageIndex]}
              alt={category.name}
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ 
                opacity: imageLoaded ? 1 : 0, 
                scale: isHovered ? 1.3 : 1.1,
                x: isHovered ? (currentImageIndex % 2 === 0 ? "3%" : "-3%") : "0%",
                y: isHovered ? (currentImageIndex % 3 === 0 ? "2%" : "-2%") : "0%",
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: 0.6 },
                scale: { duration: 8, ease: "linear" },
                x: { duration: 8, ease: "linear" },
                y: { duration: 8, ease: "linear" },
              }}
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80`;
                setImageLoaded(true);
              }}
            />
          </AnimatePresence>
        </div>

        {/* Image indicators */}
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-4 right-4 flex gap-1 z-10"
          >
            {category.images.map((_, imgIndex) => (
              <div
                key={imgIndex}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  imgIndex === currentImageIndex 
                    ? "bg-primary" 
                    : "bg-white/40"
                }`}
              />
            ))}
          </motion.div>
        )}

        {/* Animated overlay gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/8 to-transparent dark:from-background/95 dark:via-background/30"
          whileHover={{ opacity: 0.9 }}
          transition={{ duration: 0.3 }}
        />

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at 50% 100%, hsl(var(--primary) / 0.2) 0%, transparent 60%)",
          }}
        />

        {/* Glassmorphism card with slide-up animation */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-4 left-4 right-4"
        >
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-xl backdrop-blur-md border border-black/10 bg-white/65 shadow-sm dark:glass dark:border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <motion.h3
                  className="text-xl font-bold"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {category.name}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="text-sm text-muted-foreground"
                >
                  {category.count}
                </motion.p>
              </div>
              <motion.div
                whileHover={{ scale: 1.2, rotate: 45 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center"
              >
                <motion.div
                  animate={{ x: [0, 3, 0], y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowUpRight className="w-5 h-5" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Animated border on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/40 transition-colors duration-500"
          style={{ 
            background: "linear-gradient(hsl(var(--background)), hsl(var(--background))) padding-box, linear-gradient(135deg, hsl(var(--primary) / 0.5), hsl(var(--accent) / 0.5)) border-box"
          }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </motion.div>
    </Link>
  );
}

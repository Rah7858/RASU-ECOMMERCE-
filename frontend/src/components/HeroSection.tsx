import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, TrendingUp, Star, Play, Zap, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import heroModel from "@/assets/hero-model.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

// Magnetic button hook
function useMagnetic(ref: React.RefObject<HTMLElement>) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;

      x.set(distX * 0.3);
      y.set(distY * 0.3);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref, x, y]);

  return { x: springX, y: springY };
}

// Text reveal animation component
function RevealText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className="overflow-hidden inline-block">
      <motion.span
        initial={{ y: "100%", rotateX: -90 }}
        animate={{ y: "0%", rotateX: 0 }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        className={`inline-block ${className}`}
        style={{ transformOrigin: "top" }}
      >
        {text}
      </motion.span>
    </span>
  );
}

// Floating particle component
function FloatingParticle({ delay, size, x, y }: { delay: number; size: number; x: number; y: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
        y: [0, -100],
        x: [0, Math.random() * 40 - 20],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
      className="absolute rounded-full bg-primary/60"
      style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
    />
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { x: magneticX, y: magneticY } = useMagnetic(buttonRef as React.RefObject<HTMLElement>);
  const { t } = useLanguage();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 0.85]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Morphing blob animation
  const blobPath1 = "M45.7,-51.2C59.1,-40.9,70.1,-26.3,72.4,-10.4C74.8,5.5,68.4,22.8,57.7,36.3C47,49.8,32,59.5,15.3,65.2C-1.4,70.9,-19.7,72.5,-35.4,66.1C-51.1,59.7,-64.1,45.2,-70.5,28.3C-76.9,11.4,-76.6,-8,-69.5,-24.3C-62.4,-40.6,-48.4,-53.9,-33.5,-63.7C-18.6,-73.5,-2.9,-79.9,10.7,-76.6C24.3,-73.3,32.2,-61.5,45.7,-51.2Z";
  const blobPath2 = "M43.5,-52.5C56.9,-42.8,68.6,-30.2,72.8,-15.1C77,0,73.8,17.5,65.3,31.8C56.8,46.1,43,57.2,27.7,63.3C12.4,69.4,-4.4,70.5,-20.8,66.5C-37.2,62.5,-53.2,53.4,-63.2,39.5C-73.2,25.6,-77.2,6.9,-74.1,-10.6C-71,-28.1,-60.8,-44.4,-47.2,-54.1C-33.6,-63.8,-16.8,-66.9,-0.7,-66C15.4,-65.1,30.1,-62.2,43.5,-52.5Z";

  // Horizontal segmented lines like VEXO
  const segmentLines = [10, 22, 34, 46, 58, 70, 82, 94];

  // Generate particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    delay: i * 0.5,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: 50 + Math.random() * 50,
  }));

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-background"
    >
      {/* Background Image with Parallax */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0"
      >
        <motion.img
          initial={{ scale: 1.3, opacity: 0, filter: "blur(10px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          src={heroModel}
          alt="RASU Fashion"
          className="w-full h-full object-cover object-top brightness-112 contrast-100 saturate-100 dark:brightness-100 dark:contrast-100 dark:saturate-100"
        />
      </motion.div>

      <div className="absolute inset-0 bg-white/12 dark:bg-transparent" />

      {/* Theme-aware overlays: bright in light mode, cinematic in dark mode */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-r from-white/72 via-white/24 to-white/5 dark:from-background dark:via-background/70 dark:to-transparent"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-gradient-to-t from-white/32 via-transparent to-white/22 dark:from-background dark:via-transparent dark:to-background/60"
      />

      {/* Animated grain overlay */}
      <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none" />

      {/* Morphing Blob Shape */}
      <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[600px] h-[600px] opacity-20 pointer-events-none">
        <motion.svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <motion.path
            fill="hsl(var(--primary) / 0.3)"
            animate={{
              d: [blobPath1, blobPath2, blobPath1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            transform="translate(100 100)"
          />
        </motion.svg>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle, i) => (
          <FloatingParticle key={i} {...particle} />
        ))}
      </div>

      {/* VEXO-Style Horizontal Segment Lines with Pulse */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {segmentLines.map((pos, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
              duration: 1.5,
              delay: 0.5 + i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute left-0 right-0 origin-left"
            style={{ top: `${pos}%` }}
          >
            <div className="relative h-[1px]">
              {/* Main line with animated glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/50 via-primary/20 to-transparent"
                animate={{
                  opacity: [0.5, 0.9, 0.5],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent blur-sm"
                animate={{
                  opacity: [0.35, 0.7, 0.35],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Left accent dot with pulse */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{
                  scale: { delay: 1.2 + i * 0.08, duration: 2, repeat: Infinity },
                }}
                className="absolute left-4 md:left-8 -top-1 w-2.5 h-2.5 rounded-full bg-white/85 dark:bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.8)] ring-1 ring-white/50 dark:ring-primary/40"
              />
              {/* Moving light */}
              <motion.div
                className="absolute h-full w-20 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                animate={{
                  left: ["-10%", "110%"],
                }}
                transition={{
                  duration: 3,
                  delay: 2 + i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        ))}

        {/* Vertical accent lines with animation */}
        {[12, 88].map((pos, i) => (
          <motion.div
            key={`v-${i}`}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 0.4 }}
            transition={{
              duration: 1.8,
              delay: 1 + i * 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute top-0 bottom-0 w-[1px] origin-top"
            style={{ left: `${pos}%` }}
          >
            <motion.div
              className="h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent"
              animate={{
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Floating Geometric Shapes with enhanced animations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large circle outline with rotation */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -90 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/2 right-[12%] -translate-y-1/2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full border border-primary/20"
          />
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/2 right-[12%] -translate-y-1/2"
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full border border-primary/10"
          />
        </motion.div>

        {/* Corner brackets with draw animation */}
        <motion.div
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute top-24 left-8"
        >
          <svg width="64" height="64" viewBox="0 0 64 64" className="stroke-primary/40">
            <motion.path
              d="M 2 64 L 2 2 L 64 2"
              fill="none"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
            />
          </svg>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-24 right-8"
        >
          <svg width="64" height="64" viewBox="0 0 64 64" className="stroke-primary/40">
            <motion.path
              d="M 62 0 L 62 62 L 0 62"
              fill="none"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.7, duration: 1, ease: "easeOut" }}
            />
          </svg>
        </motion.div>

        {/* Additional floating shapes */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute top-1/3 left-[20%]"
        >
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-4 h-4 border-2 border-primary/40 rotate-45"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="absolute bottom-1/3 left-[15%]"
        >
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 rounded-full border border-accent/30"
          />
        </motion.div>
      </div>

      {/* Main Content with parallax */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative h-full container mx-auto px-4 md:px-8 flex items-center"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full pt-20">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 z-10">
            {/* Main Headline with Enhanced Reveal */}
            <div className="overflow-hidden">
              {[t("hero.title1"), t("hero.title2"), t("hero.title3")].map((word, index) => (
                <motion.div
                  key={word}
                  initial={{ y: 150, opacity: 0, skewY: 8, filter: "blur(8px)" }}
                  animate={{ y: 0, opacity: 1, skewY: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 1.2,
                    delay: 0.4 + index * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="overflow-hidden"
                >
                  <motion.h1
                    whileHover={{ x: 10, color: index === 1 ? undefined : "hsl(var(--primary))" }}
                    transition={{ duration: 0.3 }}
                    className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85] cursor-default ${
                      index === 1 ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {word.split("").map((char, charIndex) => (
                      <motion.span
                        key={charIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.1,
                          delay: 0.6 + index * 0.12 + charIndex * 0.03,
                        }}
                        className="inline-block"
                        whileHover={{ y: -5, scale: 1.1 }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.h1>
                </motion.div>
              ))}
            </div>

            {/* Subtitle with character animation */}
            <motion.p
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed"
            >
              {t("hero.description")}
            </motion.p>

            {/* CTA Buttons with Magnetic Effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link to="/shop">
                <motion.button
                  ref={buttonRef}
                  style={{ x: magneticX, y: magneticY }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full overflow-hidden"
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%]"
                    animate={{
                      backgroundPosition: isHovered ? ["0% 0%", "100% 0%"] : "0% 0%",
                    }}
                    transition={{ duration: 0.8 }}
                  />
                  {/* Glow effect */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 shadow-glow"
                        style={{ boxShadow: "0 0 60px hsl(var(--primary) / 0.6)" }}
                      />
                    )}
                  </AnimatePresence>
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: isHovered ? "100%" : "-100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 flex items-center gap-3">
                    {t("hero.explore")}
                    <motion.span
                      animate={{ x: isHovered ? 8 : 0 }}
                      className="inline-block"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </span>
                </motion.button>
              </Link>

              <Link to="/shop?category=trending">
                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: "hsl(var(--muted))" }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 font-semibold rounded-full border border-foreground/20 backdrop-blur-sm flex items-center gap-3 transition-colors relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Play className="w-5 h-5 fill-current" />
                  </motion.span>
                  <span className="relative z-10">{t("hero.lookbook")}</span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats with counter animation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-10 pt-6"
            >
              {[
                { value: "50K+", label: "Happy Customers" },
                { value: "200+", label: "Unique Designs" },
                { value: "4.9", label: "Rating", icon: Star },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center cursor-default group"
                >
                  <motion.div
                    className="flex items-center justify-center gap-1"
                    whileHover={{ color: "hsl(var(--primary))" }}
                  >
                    <span className="text-2xl md:text-3xl font-bold">
                      {stat.value}
                    </span>
                    {stat.icon && (
                      <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      >
                        <stat.icon className="w-5 h-5 text-accent fill-accent" />
                      </motion.span>
                    )}
                  </motion.div>
                  <span className="text-sm text-muted-foreground tracking-wide group-hover:text-foreground transition-colors">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right side - Premium Floating Widgets */}
          <div className="hidden lg:block relative h-full">
            {/* Trending Widget with enhanced animation */}
            <motion.div
              initial={{ opacity: 0, x: 80, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.08, rotate: -2, y: -5 }}
              className="absolute top-32 right-0 glass p-5 rounded-2xl border border-primary/10 shadow-glow-sm cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.15, 1],
                    boxShadow: ["0 0 0 0 hsl(var(--primary) / 0.2)", "0 0 20px 5px hsl(var(--primary) / 0.3)", "0 0 0 0 hsl(var(--primary) / 0.2)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-14 h-14 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center"
                >
                  <TrendingUp className="w-7 h-7 text-primary" />
                </motion.div>
                <div>
                  <p className="text-base font-semibold">Trending Now</p>
                  <motion.p
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-sm text-primary font-medium"
                  >
                    +24% this week
                  </motion.p>
                </div>
              </div>
            </motion.div>

            {/* Price Widget with draw-in effect */}
            <motion.div
              initial={{ opacity: 0, y: 80, rotate: -5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1.2, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.08, rotate: 2, y: -5 }}
              className="absolute bottom-48 right-20 glass p-5 rounded-2xl border border-primary/10 shadow-glow-sm cursor-pointer overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 relative z-10">
                Starting from
              </p>
              <p className="text-3xl font-bold relative z-10">₹7,499</p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 2.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mt-2 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full origin-left"
              />
            </motion.div>

            {/* Quick View Widget with ripple */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.8, type: "spring", bounce: 0.5 }}
              whileHover={{ scale: 1.15 }}
              className="absolute top-1/2 right-8 cursor-pointer"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 0 hsl(var(--primary) / 0.4)",
                    "0 0 0 20px hsl(var(--primary) / 0)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-14 h-14 glass rounded-full flex items-center justify-center border border-primary/20"
              >
                <Play className="w-6 h-6 text-primary fill-primary" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator with enhanced animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
        >
          Scroll
        </motion.span>
        <motion.div
          className="w-6 h-12 rounded-full border-2 border-foreground/20 flex items-start justify-center p-2"
          animate={{ borderColor: ["hsl(var(--foreground) / 0.2)", "hsl(var(--primary) / 0.4)", "hsl(var(--foreground) / 0.2)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.div
            animate={{ y: [0, 16, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-primary rounded-full shadow-glow-sm"
          />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

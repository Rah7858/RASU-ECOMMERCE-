import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect, useCallback } from "react";
import heroModel from "@/assets/hero-model.jpg";

const SKILL_BADGES = [
  { emoji: "⚡", label: "React 18 + TypeScript" },
  { emoji: "🔒", label: "JWT Authentication" },
  { emoji: "🎮", label: "Three.js 3D Models" },
] as const;

// Magnetic button hook
function useMagnetic(ref: React.RefObject<HTMLElement>) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      // Calculate distance to center
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      // Apply magnetic pull only if within ~60px radius of button center
      const distance = Math.sqrt(distX * distX + distY * distY);
      if (distance < 100) {
        x.set(distX * 0.3);
        y.set(distY * 0.3);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref, x, y]);

  return { x: springX, y: springY };
}

// 3D Tilt Image hook
function useTilt(ref: React.RefObject<HTMLElement>) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 20 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Calculate rotation between -8 and 8 degrees
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      
      rotateX.set(yPct * -16); // negative so it tilts towards mouse
      rotateY.set(xPct * 16);
    };

    const handleMouseLeave = () => {
      rotateX.set(0);
      rotateY.set(0);
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref, rotateX, rotateY]);

  return { rotateX: springRotateX, rotateY: springRotateY };
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const magneticBtnRef = useRef<HTMLButtonElement>(null);
  const tiltImageRef = useRef<HTMLDivElement>(null);
  const { x: magneticX, y: magneticY } = useMagnetic(magneticBtnRef);
  const { rotateX, rotateY } = useTilt(tiltImageRef);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToTechStack = useCallback(() => {
    const footer = document.getElementById("tech-footer");
    if (footer) footer.scrollIntoView({ behavior: "smooth" });
  }, []);

  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const leftColumnX = useTransform(scrollY, [0, 500], [0, -50]);
  const leftColumnOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const rightColumnY = useTransform(scrollY, [0, 500], [0, 100]);

  // Framer Motion Variants for Staggered Entrance
  const headlineWords = ["DEFINE", "YOUR", "FUTURE"];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const wordVariants = {
    hidden: { y: "100%" },
    visible: { 
      y: "0%", 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section ref={containerRef} className="relative w-full bg-background overflow-hidden selection:bg-primary/30 pt-16 sm:pt-20 md:pt-24" style={{ minHeight: "calc(100vh - 4rem)" }}>
      
      {/* 1. Static Mesh Gradient Backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Top left subtle glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary opacity-[0.15] blur-[120px]" />
        {/* Bottom right accent glow */}
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-accent opacity-[0.12] blur-[150px]" />
      </div>

      {/* 2. Asymmetric CSS Grid Layout */}
      <div className="relative z-10 w-full h-full container mx-auto px-4 sm:px-6 md:px-12 xl:px-16 grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-8 items-center" style={{ minHeight: "calc(100vh - 4rem)" }}>
        
        {/* LEFT COLUMN: Typography & CTAs */}
        <motion.div 
          className="flex flex-col justify-center order-2 lg:order-1 pb-24 lg:pb-0 h-full"
          style={{ x: isMobile ? 0 : leftColumnX, opacity: isMobile ? 1 : leftColumnOpacity }}
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Editorial Mask Reveal Headline */}
          <motion.h1 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col font-black uppercase tracking-tighter text-foreground"
            style={{ 
              fontSize: "clamp(1.4rem, 10vw, 7rem)", 
              lineHeight: 0.9 
            }}
          >
            {headlineWords.map((word, i) => (
              <span key={i} className="overflow-hidden pb-1 block">
                <motion.span 
                  variants={wordVariants}
                  className="block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* Glassmorphism Skill Badges */}
          <motion.div 
            className="mt-6 flex flex-wrap gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.75 } }
            }}
          >
            {SKILL_BADGES.map((badge) => (
              <motion.div
                key={badge.label}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium tracking-wide border"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <span aria-hidden="true">{badge.emoji}</span>
                <span className="text-foreground/90">{badge.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
            className="mt-6 text-base font-medium text-muted-foreground max-w-[480px] leading-relaxed"
          >
            Premium Futuristic Fashion — Designed for Those Who Lead
          </motion.p>

          {/* Premium Micro-interaction CTAs */}
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/shop" className="w-full sm:w-auto relative group z-20">
              <motion.button
                ref={magneticBtnRef}
                style={{ x: magneticX, y: magneticY }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-full flex items-center justify-center gap-3 transition-all duration-300 ease-out hover:scale-[1.02] hover:brightness-110 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/40"
              >
                Shop Now
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </Link>

            <button
              onClick={scrollToTechStack}
              className="w-full sm:w-auto group px-8 py-4 font-medium rounded-full border border-border bg-transparent text-foreground flex items-center justify-center gap-3 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:text-primary z-10"
            >
              View Tech Stack
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>

        </motion.div>

        {/* RIGHT COLUMN: 3D Physics Tilt Product Visual */}
        <motion.div 
          className="relative w-full h-[40vh] sm:h-[50vh] lg:h-[80vh] flex items-center justify-center order-1 lg:order-2 perspective-1000"
          style={{ y: isMobile ? 0 : rightColumnY }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1.0 }}
          transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Radial soft glow behind image */}
          <motion.div 
            className="absolute w-[80%] h-[80%] rounded-full bg-primary/20 blur-[80px] -z-10"
            style={{ x: rotateY, y: rotateX }} // Move glow opposite to tilt
          />

          <motion.div
            ref={tiltImageRef}
            className="relative w-full max-w-[500px] aspect-[4/5] rounded-2xl overflow-hidden will-change-transform"
            style={{ 
              rotateX, 
              rotateY,
              transformStyle: "preserve-3d"
            }}
          >
            {/* Shifting box shadow tied to tilt */}
            <motion.div 
              className="absolute inset-0 rounded-2xl pointer-events-none transition-shadow duration-100"
              style={{
                boxShadow: useTransform(
                  [rotateX, rotateY],
                  ([rx, ry]) => `${-Number(ry)*2}px ${Number(rx)*2}px 40px rgba(0,0,0,0.3)`
                ) as any
              }}
            />

            {/* Inner Border Highlight (Glass edge) */}
            <div className="absolute inset-0 rounded-2xl border border-white/20 dark:border-white/10 z-20 pointer-events-none" />

            <img 
              // @ts-ignore - fetchPriority is supported in React 18.3+ but types might complain
              fetchpriority="high"
              src={heroModel} 
              alt="RASU Premium Product" 
              className="w-full h-full object-cover object-top scale-[1.02]" // scale slightly to prevent edge clipping during tilt
            />
            
            {/* Subtle inner gradient to frame the image nicely */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 z-10 pointer-events-none" />
          </motion.div>

        </motion.div>

      </div>

      {/* Animated Scroll Indicator */}
      <motion.div 
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-8 left-6 md:left-12 xl:left-16 z-20 pointer-events-none flex flex-col items-start gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-semibold" style={{ fontVariant: "small-caps" }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 opacity-50" />
        </motion.div>
      </motion.div>

    </section>
  );
}

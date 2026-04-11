import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";

export function BrandStorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-card relative overflow-hidden">
      {/* Animated background decorations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1.5 }}
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent"
      />
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ 
            rotate: 360,
            y: [0, -20, 0],
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute top-20 right-[20%] w-32 h-32 border border-primary/20 rounded-xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            x: [0, 20, 0],
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            x: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute bottom-32 left-[10%] w-24 h-24 border border-accent/20 rounded-full"
        />
      </div>

      {/* Animated grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        {[30, 70].map((pos, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.3 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent"
            style={{ left: `${pos}%`, transformOrigin: "top" }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image with parallax */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, x: -80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden"
            >
              <motion.img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
                alt="RASU Brand Story"
                className="w-full h-full object-cover"
                initial={{ scale: 1.2, filter: "blur(10px)" }}
                animate={isInView ? { scale: 1, filter: "blur(0px)" } : {}}
                transition={{ duration: 1.5 }}
                whileHover={{ scale: 1.08 }}
              />
              
              {/* Overlay with animated gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
              />
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
              />
            </motion.div>

            {/* Floating stat card with enhanced animation */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.8, rotate: -5 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1, rotate: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.8, type: "spring", bounce: 0.4 }}
              whileHover={{ scale: 1.08, rotate: 3, y: -10 }}
              className="absolute -bottom-8 -right-8 glass p-6 rounded-2xl border border-primary/10 shadow-glow-sm cursor-pointer"
            >
              <motion.p
                className="text-4xl font-bold text-primary"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1, type: "spring", bounce: 0.5 }}
              >
                2020
              </motion.p>
              <motion.p
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.2 }}
              >
                Founded
              </motion.p>
              
              {/* Animated underline */}
              <motion.div
                className="mt-2 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 1.3, duration: 0.5 }}
                style={{ transformOrigin: "left" }}
              />
            </motion.div>

            {/* Decorative corner bracket with draw animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="absolute -top-4 -left-4"
            >
              <svg width="96" height="96" viewBox="0 0 96 96" className="stroke-primary/30">
                <motion.path
                  d="M 2 96 L 2 2 L 96 2"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* Right - Content with parallax */}
          <motion.div
            style={{ y: contentY }}
            initial={{ opacity: 0, x: 80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="inline-block text-sm font-medium tracking-widest uppercase text-primary"
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Our Story
              </motion.span>
            </motion.span>

            {/* Animated headline */}
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: 100, skewY: 5 }}
                animate={isInView ? { y: 0, skewY: 0 } : {}}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
              >
                Fashion That
                <br />
                <motion.span
                  animate={{ 
                    color: ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--primary))"]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-primary"
                >
                  Defines Tomorrow
                </motion.span>
              </motion.h2>
            </div>

            {/* Animated paragraphs */}
            {[
              "RASU was born from a vision to blend futuristic aesthetics with everyday wearability. We believe fashion should empower, inspire, and push boundaries.",
              "Every piece we create is a statement — crafted with premium materials, designed with purpose, and made for those who dare to stand out."
            ].map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + i * 0.15, duration: 0.8 }}
                className="text-lg text-muted-foreground leading-relaxed max-w-lg"
              >
                {text}
              </motion.p>
            ))}

            {/* Features with staggered animation */}
            <div className="grid grid-cols-2 gap-6 py-6">
              {[
                { value: "100%", label: "Premium Materials" },
                { value: "50+", label: "Countries Shipped" },
                { value: "24/7", label: "Customer Support" },
                { value: "30-Day", label: "Easy Returns" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.8 + index * 0.1, type: "spring", bounce: 0.4 }}
                  whileHover={{ scale: 1.08, y: -5 }}
                  className="cursor-default group"
                >
                  <motion.p
                    className="text-2xl font-bold text-primary"
                    whileHover={{ scale: 1.1 }}
                  >
                    {feature.value}
                  </motion.p>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {feature.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA Button with enhanced animation */}
            <Link to="/about">
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.2, duration: 0.8 }}
                whileHover={{ scale: 1.03, x: 10 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-4 bg-foreground text-background font-semibold rounded-full flex items-center gap-3 relative overflow-hidden"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
                />
                
                <span className="relative z-10">Learn More About Us</span>
                <motion.span
                  className="relative z-10"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

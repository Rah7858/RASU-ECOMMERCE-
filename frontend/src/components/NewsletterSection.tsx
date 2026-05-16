import { motion, useInView } from "framer-motion";
import { Send, Sparkles, CheckCircle } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export function NewsletterSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { t } = useTranslation();

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Animated radial background */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Geometric lines with draw animation */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent origin-left"
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent origin-right"
        />
        
        {/* Vertical lines */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent origin-top"
        />
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent origin-bottom"
        />
      </div>

      {/* Rotating decorative ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="w-[600px] h-[600px] border border-primary/5 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-8 border border-primary/10 rounded-full"
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-8 relative"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
            
            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{
                boxShadow: [
                  "0 0 0 0 hsl(var(--primary) / 0.2)",
                  "0 0 0 15px hsl(var(--primary) / 0)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          {/* Animated Heading */}
          <div className="overflow-hidden mb-6">
            <motion.h2
              initial={{ y: 100, skewY: 5 }}
              animate={isInView ? { y: 0, skewY: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              {t("home.newsletter_title")}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto"
          >
            {t("home.newsletter_sub")}
          </motion.p>

          {/* Enhanced Email Form */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative max-w-md mx-auto"
          >
            <motion.div
              animate={{
                boxShadow: isFocused
                  ? "0 0 40px hsl(var(--primary) / 0.3)"
                  : "0 0 20px hsl(var(--primary) / 0.1)",
              }}
              className="relative glass rounded-full p-2 border border-primary/20 transition-all duration-300"
            >
              <input
                type="email"
                placeholder={t("footer.newsletter_placeholder")}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full px-6 py-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none pr-36 transition-all"
              />
              <motion.button
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full flex items-center gap-2 overflow-hidden"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%]"
                  animate={{
                    backgroundPosition: isHovered ? ["0% 0%", "100% 0%"] : "0% 0%",
                  }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: isHovered ? "100%" : "-100%" }}
                  transition={{ duration: 0.6 }}
                />
                
                <motion.span
                  animate={{ x: isHovered ? 3 : 0 }}
                  className="relative z-10"
                >
                  <Send className="w-4 h-4" />
                </motion.span>
                <span className="hidden sm:inline relative z-10">{t("home.subscribe")}</span>
              </motion.button>
            </motion.div>

            {/* Animated ring around input on focus */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              animate={{
                boxShadow: isFocused
                  ? [
                      "0 0 0 0 hsl(var(--primary) / 0.4)",
                      "0 0 0 8px hsl(var(--primary) / 0)",
                    ]
                  : "0 0 0 0 transparent",
              }}
              transition={{ duration: 0.8, repeat: isFocused ? Infinity : 0 }}
            />
          </motion.div>

          {/* Trust badges with staggered animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            {[
              { text: "No spam, ever" },
              { text: "Unsubscribe anytime" },
              { text: "10% off first order" },
            ].map((badge, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9 + i * 0.1 }}
                whileHover={{ scale: 1.05, color: "hsl(var(--primary))" }}
                className="flex items-center gap-2 cursor-default"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  <CheckCircle className="w-4 h-4 text-primary" />
                </motion.span>
                {badge.text}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

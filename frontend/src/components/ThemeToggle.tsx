import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";
import { memo } from "react";

const SUN_RAYS_VARIANTS = {
  dark: { opacity: 0, scale: 0, rotate: -45 },
  light: { opacity: 1, scale: 1, rotate: 0 },
};

const MOON_MASK_VARIANTS = {
  dark: { cx: 12, cy: 4 },
  light: { cx: 30, cy: 0 },
};

const CENTER_CIRCLE_VARIANTS = {
  dark: { r: 9 },
  light: { r: 5 },
};

function ThemeToggleInner() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-full glass hover:bg-primary/10 transition-colors duration-200"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-foreground"
        initial={false}
        animate={{ rotate: isDark ? 0 : 360 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <defs>
          <mask id="rasu-theme-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <motion.circle
              initial={false}
              animate={isDark ? MOON_MASK_VARIANTS.dark : MOON_MASK_VARIANTS.light}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              r="9"
              fill="black"
            />
          </mask>
        </defs>

        {/* Center circle (sun body / moon body) */}
        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          stroke="none"
          mask="url(#rasu-theme-mask)"
          initial={false}
          animate={isDark ? CENTER_CIRCLE_VARIANTS.dark : CENTER_CIRCLE_VARIANTS.light}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Sun rays */}
        <motion.g
          initial={false}
          animate={isDark ? SUN_RAYS_VARIANTS.dark : SUN_RAYS_VARIANTS.light}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          stroke="currentColor"
        >
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </motion.g>
      </motion.svg>
    </motion.button>
  );
}

export function ThemeToggle() {
  return <ThemeToggleInner />;
}

export default memo(ThemeToggle);

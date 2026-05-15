import { memo, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, Globe, Mail } from "lucide-react";
import { useDeveloperBanner } from "@/hooks/useDeveloperBanner";

const GITHUB_URL = "https://github.com/Rah7858";
const PORTFOLIO_URL = "https://rkdev.online";
const HIRE_EMAIL = "mailto:rahul.work1017@gmail.com";

const CTA_LINKS = [
  { label: "GitHub", href: GITHUB_URL, icon: Github },
  { label: "Portfolio", href: PORTFOLIO_URL, icon: Globe },
  { label: "Hire Me", href: HIRE_EMAIL, icon: Mail },
] as const;

function DeveloperBannerInner() {
  const { isVisible, dismiss } = useDeveloperBanner();
  const bannerRef = useRef<HTMLDivElement>(null);
  const [bannerHeight, setBannerHeight] = useState(0);

  useEffect(() => {
    if (!bannerRef.current || !isVisible) {
      document.documentElement.style.setProperty("--banner-height", "0px");
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
        setBannerHeight(height);
        document.documentElement.style.setProperty("--banner-height", `${height}px`);
      }
    });

    observer.observe(bannerRef.current);

    return () => {
      observer.disconnect();
      document.documentElement.style.setProperty("--banner-height", "0px");
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Spacer to prevent CLS — matches banner height exactly */}
          <motion.div
            initial={{ height: bannerHeight }}
            exit={{ height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: bannerHeight }}
            aria-hidden="true"
          />

          <motion.div
            ref={bannerRef}
            role="banner"
            aria-label="Developer credit banner"
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-[60] dev-banner"
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-[hsl(240,10%,8%)] via-[hsl(220,15%,12%)] to-[hsl(240,10%,8%)] border-b border-primary/20">
              {/* Animated shimmer line */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>

              <div className="container mx-auto px-4 md:px-6 py-2.5">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                  {/* Credit text */}
                  <p className="text-[13px] sm:text-sm text-gray-200 text-center leading-tight">
                    <span className="mr-1.5" aria-hidden="true">🛠️</span>
                    <span className="font-semibold text-white">Built by Rahul Kumar</span>
                    <span className="mx-1.5 text-primary/60 hidden sm:inline">|</span>
                    <span className="hidden sm:inline text-gray-400">Full-Stack Developer</span>
                    <span className="block sm:hidden text-gray-400 text-xs mt-0.5">Full-Stack Developer</span>
                    <span className="hidden md:inline text-gray-500 ml-2">
                      React • Node.js • MongoDB • AI
                    </span>
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex items-center gap-2">
                    {CTA_LINKS.map(({ label, href, icon: Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target={href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full 
                          bg-white/[0.07] text-gray-300 hover:bg-primary/20 hover:text-primary 
                          border border-white/[0.08] hover:border-primary/30 
                          transition-all duration-200 tap-target"
                        aria-label={label === "Hire Me" ? "Send email to hire Rahul Kumar" : `Visit ${label}`}
                      >
                        <Icon className="w-3 h-3" />
                        <span className="hidden xs:inline">{label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dismiss button */}
              <button
                onClick={dismiss}
                className="absolute top-1/2 right-3 -translate-y-1/2 p-1.5 rounded-full
                  text-gray-500 hover:text-white hover:bg-white/10 
                  transition-colors duration-200 tap-target"
                aria-label="Dismiss developer banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export const DeveloperBanner = memo(DeveloperBannerInner);

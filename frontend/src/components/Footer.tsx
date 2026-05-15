import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Github, Linkedin, Globe, Mail, ExternalLink } from "lucide-react";
import rasuLogo from "@/assets/rasu-logo.png";
import { LanguageSelector } from "./LanguageSelector";
import { useTypewriter } from "@/hooks/useTypewriter";

const DEVELOPER = {
  name: "Rahul Kumar",
  github: "https://github.com/Rah7858",
  linkedin: "https://linkedin.com/in/rahulkumar",
  portfolio: "https://rkdev.online",
  email: "mailto:rahul.work1017@gmail.com",
  repo: "https://github.com/Rah7858/RASU-ECOMMERCE-",
} as const;

const TECH_STACK = [
  { name: "React 18", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg", version: "18.3.1" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg", version: "20.x" },
  { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg", version: "5.1.0", invertInDark: true },
  { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg", version: "7.x" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg", version: "5.8.3" },
  { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg", version: "3.4.17" },
  { name: "Three.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg", version: "0.160", invertInDark: true },
  { name: "Vite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg", version: "5.4.19" },
] as const;

const SOCIAL_LINKS = [
  { icon: Github, href: DEVELOPER.github, label: "GitHub" },
  { icon: Linkedin, href: DEVELOPER.linkedin, label: "LinkedIn" },
  { icon: Globe, href: DEVELOPER.portfolio, label: "Portfolio" },
  { icon: Mail, href: DEVELOPER.email, label: "Email" },
] as const;

const FOOTER_LINKS = {
  shop: [
    { name: "New Arrivals", href: "/shop?sort=new" },
    { name: "Best Sellers", href: "/shop?sort=popular" },
    { name: "Men", href: "/shop?category=men" },
    { name: "Women", href: "/shop?category=women" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
  ],
  support: [
    { name: "FAQ", href: "/faq" },
    { name: "Shipping", href: "/shipping" },
    { name: "Returns", href: "/returns" },
    { name: "Size Guide", href: "/size-guide" },
  ],
} as const;

const TYPING_PHRASES = [
  "Crafted with passion by Rahul Kumar",
  "Full-Stack Developer & Creator",
  "React • Node.js • AI • 3D Web",
];

function FooterInner() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const typedText = useTypewriter(TYPING_PHRASES, {
    typeSpeed: 50,
    deleteSpeed: 30,
    pauseDuration: 2000,
  });

  return (
    <footer id="tech-footer" className="bg-card border-t border-border">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-8 mb-20 px-4 sm:px-0">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img loading="lazy" src={rasuLogo} alt="RASU" className="h-12 dark:invert" />
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              Redefining fashion with futuristic designs. Premium streetwear for the modern visionary.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold uppercase tracking-wider text-sm mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Tech Stack Section */}
        <div className="mt-16 pt-8 border-t border-border">
          {/* Typing Effect */}
          <div className="text-center mb-8">
            <p className="text-lg font-medium text-foreground h-7">
              {typedText}
              <span className="inline-block w-[2px] h-5 bg-primary ml-0.5 animate-pulse align-text-bottom" />
            </p>
          </div>

          {/* Tech Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 pb-12 opacity-40 hover:opacity-100 transition-opacity duration-500 overflow-x-hidden">
            {TECH_STACK.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="group relative"
              >
                <motion.div
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/60 border border-border/50 
                    hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 cursor-default"
                >
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    className={`w-5 h-5 ${tech.invertInDark ? "dark:invert" : ""}`}
                    loading="lazy"
                    width={20}
                    height={20}
                  />
                  <span className="text-sm font-medium">{tech.name}</span>
                </motion.div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 
                  bg-foreground text-background text-xs rounded-md font-medium
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  v{tech.version}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 
                    border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* View Source Button */}
          <div className="text-center">
            <motion.a
              href={DEVELOPER.repo}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full 
                bg-muted/60 border border-border/50 hover:border-primary/30 
                text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              <Github className="w-4 h-4" />
              View Source
              <ExternalLink className="w-3.5 h-3.5" />
            </motion.a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} RASU. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <LanguageSelector variant="footer" />
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const Footer = memo(FooterInner);

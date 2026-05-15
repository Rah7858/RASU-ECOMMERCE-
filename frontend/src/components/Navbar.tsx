import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Search, ShoppingBag, User, Menu, X, Heart } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SearchCommand } from "./SearchCommand";
import { LanguageSelector } from "./LanguageSelector";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";


// Magnetic effect hook
function useMagnetic(strength = 0.3) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { x: springX, y: springY, handleMouseMove, handleMouseLeave };
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [0, 20]);
  const { wishlistCount } = useWishlist();
  const { totalItems } = useCart();
  const { t } = useLanguage();

  const navLinks = [
    { name: t("nav.shop"), href: "/shop" },
    { name: t("nav.men"), href: "/shop?category=men" },
    { name: t("nav.women"), href: "/shop?category=women" },
    { name: t("nav.trending"), href: "/shop?category=trending" },
    { name: t("nav.accessories"), href: "/shop?category=accessories" },
  ];

  const logoMagnetic = useMagnetic(0.2);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("rasu_token") && localStorage.getItem("rasu_user")));
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    window.addEventListener("rasu-auth-changed", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("rasu-auth-changed", syncAuthState);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-0 right-0 z-50"
        style={{ top: "var(--banner-height, 0px)" }}
      >
        {/* Background blur layer with dynamic blur */}
        <motion.div
          style={{ 
            opacity: navOpacity,
            backdropFilter: `blur(${navBlur}px)`,
            WebkitBackdropFilter: `blur(${navBlur}px)`,
          }}
          className="absolute inset-0 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-sm"
        />

        <div className="relative container mx-auto px-4 md:px-6 lg:px-8">
          <nav className="relative flex items-center justify-between h-16 sm:h-20 md:h-24 px-1 sm:px-4">
            {/* Left Navigation with staggered animation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:flex items-center gap-10"
            >
              {navLinks.map((link, index) => (
                <NavLink key={link.name} link={link} index={index} />
              ))}
            </motion.div>

            {/* Mobile Menu Button with rotation animation */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="tap-target lg:hidden p-3 rounded-xl hover:bg-muted/50 transition-colors relative"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Center Logo with Magnetic Effect */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 flex items-center"
            >
              <motion.div
                style={{ x: logoMagnetic.x, y: logoMagnetic.y }}
                onMouseMove={logoMagnetic.handleMouseMove}
                onMouseLeave={logoMagnetic.handleMouseLeave}
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.08 }}
                className="relative cursor-pointer"
              >
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-0 transition-opacity"
                  whileHover={{ opacity: 0.5 }}
                />

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-28 h-6 rounded-b-2xl hidden md:block origin-center bg-foreground/8 border border-foreground/15 backdrop-blur dark:bg-card/70 dark:border-border/40"
                />

                <div className="relative z-10 flex items-center gap-1.5 sm:gap-3 text-foreground font-bold tracking-[0.05em] sm:tracking-[0.2em] text-base sm:text-xl md:text-2xl overflow-hidden">
                  <span className="flex-shrink-0 inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary text-primary-foreground ring-1 ring-foreground/10 dark:bg-primary/20 dark:text-primary dark:ring-primary/30 text-sm sm:text-base">R</span>
                  <span className="truncate hidden xs:inline-block">RASU</span>
                </div>
              </motion.div>
            </Link>

            {/* Right Navigation */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3 md:gap-6"
            >

              {/* Action Icons with staggered animation */}
              <div className="flex items-center gap-1 md:gap-2">
                {/* Search Button */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="hidden sm:block"
                >
                  <motion.button
                    onClick={() => setIsSearchOpen(true)}
                    aria-label="Search"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2 sm:p-3 rounded-xl hover:bg-muted/50 transition-all duration-300"
                  >
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </motion.div>

                {[
                  { icon: Heart, label: "Wishlist", href: "/wishlist", badge: wishlistCount > 0 ? String(wishlistCount) : undefined, hideOnMobile: true },
                  { icon: ShoppingBag, label: "Cart", href: "/cart", badge: totalItems > 0 ? String(totalItems) : undefined },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={item.hideOnMobile ? "hidden sm:block" : ""}
                  >
                    <IconButton {...item} />
                  </motion.div>
                ))}

                <motion.div
                  key="account"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate("/profile");
                      } else {
                        navigate("/login");
                      }
                    }}
                    aria-label="Account"
                    className="relative p-2 sm:p-3 rounded-xl hover:bg-muted/50 transition-all duration-300"
                  >
                    <User className="w-5 h-5" />
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  className="w-px h-6 bg-border mx-1 hidden md:block"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.75, type: "spring" }}
                  className="hidden lg:block"
                >
                  <LanguageSelector variant="navbar" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                >
                  <ThemeToggle />
                </motion.div>
              </div>
            </motion.div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu - Full Screen Overlay with enhanced animation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              className="absolute inset-0 bg-background/95"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content with staggered links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative h-full flex flex-col items-center justify-center gap-8 p-8"
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.9 }}
                  transition={{ 
                    delay: index * 0.08,
                    type: "spring",
                    bounce: 0.4,
                  }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="tap-target text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground hover:text-primary transition-colors relative group"
                  >
                    <motion.span
                      whileHover={{ x: 10 }}
                      className="inline-block"
                    >
                      {link.name}
                    </motion.span>
                    <motion.span
                      className="absolute -bottom-2 left-0 h-0.5 bg-primary"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-1/4 right-1/4 w-64 h-64 border border-primary/30 rounded-full"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.05 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-1/4 left-1/4 w-48 h-48 border border-accent/30 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Command Dialog */}
      <SearchCommand open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}

function NavLink({ link, index }: { link: { name: string; href: string }; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.08 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link
        to={link.href}
        className="group relative text-sm font-medium tracking-widest uppercase text-foreground/70 hover:text-foreground transition-colors duration-300 py-2"
      >
        <motion.span
          animate={{ y: isHovered ? -2 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-block"
        >
          {link.name}
        </motion.span>
        
        {/* Animated underline */}
        <motion.span
          className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: isHovered ? "100%" : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        
        {/* Glow dot */}
        <motion.span
          className="absolute -bottom-1 left-0 w-1 h-1 bg-primary rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            scale: isHovered ? 1 : 0,
            x: isHovered ? [0, 5, 0] : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </Link>
    </motion.div>
  );
}

function IconButton({ 
  icon: Icon, 
  label, 
  href, 
  badge, 
  onClick, 
}: { 
  icon: typeof Search; 
  label: string; 
  href: string | null;
  badge?: string;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-3 rounded-xl hover:bg-muted/50 transition-all duration-300"
    >
      <motion.div
        animate={{ rotate: isHovered ? [0, -10, 10, 0] : 0 }}
        transition={{ duration: 0.4 }}
      >
        <Icon className="w-5 h-5" />
      </motion.div>
      
      {badge && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1 right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-glow-sm"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {badge}
          </motion.span>
        </motion.span>
      )}
    </motion.div>
  );

  if (href) {
    return (
      <Link to={href} aria-label={label}>
        <div className="tap-target">{content}</div>
      </Link>
    );
  }

  return (
    <button aria-label={label} onClick={onClick} className="tap-target">
      {content}
    </button>
  );
}

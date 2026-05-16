import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Eye, Star } from "lucide-react";
import { useState, useRef } from "react";
import rasuLogo from "@/assets/rasu-logo.png";
import { Product3DViewer } from "./Product3DViewer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/data/products";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { formatPrice } from "@/utils/format";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem, setIsOpen } = useCart();
  const { t, i18n } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const translatedName = product.name;
  
  // 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };
  
  const isLiked = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
    if (isLiked) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      size: "M",
      color: product.color || "#000000",
      quantity: 1,
    });
    setIsOpen(true);
  };


  return (
    <Link to={`/product/${product.id}`} className="group block h-full perspective-1000">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ 
          rotateX: isHovered ? rotateX : 0, 
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d"
        }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500"
      >
        {/* Glow effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                boxShadow: "inset 0 0 60px hsl(var(--primary) / 0.08)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Image/3D Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <AnimatePresence mode="wait">
            {show3D ? (
              <motion.div
                key="3d"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-b from-muted to-card"
              >
                <Product3DViewer 
                  subcategory={product.subcategory} 
                  color={product.color}
                />
              </motion.div>
            ) : (
              <motion.img
                key="image"
                src={product.image}
                alt={product.name}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 24vw"
                className="w-full h-full object-cover"
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </AnimatePresence>

          {/* Overlay gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"
            animate={{ opacity: isHovered ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
          />

          {/* Watermark */}
          <motion.div
            className="absolute bottom-4 right-4 opacity-20"
            animate={{ opacity: isHovered ? 0.4 : 0.2 }}
          >
            <img loading="lazy" src={rasuLogo} alt="" className="h-6 dark:invert" />
          </motion.div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full shadow-glow-sm"
              >
                NEW
              </motion.span>
            )}
            {product.originalPrice && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="px-2.5 py-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full"
              >
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </motion.span>
            )}
          </div>

          {/* Quick Actions */}
          <motion.div
            className="absolute top-3 right-3 flex flex-col gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistClick}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                isLiked 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-background/90 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
              }`}
              aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </motion.button>
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: isHovered ? 1 : 0 }}
              transition={{ delay: 0.1, type: "spring", bounce: 0.5 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                setShow3D(!show3D);
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                show3D 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-background/90 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
              }`}
              aria-label={show3D ? "Show product image" : "Show 3D preview"}
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Add to Cart */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="tap-target w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-xl flex items-center justify-center gap-2 text-xs xs:text-sm relative overflow-hidden"
              aria-label={`Add ${translatedName} to cart`}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              />
              <ShoppingBag className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{t("shop.add_to_cart")}</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <motion.p
              className="text-xs text-muted-foreground uppercase tracking-wider"
              animate={{ x: isHovered ? 3 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {product.subcategory}
            </motion.p>
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3 h-3 text-accent fill-accent" />
              <span className="font-medium">{product.rating}</span>
            </div>
          </div>
          
          <motion.h3
            className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1"
            animate={{ x: isHovered ? 3 : 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            {translatedName}
          </motion.h3>
          
          <motion.div
            className="flex items-center gap-2"
            animate={{ x: isHovered ? 3 : 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <span className="text-lg font-bold">{formatPrice(product.price, i18n.language)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice, i18n.language)}
              </span>
            )}
          </motion.div>
        </div>

        {/* Bottom line animation */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>
    </Link>
  );
}

import { memo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";

interface RecentlyViewedSectionProps {
  items: Product[];
  onClear?: () => void;
  title?: string;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function RecentlyViewedSectionInner({
  items,
  onClear,
  title = "Recently Viewed",
}: RecentlyViewedSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 280;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="py-12"
      aria-label={title}
    >
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>

          <div className="flex items-center gap-2">
            {onClear && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-muted-foreground hover:text-destructive text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Horizontal scroll */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory
            pb-4 -mb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="snap-start shrink-0 w-[200px] md:w-[240px]"
            >
              <Link
                to={`/product/${product.id}`}
                className="group block bg-card rounded-2xl overflow-hidden border border-border/50
                  hover:border-primary/30 transition-all duration-300"
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width={240}
                    height={300}
                  />
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                    {product.subcategory}
                  </p>
                  <h3 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export const RecentlyViewedSection = memo(RecentlyViewedSectionInner);

import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Product } from "@/data/products";
import { useTranslation } from "react-i18next";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const { t } = useTranslation();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      size: "M",
      color: product.color || "#000000",
      quantity: 1,
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleRemove = (productId: number, productName: string) => {
    removeFromWishlist(productId);
    toast.success(`${productName} removed from wishlist`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("common.continue_shopping")}</span>
            </Link>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{t("wishlist.title")}</h1>
                  <p className="text-muted-foreground">
                    {wishlist.length} {wishlist.length === 1 ? t("wishlist.item_singular") : t("wishlist.item_plural")}
                  </p>
                </div>
              </div>

              {wishlist.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearWishlist();
                    toast.success("Wishlist cleared");
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t("wishlist.clear_all")}
                </Button>
              )}
            </div>
          </motion.div>

          {/* Wishlist Items */}
          <AnimatePresence mode="popLayout">
            {wishlist.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">{t("wishlist.empty")}</h2>
                <p className="text-muted-foreground mb-8">
                  {t("wishlist.empty_sub")}
                </p>
                <Link to="/shop">
                  <Button size="lg" className="gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    {t("wishlist.browse")}
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300"
                  >
                    {/* Image */}
                    <Link to={`/product/${product.id}`} className="block">
                      <div className="aspect-[4/5] overflow-hidden bg-muted">
                        <motion.img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>

                    {/* Remove Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemove(product.id, product.name)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </motion.button>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.isNew && (
                        <span className="px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full">
                          NEW
                        </span>
                      )}
                      {product.originalPrice && (
                        <span className="px-2.5 py-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full">
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        {product.subcategory}
                      </p>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="w-full gap-2"
                        size="sm"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        {t("shop.add_to_cart")}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

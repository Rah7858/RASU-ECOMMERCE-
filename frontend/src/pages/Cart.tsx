import { motion } from "framer-motion";
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const { t } = useTranslation();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const shippingCost = totalPrice > 999 ? 0 : 99;
  const orderTotal = totalPrice + shippingCost;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("common.continue_shopping")}</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{t("cart.title")}</h1>
                <p className="text-muted-foreground">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">{t("cart.empty")}</h2>
              <p className="text-muted-foreground mb-8">
                {t("cart.empty_sub")}
              </p>
              <Link to="/shop">
                <Button size="lg" className="gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  {t("cart.start_shopping")}
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${item.size}-${item.color}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col sm:flex-row gap-4 bg-card rounded-2xl border border-border/50 p-4"
                  >
                    {/* Image */}
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <img loading="lazy"
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-32 md:w-32 md:h-40 object-cover rounded-xl"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-semibold hover:text-primary transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        Size: {item.size} • Color: {item.color}
                      </p>
                      <p className="text-lg font-bold mt-2">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4 w-full">
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.color, item.quantity - 1)
                            }
                            className="p-2 hover:bg-muted transition-colors tap-target"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 font-medium">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.color, item.quantity + 1)
                            }
                            className="p-2 hover:bg-muted transition-colors tap-target"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id, item.size, item.color)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors tap-target"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total - Desktop */}
                    <div className="hidden md:flex flex-col items-end justify-between">
                      <p className="text-lg font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:sticky lg:top-32 h-fit"
              >
                <div className="bg-card rounded-2xl border border-border/50 p-6">
                  <h2 className="text-xl font-semibold mb-6">{t("checkout.order_summary")}</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("cart.subtotal")} ({totalItems} items)</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("cart.shipping")}</span>
                      <span className={shippingCost === 0 ? "text-green-500" : ""}>
                        {shippingCost === 0 ? t("cart.free_shipping") : formatPrice(shippingCost)}
                      </span>
                    </div>
                    {shippingCost > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Add ₹{999 - totalPrice} more for free shipping
                      </p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-lg font-bold mb-6">
                    <span>{t("cart.total")}</span>
                    <span>{formatPrice(orderTotal)}</span>
                  </div>

                  <Link to="/checkout">
                    <Button className="w-full h-12 text-base font-semibold">
                      {t("cart.checkout")}
                    </Button>
                  </Link>

                  <Link to="/shop">
                    <Button variant="outline" className="w-full mt-3">
                      {t("common.continue_shopping")}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

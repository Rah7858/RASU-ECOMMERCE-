import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, ProtectedRoute } from "@/contexts/AuthContext";
import CartDrawer from "@/components/cart/CartDrawer";
import { LiveChatWidget } from "@/components/LiveChatWidget";
import { lazy as lazyLoad } from "react";
const StyleChatbot = lazyLoad(() =>
  import("@/components/ai/StyleChatbot").then((m) => ({ default: m.StyleChatbot }))
);


const Index = lazy(() => import("./pages/Index"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Auth = lazy(() => import("./pages/Auth"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailure = lazy(() => import("./pages/PaymentFailure"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));

import { AdminRoute } from "@/components/common/AdminRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center">
      <p className="text-sm text-muted-foreground">Loading page...</p>
    </div>
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="rasu-theme">
        <LanguageProvider>
        <WishlistProvider>
          <CartProvider>
            <AuthProvider>
              <TooltipProvider>
              <Toaster />
              <Sonner />

              <BrowserRouter>
                <CartDrawer />
                <LiveChatWidget />
                <Suspense fallback={null}>
                  <StyleChatbot />
                </Suspense>

                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    {/* MAIN PAGES */}
                    <Route path="/" element={<Index />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />

                    {/* USER */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                    {/* CART & ORDERS */}
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    <Route path="/track-order" element={<OrderTracking />} />
                    <Route path="/orders/track/:orderId" element={<OrderTracking />} />
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/payment/failure" element={<PaymentFailure />} />

                    {/* ADMIN */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                    <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                    <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

                    {/* FALLBACK */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>

              </TooltipProvider>
            </AuthProvider>
          </CartProvider>
        </WishlistProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;

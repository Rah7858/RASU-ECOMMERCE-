import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  MapPin, 
  Clock, 
  ArrowLeft,
  Phone,
  Mail,
  Box,
  PackageCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppSupportButton } from "@/components/WhatsAppSupportButton";

interface TrackingStatus {
  id: string;
  status: string;
  description: string;
  timestamp: Date;
  location?: string;
  completed: boolean;
  current: boolean;
}

interface OrderTrackingData {
  orderId: string;
  orderDate: Date;
  estimatedDelivery: Date;
  currentStatus: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  timeline: TrackingStatus[];
}

const statusIcons: Record<string, typeof Package> = {
  "Order Placed": Box,
  "Processing": Package,
  "Shipped": Truck,
  "Out for Delivery": Truck,
  "Delivered": PackageCheck,
};

const OrderTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState("");
  const [orderData, setOrderData] = useState<OrderTrackingData | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Get order from navigation state or show search
    if (location.state?.orderId) {
      loadOrderTracking(location.state.orderId);
    }
  }, [location.state]);

  const loadOrderTracking = (orderId: string) => {
    // Mock order tracking data - replace with actual API call
    const mockTimeline: TrackingStatus[] = [
      {
        id: "1",
        status: "Order Placed",
        description: "Your order has been placed successfully",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        location: "Online",
        completed: true,
        current: false,
      },
      {
        id: "2",
        status: "Processing",
        description: "Your order is being prepared",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        location: "RASU Warehouse, Mumbai",
        completed: true,
        current: false,
      },
      {
        id: "3",
        status: "Shipped",
        description: "Your order has been shipped",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        location: "In Transit",
        completed: true,
        current: false,
      },
      {
        id: "4",
        status: "Out for Delivery",
        description: "Your order is out for delivery",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        location: "Local Delivery Hub",
        completed: false,
        current: true,
      },
      {
        id: "5",
        status: "Delivered",
        description: "Your order will be delivered soon",
        timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000),
        completed: false,
        current: false,
      },
    ];

    const mockOrder: OrderTrackingData = {
      orderId: orderId,
      orderDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      currentStatus: "Out for Delivery",
      shippingAddress: {
        fullName: "John Doe",
        address: "123 Main Street, Apt 4B",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
      },
      timeline: mockTimeline,
    };

    setOrderData(mockOrder);
  };

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      loadOrderTracking(trackingId.toUpperCase());
      setIsSearching(false);
    }, 1000);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getProgressPercentage = () => {
    if (!orderData) return 0;
    const completedSteps = orderData.timeline.filter(t => t.completed).length;
    const currentStep = orderData.timeline.findIndex(t => t.current);
    const totalSteps = orderData.timeline.length;
    return ((completedSteps + (currentStep >= 0 ? 0.5 : 0)) / totalSteps) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Track Your Order
            </h1>
            <p className="text-muted-foreground">
              Enter your order ID to see the current status
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <form onSubmit={handleTrackOrder} className="flex gap-3 max-w-md mx-auto">
              <Input
                placeholder="Enter Order ID (e.g., ORD12345678)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isSearching}>
                {isSearching ? "Searching..." : "Track"}
              </Button>
            </form>
          </motion.div>

          {orderData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Order Summary Card */}
              <Card className="border-border/50 bg-card/80">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{orderData.orderId}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {formatDate(orderData.orderDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                      <Truck className="w-4 h-4" />
                      <span className="text-sm font-medium">{orderData.currentStatus}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgressPercentage()}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>Order Placed</span>
                      <span>Delivered</span>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                        <p className="font-medium">{formatDate(orderData.estimatedDelivery)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Delivering To</p>
                        <p className="font-medium">{orderData.shippingAddress.city}, {orderData.shippingAddress.state}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Card */}
              <Card className="border-border/50 bg-card/80">
                <CardHeader>
                  <CardTitle className="text-lg">Tracking Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {orderData.timeline.map((status, index) => {
                      const Icon = statusIcons[status.status] || Package;
                      const isLast = index === orderData.timeline.length - 1;
                      
                      return (
                        <motion.div
                          key={status.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex gap-4 pb-8 last:pb-0"
                        >
                          {/* Timeline Line & Icon */}
                          <div className="relative flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                                status.completed
                                  ? "bg-primary text-primary-foreground"
                                  : status.current
                                  ? "bg-primary/20 text-primary border-2 border-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {status.completed ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <Icon className="w-5 h-5" />
                              )}
                            </div>
                            {!isLast && (
                              <div
                                className={`w-0.5 flex-1 mt-2 ${
                                  status.completed ? "bg-primary" : "bg-muted"
                                }`}
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 pt-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <h4
                                className={`font-medium ${
                                  status.current ? "text-primary" : ""
                                }`}
                              >
                                {status.status}
                                {status.current && (
                                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10">
                                    Current
                                  </span>
                                )}
                              </h4>
                              <span className="text-xs text-muted-foreground">
                                {status.completed || status.current
                                  ? formatDateTime(status.timestamp)
                                  : "Pending"}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {status.description}
                            </p>
                            {status.location && (status.completed || status.current) && (
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {status.location}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Help Card */}
              <Card className="border-border/50 bg-card/80">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="max-w-2xl">
                      <h3 className="font-semibold text-lg mb-1">Need Help?</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Our RASU support team is here to assist you with orders, returns, payments, and account-related
                        queries. Feel free to reach out anytime. We are available 24/7 to make your shopping experience
                        smooth and hassle-free.
                      </p>
                      <p className="text-xs text-primary mt-2">Average response time: within 2-4 hours</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button asChild variant="outline" size="sm" className="gap-2">
                        <a href="tel:+919876543210" aria-label="Call RASU support">
                          <Phone className="w-4 h-4" />
                          Call Us
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="gap-2">
                        <a
                          href="mailto:support@rasu.store?subject=Order%20Support%20Request"
                          aria-label="Email RASU support"
                        >
                          <Mail className="w-4 h-4" />
                          Email Support
                        </a>
                      </Button>
                      <WhatsAppSupportButton number="919876543210" message="Hello RASU Support" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild variant="outline">
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
                <Button asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!orderData && !location.state?.orderId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-12"
            >
              <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">Enter your Order ID</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                You can find your order ID in the confirmation email we sent you after placing your order.
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;

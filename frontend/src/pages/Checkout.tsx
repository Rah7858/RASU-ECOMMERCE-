import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Truck, MapPin, Check, Smartphone, Banknote } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const paymentMethods = [
  { id: "cod", name: "Cash on Delivery", icon: Banknote, description: "Pay when you receive" },
  { id: "upi", name: "UPI", icon: Smartphone, description: "GPay, PhonePe, Paytm" },
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, description: "Visa, Mastercard, RuPay" },
];

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const shippingCost = totalPrice > 999 ? 0 : 99;
  const orderTotal = totalPrice + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = ["firstName", "lastName", "email", "phone", "address", "city", "state", "pincode"];
    for (const field of required) {
      if (!formData[field as keyof typeof formData].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`);
        return false;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem("rasu_token");
      if (!token) {
        toast.error("Please log in to place order.");
        navigate("/auth");
        return;
      }

      const orderPayload = {
        items: items.map((item) => ({
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          addressLine1: formData.address,
          addressLine2: "",
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        phone: formData.phone,
        paymentMethod: paymentMethods.find((p) => p.id === selectedPayment)?.name || "Cash on Delivery",
        totalAmount: orderTotal,
      };

      if (selectedPayment === "cod") {
        const createdOrder = await apiRequest<{ _id?: string }>("/api/orders", {
          method: "POST",
          token,
          body: JSON.stringify(orderPayload),
        });

        const orderDetails = {
          orderId: createdOrder?._id || `ORD${Date.now().toString().slice(-8)}`,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          shippingAddress: {
            fullName: `${formData.firstName} ${formData.lastName}`,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            phone: `+91 ${formData.phone}`,
          },
          paymentMethod: "Cash on Delivery",
          subtotal: totalPrice,
          shipping: shippingCost,
          total: orderTotal,
          orderDate: new Date(),
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        };

        clearCart();
        navigate("/order-confirmation", { state: { order: orderDetails } });
      } else {
        // Razorpay flow
        const res = await loadRazorpay();
        if (!res) {
          toast.error("Razorpay SDK failed to load. Are you online?");
          setIsProcessing(false);
          return;
        }

        const razorpayOrder = await apiRequest<{ orderId: string; razorpayOrderId: string; amount: number; currency: string; key: string }>("/api/payments/create-order", {
          method: "POST",
          token,
          body: JSON.stringify(orderPayload),
        });

        if (!razorpayOrder) {
          toast.error("Server error. Are you online?");
          setIsProcessing(false);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || razorpayOrder.key,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "RASU E-Commerce",
          description: "Test Transaction",
          order_id: razorpayOrder.razorpayOrderId,
          handler: async function (response: any) {
            try {
              const verifyRes = await apiRequest<{ verified: boolean; message: string }>("/api/payments/verify", {
                method: "POST",
                token,
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: razorpayOrder.orderId,
                }),
              });

              if (verifyRes?.verified) {
                const orderDetails = {
                  orderId: razorpayOrder.orderId,
                  items: items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                  })),
                  shippingAddress: {
                    fullName: `${formData.firstName} ${formData.lastName}`,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    phone: `+91 ${formData.phone}`,
                  },
                  paymentMethod: "Razorpay",
                  subtotal: totalPrice,
                  shipping: shippingCost,
                  total: orderTotal,
                  orderDate: new Date(),
                  estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                };

                clearCart();
                navigate("/order-confirmation", { state: { order: orderDetails } });
              } else {
                toast.error("Payment Verification Failed!");
              }
            } catch (err) {
              console.error(err);
              toast.error("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#ffffff",
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to place order");
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <Link to="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
              <span>Continue Shopping</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">Checkout</h1>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl border border-border/50 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      maxLength={10}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="House no, Street, Locality"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="400001"
                      maxLength={6}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl border border-border/50 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>

                <RadioGroup
                  value={selectedPayment}
                  onValueChange={setSelectedPayment}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedPayment === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border/50 hover:border-primary/30"
                      }`}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <method.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                      {selectedPayment === method.id && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </label>
                  ))}
                </RadioGroup>
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:sticky lg:top-32 h-fit"
            >
              <div className="bg-card rounded-2xl border border-border/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>

                {/* Cart Items */}
                <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
                      <img loading="lazy"
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold mt-1">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Price Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shippingCost === 0 ? "text-green-500" : ""}>
                      {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  {shippingCost > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Free shipping on orders above ₹999
                    </p>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total</span>
                  <span>{formatPrice(orderTotal)}</span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full h-12 text-base font-semibold"
                >
                  {isProcessing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                    />
                  ) : (
                    `Place Order • ${formatPrice(orderTotal)}`
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  By placing this order, you agree to our Terms & Conditions
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

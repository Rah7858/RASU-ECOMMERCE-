import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  Heart,
  LogOut,
  MapPin,
  Pencil,
  Phone,
  ShoppingBag,
  Trash2,
  Upload,
  User,
  XCircle,
} from "lucide-react";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

type VerificationChannel = "email" | "phone";

interface Address {
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface CartItem {
  product: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  emailVerified: boolean;
  verificationChannel: VerificationChannel;
  profileImage: string;
  address: Address;
  gender: "male" | "female" | "other" | "prefer_not_to_say";
  dateOfBirth: string | null;
  wishlist: string[];
  cart: CartItem[];
}

interface Order {
  _id: string;
  status: string;
  totalAmount: number;
  items: Array<{ quantity: number }>;
  createdAt: string;
}

interface SyncCartItem {
  product: string;
  quantity: number;
  size?: string;
  color?: string;
}

const defaultAddress: Address = {
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
  country: "",
};

const defaultUser: ProfileUser = {
  id: "",
  name: "",
  email: "",
  phone: "",
  role: "customer",
  emailVerified: false,
  verificationChannel: "email",
  profileImage: "",
  address: defaultAddress,
  gender: "prefer_not_to_say",
  dateOfBirth: null,
  wishlist: [],
  cart: [],
};

const onCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, action: () => void) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const { items: localCartItems } = useCart();

  const [profile, setProfile] = useState<ProfileUser>(defaultUser);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = useMemo(() => localStorage.getItem("rasu_token") || "", []);

  const authHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const uiWishlistIds = useMemo(() => wishlist.map((product) => String(product.id)), [wishlist]);

  const uiCartItems = useMemo<SyncCartItem[]>(
    () =>
      localCartItems.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })),
    [localCartItems]
  );

  const uiCartCount = useMemo(
    () => localCartItems.reduce((sum, item) => sum + item.quantity, 0),
    [localCartItems]
  );

  useEffect(() => {
    if (!token) {
      navigate("/auth", { replace: true });
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unable to fetch profile");
        }

        const data = await response.json();
        const userData: ProfileUser = {
          ...defaultUser,
          ...data.user,
          address: {
            ...defaultAddress,
            ...(data.user?.address || {}),
          },
          wishlist: Array.isArray(data.user?.wishlist) ? data.user.wishlist : [],
          cart: Array.isArray(data.user?.cart) ? data.user.cart : [],
        };

        setProfile(userData);
        setOrders(Array.isArray(data.orders) ? data.orders : []);

        localStorage.setItem("rasu_user", JSON.stringify(userData));
      } catch {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("rasu_user");
        localStorage.removeItem("rasu_token");
        window.dispatchEvent(new Event("rasu-auth-changed"));
        navigate("/auth", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate, token]);

  useEffect(() => {
    if (!token || isLoading) return;

    const syncedWishlist = JSON.stringify(profile.wishlist || []);
    const syncedCart = JSON.stringify(profile.cart || []);
    const localWishlist = JSON.stringify(uiWishlistIds);
    const localCart = JSON.stringify(uiCartItems);

    if (syncedWishlist === localWishlist && syncedCart === localCart) return;

    const syncProfileData = async () => {
      try {
        await fetch(`${API_BASE_URL}/api/users/profile`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            wishlist: uiWishlistIds,
            cart: uiCartItems,
          }),
        });

        setProfile((prev) => ({
          ...prev,
          wishlist: uiWishlistIds,
          cart: uiCartItems,
        }));
      } catch {
        // Keep UI responsive even if sync fails temporarily.
      }
    };

    syncProfileData();
  }, [authHeaders, isLoading, profile.cart, profile.wishlist, token, uiCartItems, uiWishlistIds]);

  const updateField = <K extends keyof ProfileUser>(key: K, value: ProfileUser[K]) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const updateAddress = (key: keyof Address, value: string) => {
    setProfile((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [key]: value,
      },
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const payload = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth,
        wishlist: profile.wishlist,
        cart: profile.cart,
      };

      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Unable to update profile");
      }

      const updatedUser: ProfileUser = {
        ...profile,
        ...data.user,
        address: {
          ...defaultAddress,
          ...(data.user?.address || {}),
        },
      };

      setProfile(updatedUser);
      localStorage.setItem("rasu_user", JSON.stringify(updatedUser));
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setIsUploadingImage(true);
      const response = await fetch(`${API_BASE_URL}/api/users/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Upload failed");

      const updatedUser = { ...profile, profileImage: data.user?.profileImage || "" };
      setProfile(updatedUser);
      localStorage.setItem("rasu_user", JSON.stringify(updatedUser));
      toast.success("Profile photo updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteProfileImage = async () => {
    try {
      setIsUploadingImage(true);
      const response = await fetch(`${API_BASE_URL}/api/users/upload`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Remove failed");

      const updatedUser = { ...profile, profileImage: "" };
      setProfile(updatedUser);
      localStorage.setItem("rasu_user", JSON.stringify(updatedUser));
      toast.success("Profile photo removed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Remove failed");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("rasu_user");
    localStorage.removeItem("rasu_token");
    window.dispatchEvent(new Event("rasu-auth-changed"));
    toast.success("Logged out successfully.");
    navigate("/", { replace: true });
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-16">
          <div className="container mx-auto max-w-5xl px-4">
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">Loading profile...</CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
              <p className="text-sm text-muted-foreground">Manage your RASU account and shopping data.</p>
            </div>

            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-5">
                {/* Avatar */}
                <div className="relative">
                  <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-muted">
                    {profile.profileImage ? (
                      <img loading="lazy"
                        src={profile.profileImage.startsWith('/uploads') ? `${API_BASE_URL}${profile.profileImage}` : profile.profileImage}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  {/* Edit overlay button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background shadow-md transition hover:bg-muted disabled:opacity-50"
                    title="Change photo"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleImageFilePick}
                />

                <div className="flex w-full gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploadingImage ? "Uploading..." : "Upload Photo"}
                  </Button>

                  {profile.profileImage && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={handleDeleteProfileImage}
                      disabled={isUploadingImage}
                      title="Remove photo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <p className="text-center text-xs text-muted-foreground">JPEG, PNG, WebP or GIF · Max 4 MB</p>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={profile.name} onChange={(e) => updateField("name", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={profile.email} onChange={(e) => updateField("email", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input value={profile.phone} onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, ""))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={profile.gender}
                      onChange={(e) => updateField("gender", e.target.value as ProfileUser["gender"])}
                    >
                      <option value="prefer_not_to_say">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : ""}
                      onChange={(e) => updateField("dateOfBirth", e.target.value || null)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Address Details</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Address Line</Label>
                      <Input value={profile.address.addressLine} onChange={(e) => updateAddress("addressLine", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input value={profile.address.city} onChange={(e) => updateAddress("city", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input value={profile.address.state} onChange={(e) => updateAddress("state", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Pincode</Label>
                      <Input value={profile.address.pincode} onChange={(e) => updateAddress("pincode", e.target.value.replace(/\D/g, ""))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input value={profile.address.country} onChange={(e) => updateAddress("country", e.target.value)} />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full md:w-auto">
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email verified</span>
                  {profile.emailVerified ? (
                    <span className="flex items-center gap-1 font-medium text-green-600">
                      <CheckCircle2 className="h-4 w-4" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-medium text-destructive">
                      <XCircle className="h-4 w-4" /> Not verified
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">OTP channel</span>
                  <span className="font-medium capitalize">
                    {profile.verificationChannel === "phone" ? (
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</span>
                    ) : (
                      "Email"
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Account role</span>
                  <Badge variant="outline" className="capitalize">{profile.role}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Password</span>
                  <span className="text-xs text-muted-foreground">Secured (bcrypt)</span>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => navigate("/wishlist")}
              onKeyDown={(event) => onCardKeyDown(event, () => navigate("/wishlist"))}
              role="button"
              tabIndex={0}
              aria-label="Open wishlist page"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Heart className="h-4 w-4" />
                  Wishlist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Saved Items: {wishlist.length}</p>
                <div className="max-h-24 overflow-auto rounded border border-border p-2 text-xs text-muted-foreground">
                  {wishlist.length ? wishlist.map((product) => product.name).join(", ") : "No wishlist items yet."}
                </div>
                <p className="text-xs text-primary">Open Wishlist</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => navigate("/cart")}
              onKeyDown={(event) => onCardKeyDown(event, () => navigate("/cart"))}
              role="button"
              tabIndex={0}
              aria-label="Open cart page"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShoppingBag className="h-4 w-4" />
                  Cart
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Cart Items: {uiCartCount}</p>
                <div className="max-h-24 overflow-auto rounded border border-border p-2 text-xs text-muted-foreground">
                  {localCartItems.length
                    ? localCartItems.map((item) => `${item.name} (x${item.quantity})`).join(", ")
                    : "No cart items yet."}
                </div>
                <p className="text-xs text-primary">Open Cart</p>
              </CardContent>
            </Card>
          </div>

          <Card
            className="mt-6 cursor-pointer transition hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => navigate("/track-order")}
            onKeyDown={(event) => onCardKeyDown(event, () => navigate("/track-order"))}
            role="button"
            tabIndex={0}
            aria-label="Open order tracking page"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-lg border border-border p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate("/track-order", { state: { orderId: order._id } });
                    }}
                    onKeyDown={(event) =>
                      onCardKeyDown(event, () => navigate("/track-order", { state: { orderId: order._id } }))
                    }
                    role="button"
                    tabIndex={0}
                    aria-label={`Track order ${order._id.slice(-8).toUpperCase()}`}
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Order ID: {order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{order.status}</Badge>
                        <Badge>₹{order.totalAmount}</Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {order.items?.length || 0} items
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <p className="text-xs text-primary">Open Order Tracking</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;

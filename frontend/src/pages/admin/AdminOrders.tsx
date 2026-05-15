import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { OrderRowSkeleton } from "@/components/common/skeletons";
import { apiRequest } from "@/lib/api";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface AdminOrder {
  _id: string;
  userId?: { name?: string; email?: string };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["all", "Pending", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-500",
  Confirmed: "bg-blue-500/10 text-blue-500",
  Packed: "bg-indigo-500/10 text-indigo-500",
  Shipped: "bg-purple-500/10 text-purple-500",
  "Out for Delivery": "bg-orange-500/10 text-orange-500",
  Delivered: "bg-green-500/10 text-green-500",
  Cancelled: "bg-red-500/10 text-red-500",
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(d));
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const token = useMemo(() => localStorage.getItem("rasu_token") || "", []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const data = await apiRequest<{ orders: AdminOrder[]; totalPages: number }>(
        `/api/admin/orders?${params}`,
        { token }
      );
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchQuery, token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await apiRequest(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        token,
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const exportCsv = () => {
    import("papaparse").then(({ default: Papa }) => {
      const csvData = orders.map((o) => ({
        "Order ID": o._id,
        Customer: o.userId?.name || "N/A",
        Email: o.userId?.email || "N/A",
        Amount: o.totalAmount,
        Status: o.status,
        Payment: o.paymentStatus,
        Date: formatDate(o.createdAt),
        Items: o.items.length,
      }));
      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rasu-orders-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <AdminLayout title="Orders">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or customer..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>{s === "all" ? "All Statuses" : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={exportCsv} className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_80px_100px_120px_100px_60px] gap-4 p-4 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:grid">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Items</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Date</span>
            <span></span>
          </div>

          {loading
            ? Array.from({ length: 5 }).map((_, i) => <OrderRowSkeleton key={i} />)
            : orders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_80px_100px_120px_100px_60px] gap-2 md:gap-4 p-4 border-b border-border/50 hover:bg-muted/30 transition-colors items-center"
                >
                  <span className="font-mono text-xs truncate">{order._id}</span>
                  <span className="text-sm truncate">{order.userId?.name || "Guest"}</span>
                  <span className="text-sm">{order.items.length}</span>
                  <span className="text-sm font-medium">{formatCurrency(order.totalAmount)}</span>
                  <div>
                    <Select
                      value={order.status}
                      onValueChange={(v) => updateStatus(order._id, v)}
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_COLORS[order.status] || ""}`}>
                          {order.status}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.filter((s) => s !== "all").map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}

          {!loading && orders.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              No orders found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Order Detail Slide-over */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedOrder(null)} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="relative w-full max-w-md bg-card border-l border-border p-6 overflow-auto"
          >
            <h3 className="text-lg font-bold mb-4">Order Details</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono text-xs">{selectedOrder._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer</span>
                <span>{selectedOrder.userId?.name || "Guest"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold">{formatCurrency(selectedOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <span>{selectedOrder.paymentStatus}</span>
              </div>
              <div className="border-t border-border pt-4">
                <h4 className="font-medium mb-2">Items ({selectedOrder.items.length})</h4>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2">
                    {item.image && (
                      <img loading="lazy" src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <span className="text-sm">{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full mt-6" onClick={() => setSelectedOrder(null)}>
              Close
            </Button>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}

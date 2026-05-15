import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AdminStatCardSkeleton } from "@/components/common/skeletons";
import { apiRequest } from "@/lib/api";

interface DashboardStats {
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  avgOrderValue: number;
}

interface RevenueDay {
  date: string;
  revenue: number;
  orders: number;
}

interface OrderStatus {
  status: string;
  count: number;
}

const PIE_COLORS = ["#6d28d9", "#a855f7", "#e879f9", "#f9a8d4", "#94a3b8", "#f97316", "#ef4444"];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueDay[]>([]);
  const [statusData, setStatusData] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const token = useMemo(() => localStorage.getItem("rasu_token") || "", []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, revenueRes, statusRes] = await Promise.all([
          apiRequest<DashboardStats>("/api/admin/dashboard/stats", { token }),
          apiRequest<RevenueDay[]>("/api/admin/dashboard/revenue-chart", { token }),
          apiRequest<OrderStatus[]>("/api/admin/dashboard/orders-by-status", { token }),
        ]);
        setStats(statsRes);
        setRevenueData(revenueRes);
        setStatusData(statusRes);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  const statCards = useMemo(() => {
    if (!stats) return [];
    return [
      { label: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: DollarSign, trend: "+12.5%", up: true },
      { label: "Total Orders", value: String(stats.totalOrders), icon: ShoppingCart, trend: "+8.2%", up: true },
      { label: "Total Users", value: String(stats.totalUsers), icon: Users, trend: "+5.1%", up: true },
      { label: "Avg. Order Value", value: formatCurrency(stats.avgOrderValue), icon: TrendingUp, trend: "+3.4%", up: true },
    ];
  }, [stats]);

  return (
    <AdminLayout title="Dashboard">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <AdminStatCardSkeleton key={i} />)
          : statCards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <card.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span
                        className={`text-xs font-medium flex items-center gap-1 ${
                          card.up ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {card.trend}
                      </span>
                    </div>
                    <p className="text-2xl font-bold">{card.value}</p>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Revenue (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6d28d9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6d28d9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(d: string) => d.slice(5)}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                    formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6d28d9" fill="url(#colorRevenue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders by Status Pie */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="status"
                  >
                    {statusData.map((_entry, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {statusData.map((item, index) => (
                <div key={item.status} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                    />
                    <span className="text-muted-foreground">{item.status}</span>
                  </div>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

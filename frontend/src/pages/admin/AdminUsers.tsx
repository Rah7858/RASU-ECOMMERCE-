import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, Ban, ShieldCheck, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { apiRequest } from "@/lib/api";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  emailVerified: boolean;
  isBanned?: boolean;
  createdAt: string;
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(d));
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const token = useMemo(() => localStorage.getItem("rasu_token") || "", []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const data = await apiRequest<{ users: AdminUser[]; totalPages: number }>(
        `/api/admin/users?${params}`,
        { token }
      );
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleBan = async (userId: string, currentBanned: boolean) => {
    try {
      await apiRequest(`/api/admin/users/${userId}/ban`, {
        method: "PUT",
        token,
        body: JSON.stringify({ banned: !currentBanned }),
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to toggle ban:", err);
    }
  };

  return (
    <AdminLayout title="Users">
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="grid grid-cols-[1fr_1fr_100px_100px_100px_80px] gap-4 p-4 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:grid">
            <span>Name</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Role</span>
            <span>Joined</span>
            <span>Actions</span>
          </div>

          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 border-b border-border/50 animate-pulse">
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              ))
            : users.map((user) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_100px_100px_100px_80px] gap-2 md:gap-4 p-4 border-b border-border/50 hover:bg-muted/30 transition-colors items-center"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium truncate">{user.name}</span>
                    {user.isBanned && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 font-medium">
                        Banned
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground truncate">{user.email}</span>
                  <span className="text-sm text-muted-foreground">{user.phone || "—"}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full inline-flex w-fit ${
                    user.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {user.role}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDate(user.createdAt)}</span>
                  <div>
                    {user.role !== "admin" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBan(user._id, !!user.isBanned)}
                        className={`h-7 text-xs ${user.isBanned ? "text-green-500" : "text-red-500"}`}
                      >
                        {user.isBanned ? <ShieldCheck className="w-3 h-3 mr-1" /> : <Ban className="w-3 h-3 mr-1" />}
                        {user.isBanned ? "Unban" : "Ban"}
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}

          {!loading && users.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">No users found</div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

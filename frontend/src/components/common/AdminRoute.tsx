import { memo, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: ReactNode;
}

function AdminRouteInner({ children }: AdminRouteProps) {
  let isAdmin = false;

  try {
    const token = localStorage.getItem("rasu_admin_token");
    if (token) {
      // Basic check, in reality we'd verify with backend
      isAdmin = true;
    }
  } catch {
    isAdmin = false;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

export const AdminRoute = memo(AdminRouteInner);

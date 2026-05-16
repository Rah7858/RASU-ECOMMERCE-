import { API_BASE_URL } from "@/lib/api";

export const startKeepAlive = () => {
  // Ping backend every 10 minutes to prevent Render from sleeping
  setInterval(async () => {
    try {
      await fetch(`${API_BASE_URL}/api/health`);
    } catch (e) {
      // silent fail
    }
  }, 10 * 60 * 1000); // 10 minutes
};

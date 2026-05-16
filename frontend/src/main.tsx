import "./i18n/config";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startKeepAlive } from "./utils/keepAlive";

startKeepAlive();

createRoot(document.getElementById("root")!).render(<App />);

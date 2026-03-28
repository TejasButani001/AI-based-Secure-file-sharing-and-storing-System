import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "355036699991-aug4lgsrp95nqc7ph54d8mif0ffaahar.apps.googleusercontent.com";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found in HTML");
}

createRoot(root).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);

import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "@/components";
import App from "./App";
import "@/styles.css";
import "@/assets/shimmer.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";
import queryClient from "./queries/queryClient";

createRoot(document.getElementById("root")!).render(
  <Router
    future={{
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    }}
  >
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Router>,
);

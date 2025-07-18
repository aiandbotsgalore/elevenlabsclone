import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./components/theme-provider";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="elevenlabs-ui-theme">
      <App />
    </ThemeProvider>
  </StrictMode>
);

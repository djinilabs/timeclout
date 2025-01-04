import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import en from "javascript-time-ago/locale/en";
import TimeAgo from "javascript-time-ago";
import "./output.css";
import { App } from "./App";

TimeAgo.addDefaultLocale(en);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

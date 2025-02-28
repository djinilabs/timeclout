import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import en from "javascript-time-ago/locale/en";
import pt from "javascript-time-ago/locale/pt";
import TimeAgo from "javascript-time-ago";
import "./output.css";
import { App } from "./App";

TimeAgo.addLocale(en);
TimeAgo.addDefaultLocale(pt);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

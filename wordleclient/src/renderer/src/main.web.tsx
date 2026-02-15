import "./assets/main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initializeDictionaryService } from "./services/DictionaryService";

async function boot() {
  const response = await fetch("/dictionary.txt");
  const text = await response.text();
  const words = text.split("\n").map((w) => w.trim().toLowerCase()).filter(Boolean);
  initializeDictionaryService(words);

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

boot();

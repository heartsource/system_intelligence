import React from "react";
import { createRoot } from "react-dom/client";
import App from "./Components/App";
import { AppProvider } from "./context/AppContext";

const root = createRoot(document.querySelector("#root"));
root.render(
  <>
    <AppProvider>
      <App />
    </AppProvider>
  </>
);

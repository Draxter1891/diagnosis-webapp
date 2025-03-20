import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";
import { PrivyProvider } from "@privy-io/react-auth";
import { StateContextProvider } from "./context";



const root = ReactDOM.createRoot(document.getElementById("root"));

//Developer's permission needed to get private keys
const privy_key = import.meta.env.VITE_PRIVY_KEY;

root.render(
  <PrivyProvider
    appId={privy_key}
    config={{
      appearance: {
        theme: "dark",
      },
    }}
  >
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </PrivyProvider>,
);

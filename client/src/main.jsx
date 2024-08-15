import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { persistor, store } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import axios from "axios";

if (import.meta.VITE_ENV == "production") {
  disableReactDevTools();
}

export const api = axios.create({
  // baseURL: "https://learniverse-class-sys-api.onrender.com",
  baseURL: "http://localhost:5091",
  // withCredentials: "include",
});

const queryClient = new QueryClient();

import "./container/style/general.css";
import "./container/style/nav.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <App />
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);

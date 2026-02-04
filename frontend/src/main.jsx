import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";
import { DashboardProvider } from "./hooks/useDashboard.jsx";
import "./index.css";

//================================================================================
// Ponto de entrada da aplicação React
//================================================================================

// Render the main App component into the root div in index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <DashboardProvider>
        <App />
      </DashboardProvider>
    </AuthProvider>
  </React.StrictMode>,
);

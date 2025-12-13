import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./authContext.jsx";
import ProjectRoutes from "./Routes.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Router>
      <div className="app-root">
        <Navbar />
        <main className="app-content">
          <ProjectRoutes />
        </main>
      </div>
    </Router>
  </AuthProvider>
);

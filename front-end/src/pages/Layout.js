import React from "react";
import { Link, useLocation } from "react-router-dom";

function Layout({ isCollapsed, setIsCollapsed, children }) {
  const location = useLocation();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <div
        style={{
          width: isCollapsed ? "0px" : "260px",
          background: "#0f172a",
          color: "white",
          transition: "0.3s ease",
          overflow: "hidden",
          flexShrink: 0
        }}
      >
        <div style={{ padding: "30px", width: "260px" }}>

          <h2
            style={{
              color: "#6366f1",
              marginBottom: "40px"
            }}
          >
            TASKFLOW
          </h2>

          <Link
            to="/dashboard"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                ...navItem,
                background:
                  location.pathname === "/dashboard"
                    ? "#1e293b"
                    : "transparent"
              }}
            >
              📊 Dashboard
            </div>
          </Link>

          <Link
            to="/team"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                ...navItem,
                background:
                  location.pathname === "/team"
                    ? "#1e293b"
                    : "transparent"
              }}
            >
              👥 Team View
            </div>
          </Link>

          <Link
            to="/projects"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                ...navItem,
                background:
                  location.pathname === "/projects"
                    ? "#1e293b"
                    : "transparent"
              }}
            >
              📁 Project View
            </div>
          </Link>

        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

const navItem = {
  padding: "14px",
  borderRadius: "10px",
  marginBottom: "14px",
  color: "#cbd5e1",
  cursor: "pointer",
  transition: "0.2s"
};

export default Layout;
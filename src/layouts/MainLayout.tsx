import { type ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "#1f2937",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>DAMACO DMS</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link to="/dashboard" style={{ color: "white" }}>Dashboard</Link>
          <Link to="/folders" style={{ color: "white" }}>Folder</Link>
          <Link to="/files" style={{ color: "white" }}>Files</Link>
          <Link to="/tags" style={{ color: "white" }}>Tags</Link>
          <Link to="/users" style={{ color: "white" }}>Users</Link>
          <Link to="/metadata-fields" style={{ color: "white" }}>Metadata Fields</Link>
          <Link to="/settings" style={{ color: "white" }}>Settings</Link>
          <Link to="/profile" style={{ color: "white" }}>Profile</Link>
          <Link to="/security-profile" style={{ color: "white" }}>Security Profile</Link>
        </nav>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            height: "60px",
            background: "#ffffff",
            borderBottom: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          <h3>Document Management System</h3>
        </div>

        <div style={{ flex: 1, padding: "20px", background: "#f3f4f6" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
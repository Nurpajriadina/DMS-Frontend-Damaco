import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/damaco-logo.png";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menus = [
    { name: "Folder", path: "/folder" },
    { name: "File", path: "/file" },
    { name: "Tags", path: "/tags" },
    { name: "My Shares", path: "/myshares" },
    { name: "Users", path: "/users" },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "70px",
        backgroundColor: "#000",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        padding: "0 30px",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* LEFT */}
      <div
        style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      >
        <img src={logo} alt="DAMACO" style={{ height: "40px" }} />
        <h2 style={{ margin: 0 }}>DAMACO</h2>
      </div>

      {/* CENTER MENU */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          fontSize: "15px",
        }}
      >
        {menus.map((menu) => (
          <span
            key={menu.name}
            onClick={() => navigate(menu.path)}
            style={{
              cursor: "pointer",
              paddingBottom: "4px",
              borderBottom:
                location.pathname === menu.path ? "2px solid white" : "none",
              opacity: location.pathname === menu.path ? 1 : 0.8,
            }}
          >
            {menu.name}
          </span>
        ))}
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ cursor: "pointer", fontSize: "18px" }}>⚙️</div>

        <div style={{ position: "relative" }}>
          <div
            onClick={() => setOpen(!open)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <span>Super Admin</span>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "#9ca3af",
              }}
            />
          </div>

          {open && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "45px",
                background: "white",
                color: "black",
                borderRadius: "6px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                minWidth: "150px",
              }}
            >
              <div
                style={{ padding: "10px", cursor: "pointer" }}
                onClick={() => navigate("/profile")}
              >
                Profile
              </div>
              <div style={{ padding: "10px", cursor: "pointer" }} onClick={logout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
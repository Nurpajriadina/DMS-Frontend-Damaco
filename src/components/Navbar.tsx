import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaCog } from "react-icons/fa";
import logo from "../assets/damaco-logo.png";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  // ✅ Close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        backgroundColor: "#000",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          height: "70px",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          padding: "0 20px",
          color: "white",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="DAMACO" style={{ height: "40px" }} />
          <h2 style={{ margin: 0 }}>DAMACO</h2>
        </div>

        {/* CENTER MENU */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "35px",
            whiteSpace: "nowrap",
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
                  location.pathname === menu.path
                    ? "2px solid white"
                    : "none",
                opacity: location.pathname === menu.path ? 1 : 0.8,
              }}
            >
              {menu.name}
            </span>
          ))}
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Home */}
          <FaHome
            style={{ cursor: "pointer", fontSize: "18px" }}
            onClick={() => navigate("/")}
          />

          {/* Setting */}
          <FaCog style={{ cursor: "pointer", fontSize: "18px" }} />

          {/* PROFILE */}
          <div
            ref={dropdownRef}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <div
              onClick={() => setOpen(!open)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
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
                  top: "50px",
                  background: "white",
                  color: "black",
                  borderRadius: "8px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
                  width: "200px",
                  zIndex: 9999,
                  padding: "15px",
                }}
              >
                {/* Profile Info */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "#9ca3af",
                      marginBottom: "8px",
                    }}
                  />
                  <strong>Super Admin</strong>
                </div>

                {/* Edit Profile */}
                <button
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                >
                  Edit Profile
                </button>

                {/* Logout */}
                <button
                  onClick={logout}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#ef4444",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
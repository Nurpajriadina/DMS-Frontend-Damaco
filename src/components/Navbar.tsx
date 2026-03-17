import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaCog } from "react-icons/fa";
import axios from "axios";
import logo from "../assets/damaco-logo.png";

const API_URL = "http://127.0.0.1:8000/api/v1";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [userName, setUserName] = useState("Menunggu Nama...");
  const [userRole, setUserRole] = useState("🔍 Sedang melacak...");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userData = res.data?.data || res.data;
        setUserName(userData?.name || "User Tanpa Nama");

        let foundRole = "Role Kosong";
        if (userData?.roles && Array.isArray(userData.roles) && userData.roles.length > 0) {
          const r = userData.roles[0];
          foundRole = typeof r === "string" ? r : (r.name || "Role");
        }
        setUserRole(foundRole);
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      }
    };
    fetchProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menus = [
    { name: "Folder", path: "/folder" },
    { name: "File", path: "/file" },
    { name: "Tags", path: "/tags" },
    { name: "My Shares", path: "/myshares" },
    { name: "Users", path: "/users" },
  ];

  return (
    <nav style={{ width: "100%", backgroundColor: "#000", position: "sticky", top: 0, zIndex: 1000 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", height: "70px", display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", padding: "0 20px", color: "white" }}>
        
        {/* LOGO */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => navigate("/")}>
          <img src={logo} alt="DAMACO" style={{ height: "40px" }} />
          <h2 style={{ margin: 0 }}>DAMACO</h2>
        </div>

        {/* MENU TENGAH */}
        <div style={{ display: "flex", justifyContent: "center", gap: "35px" }}>
          {menus.map((menu) => (
            <span
              key={menu.name}
              onClick={() => navigate(menu.path)}
              style={{
                cursor: "pointer",
                borderBottom: location.pathname === menu.path ? "2px solid white" : "none",
                opacity: location.pathname === menu.path ? 1 : 0.8,
              }}
            >
              {menu.name}
            </span>
          ))}
        </div>

        {/* ICON KANAN */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <FaHome
            style={{ cursor: "pointer", fontSize: "18px", color: location.pathname === "/dashboard" ? "#3b82f6" : "white" }}
            onClick={() => navigate("/dashboard")}
          />
          
          {/* TOMBOL SETTINGS (ICON GEAR) */}
          <FaCog
            style={{ 
                cursor: "pointer", 
                fontSize: "18px", 
                color: location.pathname === "/settings" ? "#3b82f6" : "white" 
            }}
            onClick={() => navigate("/settings")} // PINDAH KE SINI
          />

          {/* DROPDOWN USER */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <div
              onClick={() => setOpen(!open)}
              style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
            >
              <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>{userRole}</span>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#9ca3af" }} />
            </div>

            {open && (
              <div style={{ position: "absolute", right: 0, top: "50px", background: "white", color: "black", borderRadius: "8px", boxShadow: "0 6px 18px rgba(0,0,0,0.2)", width: "250px", zIndex: 9999, padding: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "15px" }}>
                  <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#9ca3af", marginBottom: "8px" }} />
                  <strong>{userName}</strong>
                  <span style={{ fontSize: "12px", color: "gray" }}>{userRole}</span>
                </div>
                <button
                  onClick={() => { navigate("/profile"); setOpen(false); }}
                  style={{ width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "6px", border: "1px solid #ddd", cursor: "pointer", background: "white" }}
                >
                  Edit Profile
                </button>
                <button
                  onClick={logout}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "none", background: "#ef4444", color: "white", cursor: "pointer" }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
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

  // Default teks kuubah agar kita tahu ini file yang baru!
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

        // Proses Ekstrak Role
        let foundRole = "Role Kosong";
        
        if (userData?.roles && Array.isArray(userData.roles) && userData.roles.length > 0) {
            const r = userData.roles[0];
            
            if (typeof r === "string") {
                foundRole = r; 
            } else if (typeof r === "object" && r !== null) {
                foundRole = r.name ? r.name : "Format Object Aneh"; 
            }
        } 

        setUserRole(foundRole);

      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
        setUserName("Guest");
        setUserRole("API Error");
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
    <nav
      style={{
        width: "100%",
        backgroundColor: "#000",
        position: "sticky",
        top: 0,
        left: 0,      // Memastikan menempel ke kiri
        right: 0,     // Memastikan menempel ke kanan
        zIndex: 1000,
        margin: 0,    // Menghilangkan margin yang mungkin diwarisi
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

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <FaHome
            style={{ cursor: "pointer", fontSize: "18px" }}
            onClick={() => navigate("/")}
          />
          <FaCog style={{ cursor: "pointer", fontSize: "18px" }} />
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
              <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>
                {userRole}
              </span>
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
                  width: "250px",
                  zIndex: 9999,
                  padding: "15px",
                }}
              >
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
                  <strong style={{ fontSize: "16px" }}>{userName}</strong>
                  <span style={{ fontSize: "12px", color: "gray", textTransform: "capitalize", textAlign: "center", wordBreak: "break-all" }}>
                    {userRole}
                  </span>
                </div>
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
                    background: "white"
                  }}
                >
                  Edit Profile
                </button>
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
    </nav>
  );
};

export default Navbar;
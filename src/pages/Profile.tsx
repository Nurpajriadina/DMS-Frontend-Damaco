import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaLock, FaShieldAlt, FaSave, FaKey } from "react-icons/fa";

const API_URL = "http://127.0.0.1:8000/api/v1";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [loading, setLoading] = useState(false);

  // State untuk Profile Information
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    email: "",
    address: "",
    additional_info: "",
  });

  // State untuk Change Password
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
  });

  // Ambil data profil saat komponen dimuat
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = res.data;
        const userData = result.data || result.user || result; 

        console.log("Struktur User Terdeteksi:", userData);

        setProfileData({
          name: userData.name || "",
          // Jika di DB namanya 'username', tapi di API mungkin 'user_name' atau lainnya
          username: userData.username || userData.user_name || "", 
          email: userData.email || "",
          address: userData.address || "",
          additional_info: userData.additional_info || "",
        });
      } catch (err) {
        console.error("Gagal mengambil data profil", err);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Tambahkan logika axios.put ke API update profil di sini
    setTimeout(() => setLoading(false), 1000); // Simulasi
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Tambahkan logika axios.post ke API ganti password di sini
    setTimeout(() => setLoading(false), 1000); // Simulasi
  };

  return (
    <div style={{ padding: "40px 20px", backgroundColor: "#f8f9fa", minHeight: "calc(100vh - 70px)" }}>
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          overflow: "hidden",
          border: "1px solid #ddd"
        }}
      >
        {/* TAB HEADER */}
        <div style={{ display: "flex", borderBottom: "1px solid #ddd", backgroundColor: "#fcfcfc" }}>
          <div
            onClick={() => setActiveTab("profile")}
            style={{
              padding: "15px 25px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: "600",
              color: activeTab === "profile" ? "#000" : "#888",
              borderBottom: activeTab === "profile" ? "3px solid #000" : "none",
              backgroundColor: activeTab === "profile" ? "#fff" : "transparent",
              transition: "0.3s"
            }}
          >
            <FaUser /> Profil Information
          </div>
          <div
            onClick={() => setActiveTab("security")}
            style={{
              padding: "15px 25px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: "600",
              color: activeTab === "security" ? "#000" : "#888",
              borderBottom: activeTab === "security" ? "3px solid #000" : "none",
              backgroundColor: activeTab === "security" ? "#fff" : "transparent",
              transition: "0.3s"
            }}
          >
            <FaLock /> Security & Password
          </div>
        </div>

        {/* TAB CONTENT */}
        <div style={{ padding: "30px" }}>
          
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ fontSize: "24px", color: "#666", backgroundColor: "#eee", padding: "10px", borderRadius: "50%", display: "flex" }}><FaUser /></div>
                <h3 style={{ margin: 0 }}>Personal Information</h3>
              </div>
              <hr style={{ border: "0.5px solid #eee", marginBottom: "25px" }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>Full Name *</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>Username *</label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>Email Address *</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>Address</label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "30px" }}>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>Additional Information</label>
                <textarea
                  rows={4}
                  value={profileData.additional_info}
                  onChange={(e) => setProfileData({...profileData, additional_info: e.target.value})}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              <div style={{ textAlign: "right" }}>
                <button type="submit" disabled={loading} style={btnSaveStyle}>
                  <FaSave /> {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={handlePasswordSubmit}>
              {/* Security Tips Box */}
              <div style={{ 
                backgroundColor: "#eef8ff", 
                borderLeft: "5px solid #3498db", 
                padding: "15px", 
                borderRadius: "4px", 
                marginBottom: "30px",
                display: "flex",
                gap: "15px",
                alignItems: "flex-start"
              }}>
                <FaShieldAlt style={{ color: "#3498db", fontSize: "20px", marginTop: "3px" }} />
                <div>
                  <h4 style={{ margin: "0 0 5px 0", color: "#2c3e50" }}>Security Tips</h4>
                  <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                    Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <FaLock style={{ color: "#e74c3c", fontSize: "20px" }} />
                <h3 style={{ margin: 0 }}>Change Your Password</h3>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>Current Password *</label>
                <div style={{ position: "relative" }}>
                  <FaKey style={{ position: "absolute", left: "12px", top: "12px", color: "#999" }} />
                  <input
                    type="password"
                    placeholder="Enter your current password"
                    style={{ ...inputStyle, paddingLeft: "40px" }}
                    required
                    onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "30px" }}>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>New Password *</label>
                <div style={{ position: "relative" }}>
                  <FaLock style={{ position: "absolute", left: "12px", top: "12px", color: "#999" }} />
                  <input
                    type="password"
                    placeholder="Enter your new password"
                    style={{ ...inputStyle, paddingLeft: "40px" }}
                    required
                    onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <button type="submit" disabled={loading} style={btnPasswordStyle}>
                  <FaShieldAlt /> {loading ? "Processing..." : "Change Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// Objek Style untuk efisiensi
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box"
};

const btnSaveStyle: React.CSSProperties = {
  backgroundColor: "#e8f5e9",
  color: "#2e7d32",
  border: "1px solid #c8e6c9",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
};

const btnPasswordStyle: React.CSSProperties = {
  backgroundColor: "#fdecea",
  color: "#d32f2f",
  border: "1px solid #ffcdd2",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
};

export default Profile;
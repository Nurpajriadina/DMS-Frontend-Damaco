import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaUserShield, FaKey, FaTags } from "react-icons/fa";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/v1/users?search=${search}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUsers(res.data.data.data || res.data.data);
    } catch (err) {
      console.error("Gagal mengambil data user", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]); // Re-fetch saat mengetik di kolom search

  return (
    <div style={{ padding: "30px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <FaUserShield /> Manajemen Hak Akses User
        </h2>

        {/* SEARCH BAR */}
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <FaSearch style={{ position: "absolute", left: "15px", top: "15px", color: "#999" }} />
          <input
            type="text"
            placeholder="Cari nama atau username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "12px 12px 12px 45px", borderRadius: "8px",
              border: "1px solid #ddd", fontSize: "16px", outline: "none"
            }}
          />
        </div>

        <div style={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#1a1a1a", color: "#fff", textAlign: "left" }}>
                <th style={thStyle}>Informasi User</th>
                <th style={thStyle}>Role (Jabatan)</th>
                <th style={thStyle}>Izin Khusus (Checklist)</th>
                <th style={thStyle}>Akses Tag</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ textAlign: "center", padding: "40px" }}>Memuat data...</td></tr>
              ) : users.map((user: any) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                  {/* KOLOM 1: INFO */}
                  <td style={tdStyle}>
                    <div style={{ fontWeight: "bold" }}>{user.name}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>@{user.username}</div>
                    <span style={statusBadge(user.status)}>{user.status}</span>
                  </td>

                  {/* KOLOM 2: ROLE */}
                  <td style={tdStyle}>
                    {user.roles?.map((role: any) => (
                      <div key={role.id} style={{ display: "flex", alignItems: "center", gap: "5px", color: "#2563eb", fontWeight: "600" }}>
                        <FaKey size={12} /> {role.name.toUpperCase()}
                      </div>
                    ))}
                  </td>

                  {/* KOLOM 3: PERMISSIONS (Hasil Checklist) */}
                  <td style={tdStyle}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {user.permissions?.length > 0 ? (
                        user.permissions.map((p: any) => (
                          <span key={p.id} style={permBadge}>
                            {p.name}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontStyle: "italic", color: "#ccc", fontSize: "12px" }}>Hanya izin standar role</span>
                      )}
                    </div>
                  </td>

                  {/* KOLOM 4: TAGS */}
                  <td style={tdStyle}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {user.tags?.map((tag: any) => (
                        <span key={tag.id} style={tagBadge}>
                          <FaTags size={10} /> {tag.name}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- STYLING ---
const thStyle: React.CSSProperties = { padding: "15px", fontSize: "14px", fontWeight: "600" };
const tdStyle: React.CSSProperties = { padding: "15px", verticalAlign: "top" };

const statusBadge = (status: string) => ({
  fontSize: "10px",
  padding: "2px 6px",
  borderRadius: "10px",
  backgroundColor: status === "active" ? "#dcfce7" : "#fee2e2",
  color: status === "active" ? "#166534" : "#991b1b",
  textTransform: "uppercase" as "uppercase",
  fontWeight: "bold" as "bold",
});

const permBadge: React.CSSProperties = {
  backgroundColor: "#f3f4f6", color: "#4b5563", padding: "4px 8px", borderRadius: "4px",
  fontSize: "11px", border: "1px solid #e5e7eb"
};

const tagBadge: React.CSSProperties = {
  backgroundColor: "#eff6ff", color: "#1d4ed8", padding: "4px 8px", borderRadius: "4px",
  fontSize: "11px", border: "1px solid #dbeafe", display: "flex", alignItems: "center", gap: "4px"
};

export default UserList;
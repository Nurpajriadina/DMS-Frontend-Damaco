import { useState, useEffect } from "react";
import { FaPlus, FaEye, FaEdit, FaTrash, FaShieldAlt, FaTags } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface UserType {
  id: number;
  name: string;
  email: string;
  username: string;
  address: string | null;
  status: "active" | "inactive";
  roles?: { name: string }[];
  permissions?: { name: string }[]; // Tambahan untuk izin global
  tags?: { name: string }[];        // Tambahan untuk izin tag
}

const API_URL = "http://127.0.0.1:8000/api/v1";

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");
  const [viewUser, setViewUser] = useState<UserType | null>(null);
  const [editUser, setEditUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // PASTIKAN BACKEND SUDAH PAKAI: User::with(['roles', 'permissions', 'tags'])
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let extractedData = [];
      if (Array.isArray(res.data?.data?.data)) extractedData = res.data.data.data;
      else if (Array.isArray(res.data?.data)) extractedData = res.data.data;
      else if (Array.isArray(res.data)) extractedData = res.data;

      setUsers(extractedData);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const safeUsers = Array.isArray(users) ? users : [];
  const filteredUsers = safeUsers.filter((user) => {
    const safeName = user?.name || "";
    const safeEmail = user?.email || "";
    return safeName.toLowerCase().includes(search.toLowerCase()) || 
           safeEmail.toLowerCase().includes(search.toLowerCase());
  });

  // Helper untuk styling badge
  const badgeStyle = (bgColor: string) => ({
    background: bgColor,
    color: "white",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: "bold" as const,
    marginRight: "4px",
    display: "inline-block",
    marginBottom: "2px"
  });

  return (
    <>
      <div style={{ padding: "30px", maxWidth: "1250px", margin: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ marginBottom: "5px" }}>List User & Privileges</h2>
            <p style={{ marginTop: 0, color: "gray" }}>Kelola pengguna dan pantau hak akses mereka secara rinci.</p>
          </div>
          <button onClick={() => navigate("/users/create")} style={{ background: "black", color: "white", border: "none", padding: "8px 15px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <FaPlus /> Add New
          </button>
        </div>

        <div style={{ marginTop: "25px", marginBottom: "15px" }}>
          Search: <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: "6px", width: "250px" }} placeholder="Search name or email..." />
        </div>

        <table width="100%" border={1} cellPadding={10} style={{ borderCollapse: "collapse", fontSize: "13px" }}>
          <thead style={{ background: "#f0f0f0" }}>
            <tr>
              <th>ID</th>
              <th>Informasi User</th>
              <th>Role</th>
              <th>Global Permissions (Checklist)</th>
              <th>Tag Access</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} align="center">Loading data...</td></tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td align="center">{user.id}</td>
                  <td>
                    <b>{user.name}</b><br/>
                    <small style={{color: 'gray'}}>{user.email}</small>
                  </td>
                  <td align="center">
                    <span style={{ background: "#3b82f6", color: "white", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold", textTransform: "uppercase", fontSize: "10px" }}>
                      {user.roles?.[0]?.name || "Guest"}
                    </span>
                  </td>
                  {/* KOLOM IZIN GLOBAL */}
                  <td>
                    {user.permissions && user.permissions.length > 0 ? (
                      user.permissions.map((p, i) => (
                        <span key={i} style={badgeStyle("#10b981")}>{p.name}</span>
                      ))
                    ) : (
                      <small style={{color: "#ccc"}}>Standard Role Access</small>
                    )}
                  </td>
                  {/* KOLOM TAGS */}
                  <td>
                    {user.tags && user.tags.length > 0 ? (
                      user.tags.map((t, i) => (
                        <span key={i} style={badgeStyle("#6366f1")}>{t.name}</span>
                      ))
                    ) : (
                      <small style={{color: "#ccc"}}>No Tags Assigned</small>
                    )}
                  </td>
                  <td align="center">
                    <span style={{ background: user.status === "active" ? "#28a745" : "#dc3545", color: "white", padding: "4px 8px", borderRadius: "3px", fontSize: "10px", fontWeight: "bold" }}>
                      {user.status}
                    </span>
                  </td>
                  <td align="center">
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                      <FaEye style={{ cursor: "pointer", color: "#007bff" }} onClick={() => setViewUser(user)} />
                      <FaEdit style={{ cursor: "pointer", color: "#ffc107" }} onClick={() => setEditUser(user)} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} align="center">No Data Available</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL VIEW DETAIL RINCI */}
      {viewUser && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 }}>
          <div style={{ background: "white", padding: "25px", width: "450px", borderRadius: "8px" }}>
            <h3><FaShieldAlt /> Full Privileges: {viewUser.name}</h3>
            <hr/>
            <p><b>Username:</b> {viewUser.username}</p>
            <p><b>Role:</b> {viewUser.roles?.[0]?.name || "-"}</p>
            
            <div style={{ marginTop: "15px" }}>
              <b>Global Permissions:</b>
              <div style={{ marginTop: "5px" }}>
                {viewUser.permissions?.map((p, i) => (
                  <span key={i} style={badgeStyle("#10b981")}>{p.name}</span>
                )) || "None"}
              </div>
            </div>

            <div style={{ marginTop: "15px" }}>
              <b>Tag Access:</b>
              <div style={{ marginTop: "5px" }}>
                {viewUser.tags?.map((t, i) => (
                  <span key={i} style={badgeStyle("#6366f1")}>{t.name}</span>
                )) || "None"}
              </div>
            </div>

            <button onClick={() => setViewUser(null)} style={{ marginTop: "20px", padding: "10px", background: "black", color: "white", border: "none", width: "100%", borderRadius: "4px", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
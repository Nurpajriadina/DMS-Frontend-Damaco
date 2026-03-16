import { useState, useEffect } from "react";
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 1. TAMBAH PROPERTI ROLES DI SINI
interface UserType {
  id: number;
  name: string;
  email: string;
  username: string;
  address: string | null;
  status: "active" | "inactive";
  roles?: { name: string }[]; 
}

const API_URL = "http://127.0.0.1:8000/api/v1";

const Users: React.FC = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");
  const [viewUser, setViewUser] = useState<UserType | null>(null);
  const [editUser, setEditUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // FUNGSI AMBIL DATA (DENGAN PENGAMAN PAGINASI)
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let extractedData = [];

      if (Array.isArray(res.data?.data?.data)) {
        extractedData = res.data.data.data;
      } else if (Array.isArray(res.data?.data)) {
        extractedData = res.data.data;
      } else if (Array.isArray(res.data)) {
        extractedData = res.data;
      }

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

  // FITUR SEARCH
  const safeUsers = Array.isArray(users) ? users : [];
  const filteredUsers = safeUsers.filter((user) => {
    const safeName = user?.name || "";
    const safeEmail = user?.email || "";
    
    return (
      safeName.toLowerCase().includes(search.toLowerCase()) || 
      safeEmail.toLowerCase().includes(search.toLowerCase())
    );
  });

  const deleteUser = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.filter((u) => u.id !== id));
      alert("User berhasil dihapus!");
    } catch (error: any) {
      console.error("Gagal menghapus user:", error);
      alert(error.response?.data?.message || "Gagal menghapus user.");
    }
  };

  const updateStatus = async (newStatus: "active" | "inactive") => {
    if (!editUser) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/users/${editUser.id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === editUser.id ? { ...u, status: newStatus } : u
        )
      );
      setEditUser(null);
      alert("Status berhasil diperbarui!");
    } catch (error: any) {
      console.error("Gagal update status:", error);
      alert(error.response?.data?.message || "Gagal memperbarui status user.");
    }
  };

  return (
    <>
      <div style={{ padding: "30px", maxWidth: "1100px", margin: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ marginBottom: "5px" }}>List User</h2>
            <p style={{ marginTop: 0, color: "gray" }}>
              This is a list of all users in the system.
            </p>
          </div>

          <button
            onClick={() => navigate("/users/create")}
            style={{
              background: "black",
              color: "white",
              border: "none",
              padding: "8px 15px",
              height: "35px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <FaPlus /> Add New
          </button>
        </div>

        <div style={{ marginTop: "25px", marginBottom: "15px" }}>
          Search:{" "}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "6px", width: "250px" }}
            placeholder="Search by name or email..."
          />
        </div>

        <table width="100%" border={1} cellPadding={10} style={{ borderCollapse: "collapse" }}>
          <thead style={{ background: "#f0f0f0" }}>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Address</th>
              <th>Role</th> {/* 2. TAMBAH HEADER ROLE DI SINI */}
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} align="center">Loading data from database...</td> {/* colSpan diubah jadi 8 */}
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td align="center">{user.id}</td>
                  <td>{user?.name || "-"}</td>
                  <td>{user?.email || "-"}</td>
                  <td>{user?.username || "-"}</td>
                  <td>{user?.address || "-"}</td>

                  {/* 3. TAMPILKAN DATA ROLE DI SINI */}
                  <td align="center">
                    <span style={{ 
                      background: "#e2e8f0", 
                      padding: "4px 8px", 
                      borderRadius: "4px", 
                      fontSize: "12px", 
                      fontWeight: "bold",
                      textTransform: "capitalize",
                      color: "#333"
                    }}>
                      {user.roles?.[0]?.name || "No Role"}
                    </span>
                  </td>

                  <td align="center">
                    <span
                      style={{
                        background: user?.status === "active" ? "#28a745" : "#dc3545",
                        color: "white",
                        padding: "4px 8px",
                        fontSize: "11px",
                        borderRadius: "3px",
                        textTransform: "uppercase",
                        fontWeight: "bold"
                      }}
                    >
                      {user?.status || "UNKNOWN"}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                      <FaEye style={{ cursor: "pointer", color: "#007bff" }} onClick={() => setViewUser(user)} title="View Details" />
                      <FaEdit style={{ cursor: "pointer", color: "#ffc107" }} onClick={() => setEditUser(user)} title="Edit Status" />
                      <FaTrash style={{ cursor: "pointer", color: "#dc3545" }} onClick={() => deleteUser(user.id)} title="Delete User" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} align="center">No Data Available</td> {/* colSpan diubah jadi 8 */}
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "gray" }}>
            Showing {filteredUsers.length} entries
          </div>
        </div>
      </div>

      {viewUser && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "white", padding: "20px", width: "350px", borderRadius: "8px" }}>
            <h3>User Detail</h3>
            <p><b>ID:</b> {viewUser.id}</p>
            <p><b>Name:</b> {viewUser.name}</p>
            <p><b>Email:</b> {viewUser.email}</p>
            <p><b>Username:</b> {viewUser.username}</p>
            <p><b>Address:</b> {viewUser.address || "-"}</p>
            
            {/* TAMBAHAN ROLE DI POPUP VIEW */}
            <p><b>Role:</b> <span style={{ textTransform: "capitalize" }}>{viewUser.roles?.[0]?.name || "No Role"}</span></p>
            
            <p><b>Status:</b> <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>{viewUser.status}</span></p>

            <button onClick={() => setViewUser(null)} style={{ marginTop: "15px", padding: "8px 15px", background: "black", color: "white", border: "none", width: "100%", borderRadius: "4px", cursor: "pointer" }}>
              Close
            </button>
          </div>
        </div>
      )}

      {editUser && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "white", padding: "20px", width: "260px", borderRadius: "8px", textAlign: "center" }}>
            <h3 style={{ marginBottom: "15px" }}>Edit Status</h3>
            <p style={{ fontSize: "14px", color: "gray", marginBottom: "15px" }}>Update status for <b>{editUser.name}</b></p>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexDirection: "column" }}>
              <button onClick={() => updateStatus("active")} style={{ padding: "8px 12px", background: "#28a745", color: "white", border: "none", cursor: "pointer", borderRadius: "4px", fontWeight: "bold" }}>
                Set as ACTIVE
              </button>
              <button onClick={() => updateStatus("inactive")} style={{ padding: "8px 12px", background: "#dc3545", color: "white", border: "none", cursor: "pointer", borderRadius: "4px", fontWeight: "bold" }}>
                Set as INACTIVE
              </button>
            </div>

            <button onClick={() => setEditUser(null)} style={{ marginTop: "15px", padding: "5px 10px", border: "none", background: "transparent", cursor: "pointer", color: "gray", textDecoration: "underline" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaDownload, FaSyncAlt, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://127.0.0.1:8000/api/v1";

const Folder: React.FC = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchFolders(); }, []);

  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/folders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      const folderArray = Array.isArray(json) ? json : json.data || [];
      setFolders(folderArray);
    } catch (err) { console.error(err); }
  };

  const filteredFolders = folders.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "auto" }}>
      <h2 style={{ marginBottom: "5px", fontWeight: "bold" }}>Folders</h2>
      <p style={{ color: "gray", fontSize: "14px" }}>This is a list of all file folder in the system.</p>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", marginBottom: "15px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={btnWhite}><FaDownload /> Export ▼</button>
          <button onClick={fetchFolders} style={btnWhite}><FaSyncAlt /> Reload</button>
        </div>
        <button onClick={() => navigate("/create-folder")} style={btnBlack}><FaPlus /> Add New</button>
      </div>

      <div style={{ marginBottom: "15px" }}>
        Search: <input value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: "5px", border: "1px solid #ccc" }} />
      </div>

      {/* Tabel dengan garis yang diperbaiki */}
      <table width="100%" style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}>
        <thead style={{ background: "#f8f9fa", borderBottom: "2px solid #ddd" }}>
          <tr>
            <th style={thStyle}>Select</th>
            <th style={thStyle}>Id</th>
            <th style={thStyle}>Folder Name</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Created By</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredFolders.map((f) => (
            <tr key={f.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td align="center" style={tdStyle}><input type="checkbox" /></td>
              <td style={tdStyle}>{f.id}</td>
              <td style={tdStyle}>{f.name}</td>
              <td style={tdStyle}>{new Date(f.created_at).toLocaleDateString('id-ID')}</td>
              <td style={tdStyle}>{f.user?.name || "Admin"}</td>
              <td style={tdStyle}><span style={{ color: "green" }}>Verified</span></td>
              <td style={{ ...tdStyle, display: "flex", gap: "15px" }}>
                <FaEye style={{ cursor: "pointer", color: "#007bff" }} onClick={() => navigate(`/folder/${f.id}`)} />
                <FaEdit style={{ cursor: "pointer" }} />
                <FaTrash style={{ cursor: "pointer", color: "red" }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styles
const thStyle = { padding: "12px", textAlign: "left" as const, border: "1px solid #ddd" };
const tdStyle = { padding: "12px", border: "1px solid #ddd" };
const btnWhite = { display: "flex", alignItems: "center", gap: "5px", padding: "8px 12px", border: "1px solid #ccc", background: "white", cursor: "pointer", borderRadius: "4px" };
const btnBlack = { background: "black", color: "white", padding: "8px 15px", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" };

export default Folder;
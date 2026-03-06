import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaDownload,
  FaSyncAlt,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

interface FolderType {
  id: number;
  name: string;
  date: string;
  createdBy: string;
  status: string;
}

const API_URL = "http://127.0.0.1:8000/api/v1";

const Folder: React.FC = () => {
  const navigate = useNavigate();

  const [folders, setFolders] = useState<FolderType[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [viewData, setViewData] = useState<FolderType | null>(null);
  const [editData, setEditData] = useState<FolderType | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchFolders();
  }, []);

const fetchFolders = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/folders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();

    console.log("API RESPONSE:", json);

    if (!res.ok) {
      console.error("Fetch error:", json);
      return;
    }

     // 🔥 INI BAGIAN PENTING
      const folderArray = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
        ? json.data
        : [];

      const formatted = folderArray.map((f: any) => ({
        id: f.id,
        name: f.name,
        date: f.created_at
          ? new Date(f.created_at).toLocaleDateString()
          : "-",
        createdBy: f.user?.name ?? "Admin",
        status: "Verified",
      }));

      setFolders(formatted);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const deleteFolder = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this folder?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/folders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        alert("Failed to delete");
        return;
      }

      fetchFolders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async () => {
    if (!editData || !editName.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/folders/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName }),
      });

      if (!res.ok) {
        alert("Update failed");
        return;
      }

      setEditData(null);
      setEditName("");
      fetchFolders();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "auto" }}>
      <h2 style={{ marginBottom: "5px" }}>Folders</h2>
      <p style={{ marginTop: 0, color: "gray" }}>
        This is a list of all file folder in the system.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          marginBottom: "15px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={fetchFolders}>
            <FaSyncAlt /> Reload
          </button>
        </div>

        <button
          onClick={() => navigate("/create-folder")}
          style={{
            background: "black",
            color: "white",
            padding: "8px 15px",
            border: "none",
            display: "flex",
            gap: "6px",
          }}
        >
          <FaPlus /> Add New
        </button>
      </div>

      Search:{" "}
      <input value={search} onChange={(e) => setSearch(e.target.value)} />

      <table
        width="100%"
        border={1}
        cellPadding={10}
        style={{ borderCollapse: "collapse", marginTop: "10px" }}
      >
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th>Select</th>
            <th>Id</th>
            <th>Folder Name</th>
            <th>Date</th>
            <th>Created By</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredFolders.length > 0 ? (
            filteredFolders.map((folder) => (
              <tr key={folder.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(folder.id)}
                    // onChange={() => toggleSelect(folder.id)}
                  />
                </td>
                <td>{folder.id}</td>
                <td>{folder.name}</td>
                <td>{folder.date}</td>
                <td>{folder.createdBy}</td>
                <td>{folder.status}</td>
                <td style={{ display: "flex", gap: "15px" }}>
                  <FaEye
                    style={{ cursor: "pointer" }}
                    onClick={() => setViewData(folder)}
                  />
                  <FaEdit
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setEditData(folder);
                      setEditName(folder.name);
                    }}
                  />
                  <FaTrash
                    onClick={() => deleteFolder(folder.id)}
                    style={{ cursor: "pointer", color: "red" }}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} align="center">
                No Data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {viewData && (
        <div style={overlayStyle}>
          <div style={cardStyle}>
            <h3>Folder Detail</h3>
            <p><strong>ID:</strong> {viewData.id}</p>
            <p><strong>Name:</strong> {viewData.name}</p>
            <p><strong>Date:</strong> {viewData.date}</p>
            <p><strong>Created By:</strong> {viewData.createdBy}</p>
            <p><strong>Status:</strong> {viewData.status}</p>
            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button onClick={() => setViewData(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {editData && (
        <div style={overlayStyle}>
          <div style={cardStyle}>
            <h3>Edit Folder Name</h3>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "10px",
                marginBottom: "20px",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setEditData(null)}>Cancel</button>
              <button onClick={handleSaveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const cardStyle: React.CSSProperties = {
  background: "white",
  padding: "30px",
  width: "420px",
  borderRadius: "8px",
};

export default Folder;
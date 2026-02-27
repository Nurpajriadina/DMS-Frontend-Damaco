import { useState } from "react";
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

const Folder: React.FC = () => {
  const navigate = useNavigate();

  const [folders, setFolders] = useState<FolderType[]>([
    {
      id: 1,
      name: "Test",
      date: new Date().toLocaleDateString(),
      createdBy: "Super Admin",
      status: "Verified",
    },
    {
      id: 2,
      name: "Project",
      date: new Date().toLocaleDateString(),
      createdBy: "Super Admin",
      status: "Verified",
    },
  ]);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [viewData, setViewData] = useState<FolderType | null>(null);
  const [editData, setEditData] = useState<FolderType | null>(null);
  const [editName, setEditName] = useState("");

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const deleteFolder = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this folder?")) return;
    setFolders(folders.filter((folder) => folder.id !== id));
  };

  const handleExport = () => {
    const selectedFolders = folders.filter((f) => selected.includes(f.id));
    if (selectedFolders.length === 0) {
      alert("Select folder first!");
      return;
    }

    const content = selectedFolders
      .map(
        (f) =>
          `ID: ${f.id}
Name: ${f.name}
Date: ${f.date}
Created By: ${f.createdBy}
Status: ${f.status}
----------------------`
      )
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "folders.txt";
    link.click();
  };

  const handleSaveEdit = () => {
    if (!editData) return;

    setFolders(
      folders.map((f) =>
        f.id === editData.id ? { ...f, name: editName } : f
      )
    );

    setEditData(null);
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "auto" }}>
      <h2 style={{ marginBottom: "5px" }}>Folders</h2>
      <p style={{ marginTop: 0, color: "gray" }}>
        This is a list of all file folder in the system.
      </p>

      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          marginBottom: "15px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleExport}>
            <FaDownload /> Export
          </button>
          <button onClick={() => window.location.reload()}>
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

      {/* SEARCH */}
      Search:{" "}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
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
                    onChange={() => toggleSelect(folder.id)}
                  />
                </td>
                <td>{folder.id}</td>
                <td>{folder.name}</td>
                <td>{folder.date}</td>
                <td>{folder.createdBy}</td>
                <td>{folder.status}</td>
                <td style={{ display: "flex", gap: "15px" }}>
                  {/* LIHAT */}
                  <FaEye
                    style={{ cursor: "pointer" }}
                    onClick={() => setViewData(folder)}
                  />

                  {/* EDIT */}
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

      {/* PAGINATION */}
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ color: "gray" }}>
          Showing 1 to {filteredFolders.length} of {filteredFolders.length} entries
        </div>
        <div style={{ display: "flex", gap: "5px" }}>
          <button>Previous</button>
          <button style={{ background: "black", color: "white" }}>1</button>
          <button>Next</button>
        </div>
      </div>

      {/* POPUP DETAIL */}
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

      {/* POPUP EDIT */}
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
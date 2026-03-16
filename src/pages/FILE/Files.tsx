import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaPrint,
  FaSyncAlt,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

interface FileType {
  id: number;
  name: string;
  date: string;
  createdBy: string;
  status: string;
}

const API_URL = "http://127.0.0.1:8000/api/v1";

const FilePage: React.FC = () => {
  const navigate = useNavigate();

  const [files, setFiles] = useState<FileType[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [viewData, setViewData] = useState<FileType | null>(null);
  const [editData, setEditData] = useState<FileType | null>(null);
  const [editName, setEditName] = useState("");

  // 🔥 SISTEM PENCARIAN CERDAS (DEBOUNCE) 🔥
  // React akan memanggil fetchFiles setiap kali kamu mengetik di kotak search,
  // tapi dia akan menunggu 500ms setelah kamu berhenti mengetik agar server tidak kepanasan.
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFiles();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]); // Pantau perubahan pada 'search'

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");

      // 🔥 MENGIRIM KATA KUNCI KE LARAVEL 🔥
      const url = search 
        ? `${API_URL}/documents?search=${encodeURIComponent(search)}` 
        : `${API_URL}/documents`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("Fetch error:", json);
        return;
      }

      const fileArray = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
        ? json.data
        : [];

      const formatted = fileArray.map((f: any) => ({
        id: f.id,
        name: f.title || "Tanpa Nama", 
        date: f.created_at
          ? new Date(f.created_at).toLocaleDateString()
          : "-",
        createdBy: f.user?.name ?? "Admin",
        status: "Verified",
      }));

      setFiles(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const deleteFile = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/documents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        alert("Delete failed");
        return;
      }

      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async () => {
    if (!editData || !editName.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/documents/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editName }), 
      });

      if (!res.ok) {
        alert("Update failed");
        return;
      }

      alert("File updated successfully!");
      setEditData(null);
      setEditName("");
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => {
    const selectedFiles = files.filter((f) => selected.includes(f.id));
    if (selectedFiles.length === 0) {
      alert("Select file first!");
      return;
    }

    const content = selectedFiles
      .map(
        (f) =>
          `ID: ${f.id}\nName: ${f.name}\nDate: ${f.date}\nCreated By: ${f.createdBy}\nStatus: ${f.status}`
      )
      .join("\n\n");

    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`<pre>${content}</pre>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // STYLE UNTUK MODAL
  const modalOverlayStyle: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
  };

  const modalContentStyle: React.CSSProperties = {
    background: "white", padding: "20px", borderRadius: "8px", width: "400px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "auto" }}>
      <h2 style={{ marginBottom: "5px" }}>Files</h2>
      <p style={{ marginTop: 0, color: "gray" }}>
        This is a list of all files in the system.
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={fetchFiles} style={{ cursor: "pointer", padding: "5px 10px" }}>
            <FaPrint /> Print
          </button>
          <button onClick={fetchFiles} style={{ cursor: "pointer", padding: "5px 10px" }}>
            <FaSyncAlt /> Reload
          </button>
        </div>

        <button
          onClick={() => navigate("/file/create")}
          style={{
            background: "black", color: "white", padding: "8px 15px", border: "none",
            display: "flex", gap: "6px", alignItems: "center", cursor: "pointer"
          }}
        >
          <FaPlus /> Add New
        </button>
      </div>

      <div style={{ marginBottom: "15px" }}>
        Search:{" "}
        <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Cari judul atau isi dalam PDF..."
            style={{ padding: "5px", width: "300px" }}
        />
      </div>

      <table width="100%" border={1} cellPadding={10} style={{ borderCollapse: "collapse", marginTop: "10px" }}>
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th>Select</th>
            <th>Id</th>
            <th>File Name</th>
            <th>Date</th>
            <th>Created By</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* 🔥 KITA LANGSUNG MENGGUNAKAN 'files' DARI DATABASE, BUKAN filteredFiles 🔥 */}
          {files.length > 0 ? (
            files.map((file) => (
              <tr key={file.id}>
                <td align="center">
                  <input
                    type="checkbox"
                    checked={selected.includes(file.id)}
                    onChange={() => toggleSelect(file.id)}
                  />
                </td>
                <td align="center">{file.id}</td>
                <td>{file.name}</td>
                <td>{file.date}</td>
                <td>{file.createdBy}</td>
                <td align="center">
                    <span style={{ color: "green", fontWeight: "bold" }}>{file.status}</span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                    <FaEye 
                        onClick={() => setViewData(file)} 
                        style={{ cursor: "pointer", color: "#007bff" }} 
                        title="Show Detail"
                    />
                    <FaEdit
                        style={{ cursor: "pointer", color: "#ffc107" }} 
                        onClick={() => {
                          setEditData(file);
                          setEditName(file.name);
                        }}
                        title="Edit File"
                    />
                    <FaTrash
                        onClick={() => deleteFile(file.id)}
                        style={{ cursor: "pointer", color: "#dc3545" }} 
                        title="Delete File"
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} align="center">Data tidak ditemukan</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL SHOW (VIEW) */}
      {viewData && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>File Detail</h3>
            <hr />
            <p><strong>ID:</strong> {viewData.id}</p>
            <p><strong>Name:</strong> {viewData.name}</p>
            <p><strong>Created At:</strong> {viewData.date}</p>
            <p><strong>Owner:</strong> {viewData.createdBy}</p>
            <p><strong>Status:</strong> {viewData.status}</p>
            <button 
                onClick={() => setViewData(null)}
                style={{ width: "100%", padding: "8px", background: "black", color: "white", border: "none", cursor: "pointer", marginTop: "10px" }}
            >
                Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {editData && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Edit File Name</h3>
            <hr />
            <div style={{ marginBottom: "15px", marginTop: "10px" }}>
                <label>File Name:</label>
                <input 
                    style={{ width: "100%", padding: "8px", marginTop: "5px", boxSizing: "border-box" }}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
                <button 
                    onClick={handleSaveEdit}
                    style={{ flex: 1, padding: "8px", background: "#28a745", color: "white", border: "none", cursor: "pointer" }}
                >
                    Save Changes
                </button>
                <button 
                    onClick={() => setEditData(null)}
                    style={{ flex: 1, padding: "8px", background: "#6c757d", color: "white", border: "none", cursor: "pointer" }}
                >
                    Cancel
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilePage;
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

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/documents`, {
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
        // PERBAIKAN 1: Berikan fallback jika f.name dari API bernilai null/undefined
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

  // PERBAIKAN 2: Gunakan (file.name || "") untuk mencegah error toLowerCase()
  const filteredFiles = files.filter((file) =>
    (file.name || "").toLowerCase().includes(search.toLowerCase())
  );

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
        body: JSON.stringify({ name: editName }),
      });

      if (!res.ok) {
        alert("Update failed");
        return;
      }

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

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "auto" }}>
      <h2 style={{ marginBottom: "5px" }}>Files</h2>
      <p style={{ marginTop: 0, color: "gray" }}>
        This is a list of all file file in the system.
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handlePrint}>
            <FaPrint /> Print
          </button>
          <button onClick={fetchFiles}>
            <FaSyncAlt /> Reload
          </button>
        </div>

        <button
          onClick={() => navigate("/file/create")}
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
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <tr key={file.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(file.id)}
                    onChange={() => toggleSelect(file.id)}
                  />
                </td>
                <td>{file.id}</td>
                <td>{file.name}</td>
                <td>{file.date}</td>
                <td>{file.createdBy}</td>
                <td>{file.status}</td>
                <td style={{ display: "flex", gap: "15px" }}>
                  <FaEye onClick={() => setViewData(file)} style={{ cursor: "pointer" }} />
                  <FaEdit
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setEditData(file);
                      setEditName(file.name);
                    }}
                  />
                  <FaTrash
                    onClick={() => deleteFile(file.id)}
                    style={{ cursor: "pointer", color: "red" }}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} align="center">No Data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FilePage;
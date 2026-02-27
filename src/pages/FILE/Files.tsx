import { useState } from "react";
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

const FilePage: React.FC = () => {
  const navigate = useNavigate();

  const [files, setFiles] = useState<FileType[]>([
    {
      id: 1,
      name: "Contract.pdf",
      date: new Date().toLocaleDateString(),
      createdBy: "Super Admin",
      status: "Verified",
    },
  ]);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [viewData, setViewData] = useState<FileType | null>(null);
  const [editData, setEditData] = useState<FileType | null>(null);
  const [editName, setEditName] = useState("");

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const deleteFile = (id: number) => {
    if (!window.confirm("Are you sure?")) return;
    setFiles(files.filter((file) => file.id !== id));
  };

  // PRINT SELECTED
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

  const handleSaveEdit = () => {
    if (!editData) return;
    setFiles(
      files.map((f) =>
        f.id === editData.id ? { ...f, name: editName } : f
      )
    );
    setEditData(null);
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
          <button onClick={() => window.location.reload()}>
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
          {filteredFiles.map((file) => (
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
                <FaEye onClick={() => setViewData(file)} />
                <FaEdit
                  onClick={() => {
                    setEditData(file);
                    setEditName(file.name);
                  }}
                />
                <FaTrash onClick={() => deleteFile(file.id)} color="red" />
              </td>
            </tr>
          ))}
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
          Showing 1 to {filteredFiles.length} of {filteredFiles.length} entries
        </div>
        <div style={{ display: "flex", gap: "5px" }}>
          <button>Previous</button>
          <button style={{ background: "black", color: "white" }}>1</button>
          <button>Next</button>
        </div>
      </div>

      {/* DETAIL POPUP */}
      {viewData && (
        <div style={popupStyle}>
          <div style={cardStyle}>
            <h3>File Detail</h3>
            <p>ID: {viewData.id}</p>
            <p>Name: {viewData.name}</p>
            <p>Date: {viewData.date}</p>
            <p>Created By: {viewData.createdBy}</p>
            <p>Status: {viewData.status}</p>
            <button onClick={() => setViewData(null)}>Close</button>
          </div>
        </div>
      )}

      {/* EDIT POPUP */}
      {editData && (
        <div style={popupStyle}>
          <div style={cardStyle}>
            <h3>Edit File Name</h3>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
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

const popupStyle: React.CSSProperties = {
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
  width: "400px",
  borderRadius: "8px",
};

export default FilePage;
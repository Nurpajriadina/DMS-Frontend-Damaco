import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
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
  const [viewData, setViewData] = useState<FolderType | null>(null);

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(search.toLowerCase())
  );

  const deleteFolder = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this folder?"
    );
    if (!confirmDelete) return;

    setFolders(folders.filter((folder) => folder.id !== id));
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "30px", maxWidth: "1200px", margin: "auto" }}>
        <h2>Folder</h2>

        {/* ADD NEW */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "15px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => navigate("/create-folder")}
            style={{
              background: "black",
              color: "white",
              padding: "8px 15px",
              border: "none",
              display: "flex",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <FaPlus /> Add New
          </button>
        </div>

        {/* SEARCH */}
        <div style={{ marginBottom: "15px" }}>
          Search:{" "}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "5px" }}
          />
        </div>

        {/* TABLE */}
        <table
          width="100%"
          border={1}
          cellPadding={10}
          style={{ borderCollapse: "collapse" }}
        >
          <thead style={{ background: "#f0f0f0" }}>
            <tr>
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
                  <td>{folder.id}</td>
                  <td>{folder.name}</td>
                  <td>{folder.date}</td>
                  <td>{folder.createdBy}</td>
                  <td>
                    <span
                      style={{
                        background: "black",
                        color: "white",
                        padding: "4px 8px",
                        fontSize: "12px",
                      }}
                    >
                      {folder.status}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: "10px" }}>
                    <FaEye
                      style={{ cursor: "pointer" }}
                      onClick={() => setViewData(folder)}
                    />
                    <FaEdit
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate(`/edit-folder/${folder.id}`)
                      }
                    />
                    <FaTrash
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => deleteFolder(folder.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} align="center">
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* FOOTER */}
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ color: "gray" }}>
            Showing 1 to {filteredFolders.length} of{" "}
            {filteredFolders.length} entries
          </div>

          <div style={{ display: "flex", gap: "5px" }}>
            <button
              style={{
                padding: "5px 10px",
                border: "1px solid #ccc",
                background: "#f8f8f8",
              }}
            >
              Previous
            </button>

            <button
              style={{
                padding: "5px 10px",
                border: "1px solid black",
                background: "black",
                color: "white",
              }}
            >
              1
            </button>

            <button
              style={{
                padding: "5px 10px",
                border: "1px solid #ccc",
                background: "#f8f8f8",
              }}
            >
              Next
            </button>
          </div>
        </div>

        {/* VIEW MODAL */}
        {viewData && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "20px",
                width: "350px",
                borderRadius: "8px",
              }}
            >
              <h3>Folder Detail</h3>
              <p><b>ID:</b> {viewData.id}</p>
              <p><b>Name:</b> {viewData.name}</p>
              <p><b>Date:</b> {viewData.date}</p>
              <p><b>Created By:</b> {viewData.createdBy}</p>
              <p><b>Status:</b> {viewData.status}</p>

              <button
                onClick={() => setViewData(null)}
                style={{
                  marginTop: "10px",
                  padding: "6px 12px",
                  background: "black",
                  color: "white",
                  border: "none",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Folder;
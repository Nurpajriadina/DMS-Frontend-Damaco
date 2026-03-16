import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, FaShareAlt, FaEdit, FaTrash, 
  FaFileWord, FaFilePdf, FaFileExcel, FaFileAlt,
  FaCheckCircle, FaUser, FaClock, FaEye, FaEllipsisV 
} from "react-icons/fa";

const API_URL = "http://127.0.0.1:8000/api/v1";
const BASE_URL = "http://127.0.0.1:8000"; 

const FolderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Files");
  const [folder, setFolder] = useState<any>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  
  // State untuk seleksi file
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);

  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/folders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setFolder(json.data || json);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  // ✅ FUNGSI EDIT FOLDER
  const handleEditFolder = async () => {
    const newName = prompt("Masukkan nama folder baru:", folder.name);
    if (!newName || newName === folder.name) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/folders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName })
      });
      if (res.ok) {
        alert("Folder berhasil diperbarui!");
        fetchDetail();
      }
    } catch (err) { console.error(err); }
  };

  // ✅ FUNGSI DELETE SELECTED FILES
  const handleDeleteSelected = async () => {
    if (selectedFiles.length === 0) {
      alert("Pilih file yang ingin dihapus terlebih dahulu!");
      return;
    }

    if (!window.confirm(`Hapus ${selectedFiles.length} file yang dipilih?`)) return;

    try {
      const token = localStorage.getItem("token");
      // Loop untuk menghapus setiap file yang dipilih
      const deletePromises = selectedFiles.map(fileId => 
        fetch(`${API_URL}/documents/${fileId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        })
      );

      await Promise.all(deletePromises);
      alert("File berhasil dihapus!");
      setSelectedFiles([]); // Reset seleksi
      fetchDetail(); // Reload data
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Gagal menghapus beberapa file.");
    }
  };

  // ✅ FUNGSI TOGGLE SELECT
  const toggleSelectFile = (fileId: number) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) ? prev.filter(item => item !== fileId) : [...prev, fileId]
    );
  };

  const handleShare = async () => {
    try {
      const token = localStorage.getItem("token");
      const randomShareToken = Math.random().toString(36).substring(2, 15);
      
      const payload = {
        folder_id: id,
        document_id: null,
        token: randomShareToken,
        login_required: false,
        created_by: 1, 
      };

      const res = await fetch(`${API_URL}/shares`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (res.ok && json.success) {
        alert("Link share folder berhasil dibuat!");
        navigate("/myshares");
      }
    } catch (err) { console.error("Share Error:", err); }
  };

  const handleOpenFile = (doc: any) => {
    const filePath = doc.file_path || doc.path || doc.title; 
    if (!filePath) return;
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    const fullUrl = `${BASE_URL}/storage/${cleanPath}`;
    window.open(fullUrl, "_blank");
  };

  const getFileIcon = (filename: string | undefined) => {
    if (!filename) return <FaFileAlt size={45} color="#6c757d" />;
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FaFilePdf size={45} color="#e04433" />;
    if (['doc', 'docx'].includes(ext || '')) return <FaFileWord size={45} color="#2b579a" />;
    if (['xls', 'xlsx'].includes(ext || '')) return <FaFileExcel size={45} color="#1d6f42" />;
    return <FaFileAlt size={45} color="#6c757d" />;
  };

  if (!folder) return <div style={{ padding: "50px", textAlign: "center" }}>Loading Folder...</div>;

  return (
    <div style={{ background: "#f4f7f9", minHeight: "100vh", padding: "40px" }}>
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "bold", color: "#1a202c" }}>{folder.name}</h1>
          <div style={{ background: "#000", color: "#fff", padding: "2px 10px", borderRadius: "4px", fontSize: "12px", display: "inline-block", marginTop: "5px" }}>
            ID: {folder.id}
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* ✅ TOMBOL BACK (MENGGANTIKAN DOWNLOAD) */}
          <button style={btnAction} onClick={() => navigate("/folder")} title="Back to Folders">
            <FaArrowLeft />
          </button>
          
          <button style={btnAction} onClick={handleShare} title="Share Folder"><FaShareAlt /></button>
          
          {/* ✅ TOMBOL EDIT BERFUNGSI */}
          <button style={btnAction} onClick={handleEditFolder} title="Edit Folder Name"><FaEdit /></button>
          
          {/* ✅ TOMBOL HAPUS BERFUNGSI (HAPUS FILE TERPILIH) */}
          <button 
            style={{ ...btnAction, color: selectedFiles.length > 0 ? "white" : "#4a5568", background: selectedFiles.length > 0 ? "#e53e3e" : "white" }} 
            onClick={handleDeleteSelected}
            title="Delete Selected Files"
          >
            <FaTrash /> {selectedFiles.length > 0 && `(${selectedFiles.length})`}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: "1px solid #edf2f7", padding: "0 20px" }}>
          {["Files", "Verification", "Detail Folder"].map((tab) => (
            <div 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              style={{ 
                padding: "20px", 
                cursor: "pointer", 
                color: activeTab === tab ? "#3182ce" : "#718096", 
                borderBottom: activeTab === tab ? "3px solid #3182ce" : "3px solid transparent",
                fontWeight: activeTab === tab ? "bold" : "normal"
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        <div style={{ padding: "30px" }}>
          {activeTab === "Files" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "25px" }}>
              {folder.documents && folder.documents.length > 0 ? (
                folder.documents.map((doc: any) => (
                  <div 
                    key={doc.id} 
                    onMouseEnter={() => setHoveredId(doc.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      ...docCard,
                      transform: hoveredId === doc.id ? "translateY(-8px)" : "none",
                      border: selectedFiles.includes(doc.id) ? "2px solid #3182ce" : "1px solid #edf2f7"
                    }}
                  >
                    {/* ✅ CHECKBOX SELEKSI */}
                    <div style={{ position: "absolute", top: "12px", left: "12px", zIndex: 5 }}>
                        <input 
                            type="checkbox" 
                            style={{ width: "18px", height: "18px", cursor: "pointer" }}
                            checked={selectedFiles.includes(doc.id)}
                            onChange={() => toggleSelectFile(doc.id)}
                            onClick={(e) => e.stopPropagation()} // Supaya tidak mentrigger view file
                        />
                    </div>

                    <div style={{ position: "absolute", top: "12px", right: "12px", color: "#cbd5e0" }}><FaEllipsisV /></div>
                    
                    <div style={{ background: hoveredId === doc.id ? "#ebf8ff" : "#f8fafc", borderRadius: "10px", padding: "35px", marginBottom: "15px", position: "relative" }}>
                      {getFileIcon(doc.title)}
                      <div style={{ color: "#718096", fontSize: "11px", marginTop: "12px", fontWeight: "bold" }}>
                        {doc.title?.split('.').pop()?.toUpperCase() || "FILE"}
                      </div>

                      {hoveredId === doc.id && (
                        <div onClick={() => handleOpenFile(doc)} style={hoverOverlay}>
                          <FaEye size={24} />
                          <span style={{ fontSize: "14px", marginTop: "8px", fontWeight: "600" }}>View File</span>
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: "left" }}>
                      <div style={tagLabel}>Document</div>
                      <h4 style={docTitle} title={doc.title}>{doc.title || "Untitled File"}</h4>
                      <div style={docMeta}><FaClock size={10} /> {new Date(doc.created_at).toLocaleDateString('id-ID')}</div>
                      <div style={docMeta}><FaUser size={10} /> Super Admin</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", width: "100%", color: "#a0aec0", padding: "40px" }}>
                  Belum ada file di folder ini.
                </div>
              )}
            </div>
          )}

          {/* TAB LAINNYA TETAP SAMA... */}
          {activeTab === "Verification" && (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <div style={verificationBox}>
                <FaCheckCircle size={60} color="#38a169" />
                <h2 style={{ margin: "20px 0 10px", color: "#2d3748" }}>Verified Successfully</h2>
                <p style={{ color: "#718096" }}>This document has been approved</p>
              </div>
            </div>
          )}

          {activeTab === "Detail Folder" && (
            <div>
              <table width="100%" style={{ borderCollapse: "collapse" }}>
                 <tbody>
                    <tr style={tableRow}><td style={tdLabel}>STATUS</td><td style={tdValue}><span style={badgeSuccess}>APPROVED</span></td></tr>
                    <tr style={tableRow}><td style={tdLabel}>CREATED BY</td><td style={tdValue}>Super Admin</td></tr>
                    <tr style={tableRow}><td style={tdLabel}>CREATED AT</td><td style={tdValue}>{new Date(folder.created_at).toLocaleString('id-ID')}</td></tr>
                 </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const btnBack = { background: "#4a5568", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold" as const, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" };
const btnAction = { background: "#fff", color: "#4a5568", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", transition: "0.2s" };
const docCard = { background: "#fff", border: "1px solid #edf2f7", borderRadius: "16px", padding: "16px", textAlign: "center" as const, position: "relative" as const, transition: "0.3s ease" };
const hoverOverlay = { position: "absolute" as const, top: 0, left: 0, width: "100%", height: "100%", background: "rgba(49, 130, 206, 0.9)", borderRadius: "10px", display: "flex", flexDirection: "column" as const, justifyContent: "center", alignItems: "center", color: "#fff", zIndex: 2 };
const docTitle = { margin: "5px 0", fontSize: "14px", fontWeight: "bold", color: "#2d3748", whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" };
const tagLabel = { background: "#edf2f7", padding: "2px 8px", borderRadius: "4px", fontSize: "10px", display: "inline-block", marginBottom: "5px", color: "#4a5568" };
const docMeta = { fontSize: "11px", color: "#a0aec0", display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" };
const verificationBox = { background: "#f0fff4", padding: "40px", borderRadius: "16px", display: "inline-block", border: "1px solid #c6f6d5", minWidth: "350px" };
const tableRow = { borderBottom: "1px solid #edf2f7" };
const tdLabel = { padding: "15px", color: "#718096", fontSize: "13px", fontWeight: "bold", width: "200px" };
const tdValue = { padding: "15px", color: "#2d3748", fontSize: "14px" };
const badgeSuccess = { background: "#c6f6d5", color: "#22543d", padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold" };

export default FolderDetail;
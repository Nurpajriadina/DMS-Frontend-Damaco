import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaDownload, FaShareAlt, FaEdit, FaTrash, 
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

  useEffect(() => {
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
    if (id) fetchDetail();
  }, [id]);

  // ✅ UPDATE: FUNGSI HANDLE SHARE (FOLDER_ID)
  const handleShare = async () => {
    try {
      const token = localStorage.getItem("token");
      const randomShareToken = Math.random().toString(36).substring(2, 15);
      
      const payload = {
        folder_id: id, // Mengirimkan ID Folder
        document_id: null,
        token: randomShareToken,
        login_required: false,
        created_by: 1, // Pastikan ini sesuai dengan ID user Anda
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
        navigate("/myshares"); // Navigasi ke halaman My Shares
      } else {
        console.error("Gagal share:", json);
        alert("Gagal membagikan folder. Cek apakah kolom folder_id sudah ada di DB.");
      }
    } catch (err) {
      console.error("Share Error:", err);
      alert("Terjadi kesalahan sistem.");
    }
  };

  const handleOpenFile = (doc: any) => {
    const filePath = doc.file_path || doc.path || doc.title; 

    if (!filePath) {
      alert("Maaf, informasi file tidak ditemukan di database.");
      return;
    }

    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    const fullUrl = `${BASE_URL}/storage/${cleanPath}`;
    const ext = filePath.split('.').pop()?.toLowerCase();

    try {
      if (ext === 'pdf') {
        window.open(fullUrl, "_blank");
      } else if (['doc', 'docx', 'xls', 'xlsx'].includes(ext || '')) {
        window.open(`https://docs.google.com/gview?url=${encodeURIComponent(fullUrl)}&embedded=true`, "_blank");
      } else {
        window.open(fullUrl, "_blank");
      }
    } catch (e) {
      console.error("Gagal membuka file", e);
    }
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
          <button style={btnDownload}><FaDownload /> Download ▼</button>
          <button style={btnAction} onClick={handleShare} title="Share Folder"><FaShareAlt /></button>
          <button style={btnAction}><FaEdit /></button>
          <button style={btnAction}><FaTrash /></button>
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
          {/* TAB FILES */}
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
                    }}
                  >
                    <div style={{ position: "absolute", top: "12px", right: "12px", color: "#cbd5e0" }}><FaEllipsisV /></div>
                    
                    <div style={{ background: hoveredId === doc.id ? "#ebf8ff" : "#f8fafc", borderRadius: "10px", padding: "35px", marginBottom: "15px", position: "relative" }}>
                      {getFileIcon(doc.title)}
                      <div style={{ color: "#718096", fontSize: "11px", marginTop: "12px", fontWeight: "bold" }}>
                        {doc.title?.split('.').pop()?.toUpperCase() || "FILE"}
                      </div>

                      {/* Hover Action Overlay */}
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

          {/* TAB VERIFICATION */}
          {activeTab === "Verification" && (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <div style={verificationBox}>
                <FaCheckCircle size={60} color="#38a169" />
                <h2 style={{ margin: "20px 0 10px", color: "#2d3748" }}>Verified Successfully</h2>
                <p style={{ color: "#718096" }}>This document has been approved</p>
                <div style={verificationInfo}>
                   <div style={infoRow}><FaUser color="#cbd5e0" /> <div><small style={{color: "#a0aec0"}}>Verified By</small><br/><strong>Super Admin</strong></div></div>
                   <div style={infoRow}><FaClock color="#cbd5e0" /> <div><small style={{color: "#a0aec0"}}>Verified At</small><br/><strong>18/02/2026 09:11 AM</strong></div></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB DETAIL FOLDER */}
          {activeTab === "Detail Folder" && (
            <div>
              <table width="100%" style={{ borderCollapse: "collapse" }}>
                 <tbody>
                    <tr style={tableRow}><td style={tdLabel}>STATUS</td><td style={tdValue}><span style={badgeSuccess}>APPROVED</span></td></tr>
                    <tr style={tableRow}><td style={tdLabel}>CREATED BY</td><td style={tdValue}>Super Admin</td></tr>
                    <tr style={tableRow}><td style={tdLabel}>CREATED AT</td><td style={tdValue}>{new Date(folder.created_at).toLocaleString('id-ID')}</td></tr>
                    <tr style={tableRow}><td style={tdLabel}>LAST UPDATED</td><td style={tdValue}>{new Date(folder.updated_at).toLocaleString('id-ID')}</td></tr>
                 </tbody>
              </table>
              <div style={{ marginTop: "30px" }}>
                 <h4 style={{ marginBottom: "10px", color: "#2d3748" }}>Description</h4>
                 <div style={{ height: "1px", background: "#edf2f7", width: "100%" }}></div>
                 <p style={{ color: "#718096", marginTop: "15px", fontSize: "14px" }}>{folder.description || "Tidak ada deskripsi."}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const btnDownload = { background: "#c53030", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold" as const, cursor: "pointer" };
const btnAction = { background: "#fff", color: "#4a5568", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center" };
const docCard = { background: "#fff", border: "1px solid #edf2f7", borderRadius: "16px", padding: "16px", textAlign: "center" as const, position: "relative" as const, transition: "0.3s ease", cursor: "pointer" };
const hoverOverlay = { position: "absolute" as const, top: 0, left: 0, width: "100%", height: "100%", background: "rgba(49, 130, 206, 0.9)", borderRadius: "10px", display: "flex", flexDirection: "column" as const, justifyContent: "center", alignItems: "center", color: "#fff", zIndex: 2 };
const docTitle = { margin: "5px 0", fontSize: "14px", fontWeight: "bold", color: "#2d3748", whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" };
const tagLabel = { background: "#edf2f7", padding: "2px 8px", borderRadius: "4px", fontSize: "10px", display: "inline-block", marginBottom: "5px", color: "#4a5568" };
const docMeta = { fontSize: "11px", color: "#a0aec0", display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" };
const verificationBox = { background: "#f0fff4", padding: "40px", borderRadius: "16px", display: "inline-block", border: "1px solid #c6f6d5", minWidth: "350px" };
const verificationInfo = { marginTop: "30px", textAlign: "left" as const, borderTop: "1px solid #c6f6d5", paddingTop: "20px" };
const infoRow = { display: "flex", gap: "15px", alignItems: "center", marginBottom: "15px" };
const tableRow = { borderBottom: "1px solid #edf2f7" };
const tdLabel = { padding: "15px", color: "#718096", fontSize: "13px", fontWeight: "bold", width: "200px" };
const tdValue = { padding: "15px", color: "#2d3748", fontSize: "14px" };
const badgeSuccess = { background: "#c6f6d5", color: "#22543d", padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold" };

export default FolderDetail;
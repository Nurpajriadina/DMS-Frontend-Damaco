import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  FaFolder, 
  FaFileAlt, 
  FaFilePdf, 
  FaFileWord, 
  FaFileExcel, 
  FaEye, 
  FaClock, 
  FaUser,
  FaLock,
  FaEnvelope
} from "react-icons/fa";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/v1";

const ViewShare: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  
  // 🔥 STATE UNTUK LOGIN
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem("token"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  // STATE UNTUK DATA SHARE
  const [shareData, setShareData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // 1. FUNGSI HANDLE LOGIN (LANGSUNG DI HALAMAN INI)
// 1. FUNGSI HANDLE LOGIN (LANGSUNG DI HALAMAN INI)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      
      // 🔥 KUNCI PERBAIKAN: Tangkap semua kemungkinan nama token dari Laravel!
      const newToken = res.data.token || res.data.access_token || res.data.data?.token || res.data.data?.access_token; 
      
      if (newToken) {
        localStorage.setItem("token", newToken);
        setAuthToken(newToken); // Sukses! Langsung ambil data file.
      } else {
        // Kalau masih lolos juga, kita cetak datanya di Console agar tahu wujud aslinya
        console.log("Isi respons dari Laravel:", res.data);
        setLoginError("Bentuk token berbeda. Silakan cek Inspect -> Console (F12) untuk melihat struktur datanya.");
      }
    } catch (err: any) {
      setLoginError(err.response?.data?.message || "Login gagal! Periksa email dan password Anda.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 2. FUNGSI AMBIL DATA (HANYA BERJALAN JIKA SUDAH PUNYA TOKEN)
  useEffect(() => {
    const fetchSharedItem = async () => {
      if (!authToken) return; // Jangan ambil data kalau belum login

      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/shared/${token}`, {
          headers: { Authorization: `Bearer ${authToken}` } 
        });
        
        if (res.data && res.data.success) {
          setShareData(res.data.data);
          setError(null);
        } else {
          setError("Link tidak valid atau sudah kadaluarsa.");
        }
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.response?.data?.message || "Halaman tidak ditemukan atau Anda tidak memiliki akses.");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedItem();
  }, [token, authToken]); // Bergantung pada token dan status login

  // 3. FUNGSI BUKA FILE
  const handleOpenFile = async (doc: any) => {
    try {
      const authToken = localStorage.getItem("token");
      const fileUrl = `${API_URL}/shared/${token}/file/${doc.id}`;

      // Meminta file ke Laravel menggunakan tiket login, dengan format blob
      const response = await axios.get(fileUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
        responseType: "blob" 
      });

      // 🔥 KUNCI RAHASIANYA DI SINI 🔥
      // Kita baca tipe file asli dari Laravel (misal: application/pdf atau image/png)
      // Kalau tidak terbaca, kita paksa anggap sebagai PDF
      const contentType = response.headers['content-type'] || 'application/pdf';
      
      // Bungkus datanya dan beri "Label" agar browser tidak bingung
      const fileBlob = new Blob([response.data], { type: contentType });

      // Membuat URL sementara dan membukanya di tab baru
      const blobUrl = window.URL.createObjectURL(fileBlob);
      window.open(blobUrl, "_blank");

    } catch (error: any) {
      console.error("Gagal membuka file", error);
      alert("Gagal membuka file. Pastikan Anda memiliki akses.");
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

  // ==========================================
  // TAMPILAN 1: JIKA USER BELUM LOGIN
  // ==========================================
  if (!authToken) {
    return (
      <div style={{ background: "#f4f7f9", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div style={{ background: "#ebf8ff", width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 15px" }}>
              <FaLock size={24} color="#3182ce" />
            </div>
            <h2 style={{ margin: 0, color: "#2d3748" }}>Akses Terbatas</h2>
            <p style={{ color: "#718096", fontSize: "14px", marginTop: "5px" }}>Silakan login untuk melihat dokumen ini.</p>
          </div>

          {loginError && <div style={{ background: "#fed7d7", color: "#c53030", padding: "10px", borderRadius: "6px", fontSize: "13px", marginBottom: "20px", textAlign: "center" }}>{loginError}</div>}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold", color: "#4a5568" }}>Email</label>
              <div style={{ position: "relative" }}>
                <FaEnvelope style={{ position: "absolute", top: "12px", left: "12px", color: "#a0aec0" }} />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "10px 10px 10px 35px", borderRadius: "6px", border: "1px solid #cbd5e0", boxSizing: "border-box" }} 
                  placeholder="Masukkan email Anda" 
                />
              </div>
            </div>
            
            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold", color: "#4a5568" }}>Password</label>
              <div style={{ position: "relative" }}>
                <FaLock style={{ position: "absolute", top: "12px", left: "12px", color: "#a0aec0" }} />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", padding: "10px 10px 10px 35px", borderRadius: "6px", border: "1px solid #cbd5e0", boxSizing: "border-box" }} 
                  placeholder="Masukkan password Anda" 
                />
              </div>
            </div>

            <button type="submit" disabled={isLoggingIn} style={{ width: "100%", padding: "12px", background: "#3182ce", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: isLoggingIn ? "not-allowed" : "pointer" }}>
              {isLoggingIn ? "Memeriksa..." : "Buka Dokumen"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN 2: JIKA SUDAH LOGIN (LOADING/ERROR/DATA)
  // ==========================================
  if (loading) return <div style={{ textAlign: "center", padding: "50px", fontSize: "18px" }}>Membuka brankas dokumen...</div>;
  if (error) return <div style={{ textAlign: "center", padding: "50px", color: "red", fontSize: "18px" }}><h2>Oops!</h2><p>{error}</p></div>;
  if (!shareData) return null;

  const isFolder = shareData.folder_id !== null;
  const targetData = isFolder ? shareData.folder : shareData.document;

  return (
    <div style={{ background: "#f4f7f9", minHeight: "100vh", padding: "40px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        
        {/* Header Folder / File */}
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", marginBottom: "30px", display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ background: isFolder ? "#fffaf0" : "#ebf8ff", padding: "20px", borderRadius: "50%" }}>
            {isFolder ? <FaFolder size={40} color="#f6ad55" /> : <FaFileAlt size={40} color="#4299e1" />}
          </div>
          <div>
            <h1 style={{ margin: "0 0 5px 0", color: "#2d3748" }}>{isFolder ? targetData.name : targetData.title}</h1>
            <p style={{ margin: 0, color: "#718096", fontSize: "14px", display: "flex", gap: "15px" }}>
              <span><FaUser /> Shared by DAMACO System</span>
              <span><FaClock /> {new Date(shareData.created_at).toLocaleDateString('id-ID')}</span>
            </p>
          </div>
        </div>

        {/* Konten Folder / File (Sama seperti sebelumnya) */}
        {isFolder ? (
          <div>
            <h3 style={{ color: "#4a5568", marginBottom: "20px" }}>Isi Folder ({targetData.documents?.length || 0} Files)</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "25px" }}>
              {targetData.documents && targetData.documents.length > 0 ? (
                targetData.documents.map((doc: any) => (
                  <div 
                    key={doc.id} 
                    onMouseEnter={() => setHoveredId(doc.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{ background: "#fff", border: "1px solid #edf2f7", borderRadius: "16px", padding: "16px", textAlign: "center", position: "relative", transition: "0.3s ease", cursor: "pointer", transform: hoveredId === doc.id ? "translateY(-5px)" : "none", boxShadow: hoveredId === doc.id ? "0 10px 15px -3px rgba(0,0,0,0.1)" : "none" }}
                  >
                    <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "35px", marginBottom: "15px", position: "relative" }}>
                      {getFileIcon(doc.title)}
                      <div style={{ color: "#718096", fontSize: "11px", marginTop: "12px", fontWeight: "bold" }}>
                        {doc.title?.split('.').pop()?.toUpperCase() || "FILE"}
                      </div>
                      
                      {hoveredId === doc.id && (
                        <div onClick={() => handleOpenFile(doc)} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(49, 130, 206, 0.9)", borderRadius: "10px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "#fff", zIndex: 2 }}>
                          <FaEye size={24} />
                          <span style={{ fontSize: "14px", marginTop: "8px", fontWeight: "600" }}>View File</span>
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <h4 style={{ margin: "5px 0", fontSize: "14px", fontWeight: "bold", color: "#2d3748", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={doc.title}>
                        {doc.title || "Untitled File"}
                      </h4>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "gray" }}>Folder ini kosong.</p>
              )}
            </div>
          </div>
        ) : (
          <div style={{ background: "white", padding: "40px", borderRadius: "12px", textAlign: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            {getFileIcon(targetData.title)}
            <h2 style={{ marginTop: "20px", color: "#2d3748" }}>{targetData.title}</h2>
            <div style={{ marginTop: "30px", display: "flex", justifyContent: "center", gap: "15px" }}>
              <button onClick={() => handleOpenFile(targetData)} style={{ background: "#3182ce", color: "white", border: "none", padding: "12px 25px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", fontWeight: "bold" }}>
                <FaEye /> View Document
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ViewShare;
import React, { useState, useEffect } from "react";
import { 
  FaShareAlt, 
  FaFilter, 
  FaSyncAlt, 
  FaFolder, 
  FaRegEye, 
  FaFile, 
  FaCalendarAlt, 
  FaClock, 
  FaExternalLinkAlt, 
  FaTrash, 
  FaCopy 
} from "react-icons/fa";

interface ShareItem {
  id: number;
  token: string;
  folder_id: number | null;
  document_id: number | null;
  login_required: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  folder: { name: string } | null;
  document: {
    title: string;
  } | null;
}

const API_URL = "http://127.0.0.1:8000/api/v1";

const timeSince = (dateString: string) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "Just now";
};

const MyShares: React.FC = () => {
  const [shares, setShares] = useState<ShareItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL Shares");

  useEffect(() => {
    fetchShares();
  }, []);

  const fetchShares = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/my-shares`, { 
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setShares(json.data);
      } else {
        console.error("Gagal mengambil data share:", json);
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Apakah kamu yakin ingin menghapus link share ini?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/shares/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setShares((prev) => prev.filter((share) => share.id !== id));
      } else {
        alert("Gagal menghapus data!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("Link berhasil disalin!");
  };

  const handleReset = () => {
    setSearch("");
    setStatusFilter("ALL Shares");
    fetchShares();
  };

  const filteredShares = shares.filter((share) => {
    // Mencari berdasarkan nama folder atau judul dokumen
    const folderName = share.folder?.name || "";
    const documentTitle = share.document?.title || "";
    const nameMatch = 
      folderName.toLowerCase().includes(search.toLowerCase()) || 
      documentTitle.toLowerCase().includes(search.toLowerCase());

    const isExpired = share.expires_at ? new Date(share.expires_at) < new Date() : false;
    const currentStatus = isExpired ? "Expired" : "Active";
    const statusMatch = statusFilter === "ALL Shares" || statusFilter === currentStatus;

    return nameMatch && statusMatch;
  });

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "auto", fontFamily: "sans-serif" }}>
      
      <div style={{ background: "#4a4a4a", color: "white", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h2 style={{ margin: "0 0 5px 0", display: "flex", alignItems: "center", gap: "10px" }}>
          <FaShareAlt /> My Shared Items
        </h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#ddd" }}>Manage all your shared folders and documents link in one place</p>
      </div>

      <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", display: "flex", gap: "15px", alignItems: "flex-end", marginBottom: "20px" }}>
        <div style={{ flex: 2 }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "5px" }}>Search Item</label>
          <input 
            type="text" 
            placeholder="Search by name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "5px" }}>Status</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            <option>ALL Shares</option>
            <option>Active</option>
            <option>Expired</option>
          </select>
        </div>
        
        <button 
            onClick={fetchShares}
            style={{ background: "black", color: "white", padding: "9px 20px", border: "none", borderRadius: "4px", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}
        >
          <FaFilter /> Filter
        </button>

        <button onClick={handleReset} style={{ background: "white", color: "black", padding: "9px 20px", border: "1px solid #ccc", borderRadius: "4px", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
          <FaSyncAlt /> Reset
        </button>
      </div>

      <div>
        {filteredShares.length > 0 ? (
          filteredShares.map((share) => {
            const isExpired = share.expires_at ? new Date(share.expires_at) < new Date() : false;
            const statusText = isExpired ? "Expired" : "Active";
            const accessType = share.login_required ? "Login Required" : "Public";
            // Ganti domain ini sesuai dengan URL frontend publik Anda
            const shareUrl = `http://localhost:5173/share/${share.token}`;
            
            return (
              <div key={share.id} style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", marginBottom: "15px", background: "white" }}>
                
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                  {share.folder_id ? (
                    <>
                      <FaFolder style={{ color: "#f39c12", fontSize: "22px" }} />
                      <h3 style={{ margin: 0 }}>{share.folder?.name || "Unknown Folder"}</h3>
                    </>
                  ) : (
                    <>
                      <FaFile style={{ color: "#007bff", fontSize: "22px" }} />
                      <h3 style={{ margin: 0 }}>{share.document?.title || "Unknown Document"}</h3>
                    </>
                  )}
                </div>

                <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                  <span style={{ background: isExpired ? "#fdecea" : "#e6f4ea", color: isExpired ? "#d93025" : "#1e8e3e", padding: "4px 10px", borderRadius: "15px", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ width: "6px", height: "6px", background: isExpired ? "#d93025" : "#1e8e3e", borderRadius: "50%", display: "inline-block" }}></span> {statusText}
                  </span>
                  <span style={{ background: share.login_required ? "#fef7e0" : "#e8f0fe", color: share.login_required ? "#b08d00" : "#1a73e8", padding: "4px 10px", borderRadius: "15px", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
                    <FaRegEye /> {accessType}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f0f7ff", border: "1px solid #b3d4ff", padding: "10px 15px", borderRadius: "6px", marginBottom: "15px" }}>
                  <a href={shareUrl} target="_blank" rel="noreferrer" style={{ color: "#007bff", textDecoration: "none", fontSize: "14px", wordBreak: "break-all" }}>
                    {shareUrl}
                  </a>
                  <button onClick={() => handleCopy(shareUrl)} style={{ background: "white", border: "1px solid #007bff", color: "#007bff", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "12px" }}>
                    <FaCopy /> Copy
                  </button>
                </div>

                <div style={{ display: "flex", gap: "25px", fontSize: "13px", fontWeight: "bold", marginBottom: "20px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "gray" }}>
                    {share.folder_id ? <FaFolder /> : <FaFile />} {share.folder_id ? "Folder" : "Document"}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "gray" }}><FaCalendarAlt /> Created {timeSince(share.created_at)}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "gray" }}><FaClock /> Updated {timeSince(share.updated_at)}</span>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <a href={shareUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none", background: "white", border: "1px solid #a250f5", color: "#a250f5", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", fontWeight: "bold" }}>
                    <FaExternalLinkAlt /> Open Link
                  </a>
                  <button onClick={() => handleDelete(share.id)} style={{ background: "white", border: "1px solid #dc3545", color: "#dc3545", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", fontWeight: "bold" }}>
                    <FaTrash /> Delete
                  </button>
                </div>

              </div>
            );
          })
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "gray", border: "1px solid #ccc", borderRadius: "8px" }}>
            Belum ada item yang di-share.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyShares;
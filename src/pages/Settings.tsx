import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { FaEdit, FaSpinner } from "react-icons/fa";

// Sesuaikan URL ini dengan api.php Anda
const API_URL = "http://127.0.0.1:8000/api/v1/settings";

interface Setting {
  id: number;
  name: string;
  value: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({ name: "", value: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Laravel mengirim res.data.data berdasarkan Controller Anda
      if (res.data && res.data.data) {
        setSettings(res.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      // Format payload sesuai Controller: { "nama_setting": "nilai_baru" }
      const payload = { [editData.name]: editData.value };
      
      await axios.post(API_URL, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsModalOpen(false);
      fetchSettings(); // Refresh data setelah simpan
    } catch (error) {
      alert("Gagal menyimpan.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSettings = settings.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      {/* Container utama dengan background putih agar menutupi sidebar jika MainLayout bermasalah */}
      <div style={{ padding: "30px", backgroundColor: "white", minHeight: "100vh" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "20px", fontWeight: "bold" }}>Settings</h2>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label>Search:</label>
            <input
              type="text"
              className="border p-1 px-2 rounded"
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: "1px solid #ccc", padding: "4px 8px" }}
            />
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #dee2e6" }}>
          <thead style={{ backgroundColor: "#f8f9fa" }}>
            <tr>
              <th style={tableHeadStyle}>Id</th>
              <th style={tableHeadStyle}>Name</th>
              <th style={tableHeadStyle}>Value</th>
              <th style={tableHeadStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>Loading...</td></tr>
            ) : filteredSettings.length > 0 ? (
              filteredSettings.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                  <td style={tableCellStyle}>{s.id}</td>
                  <td style={tableCellStyle}>{s.name}</td>
                  <td style={tableCellStyle}>{s.value || "-"}</td>
                  <td style={tableCellStyle}>
                    <button 
                      onClick={() => { setEditData({ name: s.name, value: s.value || "" }); setIsModalOpen(true); }}
                      style={{ border: "1px solid #ccc", padding: "4px 8px", cursor: "pointer", borderRadius: "4px" }}
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>Data Kosong. Pastikan Database terisi.</td></tr>
            )}
          </tbody>
        </table>

        {/* Modal Simpel */}
        {isModalOpen && (
          <div style={modalBackdropStyle}>
            <div style={modalStyle}>
              <h3 style={{ marginBottom: "15px" }}>Edit {editData.name}</h3>
              <form onSubmit={handleUpdate}>
                <textarea 
                  style={{ width: "100%", padding: "10px", marginBottom: "15px", border: "1px solid #ccc" }}
                  value={editData.value}
                  onChange={(e) => setEditData({...editData, value: e.target.value})}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button type="button" onClick={() => setIsModalOpen(false)}>Batal</button>
                  <button type="submit" style={{ backgroundColor: "black", color: "white", padding: "5px 15px" }}>
                    {submitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

const tableHeadStyle = { padding: "12px", border: "1px solid #dee2e6", textAlign: "left" as const };
const tableCellStyle = { padding: "12px", border: "1px solid #dee2e6" };
const modalBackdropStyle: React.CSSProperties = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" };
const modalStyle = { backgroundColor: "white", padding: "20px", borderRadius: "8px", width: "400px" };
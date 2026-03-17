import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "../components/Header";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip 
} from "recharts";

const API_URL = "http://127.0.0.1:8000/api/v1";

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // KUNCI UTAMA: Mengukur lebar container secara manual agar Recharts tidak error
  const pieContainerRef = useRef<HTMLDivElement>(null);
  const lineContainerRef = useRef<HTMLDivElement>(null);
  const [pieWidth, setPieWidth] = useState(0);
  const [lineWidth, setLineWidth] = useState(0);

  // Efek untuk mengambil data API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/dashboard/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data && res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Efek untuk mengukur lebar elemen saat window berubah ukuran atau data selesai load
  useEffect(() => {
    const updateDimensions = () => {
      if (pieContainerRef.current) {
        setPieWidth(pieContainerRef.current.offsetWidth);
      }
      if (lineContainerRef.current) {
        setLineWidth(lineContainerRef.current.offsetWidth);
      }
    };

    // Jalankan sekali saat mount dan saat data berubah
    updateDimensions();

    // Pantau jika layar di-resize agar grafik tetap responsif
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [data, loading]); 

  const container = { maxWidth: "1200px", margin: "0 auto" };
  const card = { 
    background: "#fff", 
    border: "1px solid #e5e7eb", 
    borderRadius: "8px", 
    padding: "20px",
  };
  
  const statCard = (borderColor: string) => ({
    ...card,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeft: `4px solid ${borderColor}`,
  });

  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Loading Dashboard...</div>;

  const stats = {
    totalDocs: data?.total_documents ?? 0,
    totalFiles: data?.total_folders ?? 0, 
    freeSpace: "11.78 TB",
    totalSpace: "17.45 TB",
    docStatus: [
      { name: "Verified", value: data?.verified_documents ?? 0, color: "#22c55e" },
      { name: "Pending", value: data?.pending_documents ?? 0, color: "#f59e0b" },
      { name: "Rejected", value: 0, color: "#ef4444" },
    ],
    activities: data?.activities ?? [],
    topDocs: data?.topDocs ?? [],
    uploadHistory: data?.uploadHistory ?? [],
    folders: data?.folders ?? []
  };

  return (
    <div style={{ background: "#f5f6f8", minHeight: "100vh", paddingBottom: "40px" }}>
      <Header />

      <div style={{ padding: "30px" }}>
        <div style={container}>
          {/* SEARCH */}
          <input
            placeholder="Search files by name or content..."
            style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid #d1d5db", marginBottom: "25px" }}
          />

          {/* SUMMARY */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" }}>
            <div style={statCard("#3b82f6")}>
              <div><small>Documents</small><h2>{stats.totalDocs}</h2><small>Total in system</small></div>
              <span style={{ fontSize: "30px" }}>📁</span>
            </div>
            <div style={statCard("#f59e0b")}>
              <div><small>Folders</small><h2>{stats.totalFiles}</h2><small>Total folders</small></div>
              <span style={{ fontSize: "30px" }}>📂</span>
            </div>
            <div style={statCard("#22c55e")}>
              <div><small>Free Space</small><h2>{stats.freeSpace}</h2><small>of {stats.totalSpace}</small></div>
              <span style={{ fontSize: "30px" }}>💾</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "20px", marginBottom: "30px" }}>
            {/* DOC STATUS - PIE CHART */}
            <div style={card} ref={pieContainerRef}>
              <strong style={{ display: "block", marginBottom: "15px" }}>Documents Status</strong>
              
              {/* Gambar grafik JIKA width sudah > 0 */}
              {data && pieWidth > 0 && (
                <div style={{ height: "200px" }}>
                  <ResponsiveContainer width={pieWidth} height="100%">
                    <PieChart>
                      <Pie data={stats.docStatus} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {stats.docStatus.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* PERBAIKAN: Menampilkan angka value dokumen */}
              <div style={{ display: "flex", justifyContent: "center", gap: "15px", fontSize: "13px", marginTop: "10px" }}>
                {stats.docStatus.map((s: any) => (
                  <span key={s.name} style={{ color: s.color }}>
                    ● <span style={{ color: "#4b5563" }}>{s.name}:</span> <strong style={{ color: "#111827" }}>{s.value}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* USER ACTIVITY LOG */}
            <div style={card}>
              <strong style={{ display: "block", marginBottom: "15px" }}>User Activity Log</strong>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {stats.activities?.map((act: any, i: number) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "13px" }}>
                    <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#eee", display: "flex", justifyContent: "center", alignItems: "center" }}>S</div>
                    <div>
                      <div style={{ fontWeight: "bold" }}>{act.user}</div>
                      <div style={{ color: "#666" }}>{act.action} <small>• {act.time}</small></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TOP POPULAR DOCS */}
            <div style={card}>
              <strong style={{ display: "block", marginBottom: "15px" }}>Popular Documents</strong>
              {stats.topDocs?.map((doc: string, i: number) => (
                <div key={i} style={{ marginBottom: "10px", padding: "8px", background: "#f9fafb", borderRadius: "4px", fontSize: "14px" }}>
                  {i + 1}. {doc}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
            {/* UPLOAD ACTIVITY - LINE CHART */}
            <div style={card} ref={lineContainerRef}>
              <strong style={{ display: "block", marginBottom: "15px" }}>Upload Activity</strong>
              
              {/* Gambar grafik JIKA width sudah > 0 */}
              {data && lineWidth > 0 && (
                <div style={{ height: "250px" }}>
                  <ResponsiveContainer width={lineWidth} height="100%">
                    <LineChart data={stats.uploadHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              
            </div>

            {/* FOLDERS LIST */}
            <div style={card}>
              <strong style={{ display: "block", marginBottom: "15px" }}>Folders</strong>
              {stats.folders?.map((f: any, i: number) => (
                <div key={i} style={{ border: "1px solid #eee", padding: "12px", borderRadius: "6px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "24px" }}>📁</span>
                  <div>
                    <div style={{ fontWeight: "bold" }}>{f.name}</div>
                    <small style={{ color: "#999" }}>{f.date}</small>
                  </div>
                </div>
              ))}
              <hr style={{ margin: "15px 0", border: "0.5px solid #eee" }} />
              <small style={{ color: "#666" }}>System has {stats.totalDocs} total documents.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
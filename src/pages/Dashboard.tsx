import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getDashboardStats } from "../services/dashboardService";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import "./dashboard.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [scale, setScale] = useState(1.2);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newScale = Math.max(1, 1.2 - scrollY / 700);
      setScale(newScale);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!stats) return <MainLayout>Loading...</MainLayout>;

  return (
    <MainLayout>
      <div className="dashboard-wrapper">

        {/* HERO */}
        <div className="hero">
          <div
            className="hero-overlay"
            style={{ transform: `scale(${scale})` }}
          >
            <h1>DOCUMENT MANAGEMENT SYSTEM</h1>
            <h2>PT. Dunia Maya Communica</h2>
          </div>
        </div>

        {/* SEARCH */}
        <div className="search-container">
          <input placeholder="Search files by name or content..." />
        </div>

        {/* STAT CARDS */}
        <div className="card-row">
          <div className="stat-card">
            <h4>Documents</h4>
            <h2>{stats.documents_count}</h2>
            <span>Total in system</span>
          </div>

          <div className="stat-card">
            <h4>Files</h4>
            <h2>{stats.files_count}</h2>
            <span>Total documents</span>
          </div>

          <div className="stat-card">
            <h4>Free</h4>
            <h2>{stats.free_space} TB</h2>
            <span>Of {stats.total_space} TB</span>
          </div>
        </div>

        {/* ANALYTICS */}
        <div className="analytics-grid">

          <div className="card large">
            <h4>Usage Analytics</h4>
            <Doughnut
              data={{
                labels: ["Verified", "Pending", "Rejected"],
                datasets: [
                  {
                    data: [
                      stats.usage.verified,
                      stats.usage.pending,
                      stats.usage.rejected,
                    ],
                    backgroundColor: ["#16a34a", "#f59e0b", "#dc2626"],
                  },
                ],
              }}
            />
          </div>

          <div className="card">
            <h4>User Activity Log</h4>
            {stats.activities.map((a: any, i: number) => (
              <p key={i}>{a.description}</p>
            ))}
          </div>

          <div className="card">
            <h4>Top Popular Documents</h4>
            {stats.top_documents.map((d: any, i: number) => (
              <p key={i}>
                {i + 1}. {d.name}
              </p>
            ))}
          </div>

        </div>

        {/* UPLOAD CHART */}
        <div className="upload-grid">
          <div className="card large">
            <h4>Upload Activity</h4>
            <Line
              data={{
                labels: [
                  "Jan","Feb","Mar","Apr","May","Jun",
                  "Jul","Aug","Sep","Oct","Nov","Dec"
                ],
                datasets: [
                  {
                    label: "Uploads",
                    data: stats.upload_stats,
                    borderColor: "#2563eb",
                    tension: 0.4,
                  },
                ],
              }}
            />
          </div>
        </div>

        <footer>© 2026 DAMACO. All rights reserved.</footer>

      </div>
    </MainLayout>
  );
}
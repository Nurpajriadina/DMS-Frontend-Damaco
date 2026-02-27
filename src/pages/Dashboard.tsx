import Header from "../components/Header";

const Dashboard = () => {
  const container = {
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const card = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "16px",
  };

  const statCard = (borderColor: string) => ({
    ...card,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeft: `4px solid ${borderColor}`,
  });

  return (
    <div style={{ background: "#f5f6f8", minHeight: "100vh" }}>
      <Header />

      <div style={{ padding: "30px" }}>
        <div style={container}>
          {/* SEARCH */}
          <input
            placeholder="Search files by name or content..."
            style={{
              width: "98%",
              padding: "14px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              marginBottom: "20px",
            }}
          />

          {/* SUMMARY */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              marginBottom: "25px",
            }}
          >
            <div style={statCard("#3b82f6")}>
              <div>
                <strong>Documents</strong>
                <h2>1</h2>
                <small>Total in system</small>
              </div>
              📁
            </div>

            <div style={statCard("#f59e0b")}>
              <div>
                <strong>Files</strong>
                <h2>1</h2>
                <small>In all documents</small>
              </div>
              📂
            </div>

            <div style={statCard("#22c55e")}>
              <div>
                <strong>Free</strong>
                <h2>11.78 TB</h2>
                <small>of 17.45 TB (67.5%)</small>
              </div>
              💾
            </div>
          </div>

          {/* USAGE ANALYTICS */}
          <h4 style={{ marginBottom: "10px" }}>Usage Analytics</h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: "20px",
              marginBottom: "25px",
            }}
          >
            {/* DONUT */}
            <div style={card}>
              <strong>Documents Status</strong>
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="18"
                  strokeDasharray="220 440"
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="18"
                  strokeDasharray="110 440"
                  strokeDashoffset="-220"
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="18"
                  strokeDasharray="60 440"
                  strokeDashoffset="-330"
                  transform="rotate(-90 100 100)"
                />
              </svg>

              <div style={{ display: "flex", gap: "15px" }}>
                <span style={{ color: "#22c55e" }}>● Verified</span>
                <span style={{ color: "#f59e0b" }}>● Pending</span>
                <span style={{ color: "#ef4444" }}>● Rejected</span>
              </div>
            </div>

            {/* ACTIVITY */}
            <div style={card}>
              <strong>User Activity Log</strong>
              <ul style={{ paddingLeft: "18px" }}>
                <li>Super Admin – Approved</li>
                <li>Super Admin – Uploaded</li>
                <li>Super Admin – Updated</li>
              </ul>
            </div>

            {/* TOP DOC */}
            <div style={card}>
              <strong>Top 5 Popular Documents</strong>
              <p>① test</p>
            </div>
          </div>

          {/* UPLOAD */}
          <h4 style={{ marginBottom: "10px" }}>Upload Statistics</h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "20px",
            }}
          >
            <div style={card}>
              <strong>Upload Activity</strong>
              <svg width="100%" height="200">
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  points="20,180 60,180 100,180 140,180 180,180 220,180 260,80"
                />
                {[20, 60, 100, 140, 180, 220, 260].map((x, i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={i === 6 ? 80 : 180}
                    r="4"
                    fill="#3b82f6"
                  />
                ))}
              </svg>
            </div>

            <div style={card}>
              <strong>Folders</strong>
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  padding: "10px",
                  borderRadius: "6px",
                  marginTop: "10px",
                }}
              >
                📁 <strong>Text</strong>
                <br />
                <small>08/02/2025</small>
              </div>

              <hr />

              <small>
                System has 1 total documents. Click on folders above to view them.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
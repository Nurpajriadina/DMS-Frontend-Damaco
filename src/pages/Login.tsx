import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      console.log(data);
      localStorage.setItem("token", data.data.access_token);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  // Objek style untuk input agar kode lebih bersih
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box", // Menjaga input tidak melebar keluar box
    display: "block"
  };

  return (
    <div
      style={{
        backgroundColor: "#e9e9e9",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Membuat konten di tengah secara vertikal
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        margin: 0,
        padding: 0
      }}
    >
      {/* CONTAINER UTAMA (FORM) */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#f5f5f5",
          padding: "40px",
          borderRadius: "12px",
          border: "1px solid #ccc",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          textAlign: "center",
          boxSizing: "border-box",
          zIndex: 1 // Memastikan form di atas background
        }}
      >
        <h2 style={{ margin: "0 0 10px 0", color: "#333" }}>Welcome back!</h2>

        <p style={{ fontSize: "14px", color: "#777", margin: "0 0 25px 0", lineHeight: "1.5" }}>
          Hey! Enter your details to get sign in
          <br />
          to your account.
        </p>

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ ...inputStyle, marginBottom: "10px" }}
          />

          {/* ERROR MESSAGE */}
          {error && (
            <div
              style={{
                color: "#d93025",
                fontSize: "13px",
                marginBottom: "15px",
                fontWeight: "bold"
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "15px",
              fontWeight: "bold",
              transition: "0.3s",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>

      {/* FOOTER - Tetap di bawah */}
      <div
        style={{
          backgroundColor: "black",
          color: "white",
          width: "100%",
          textAlign: "center",
          padding: "15px 0",
          position: "fixed",
          bottom: 0,
          fontSize: "14px",
          letterSpacing: "1px"
        }}
      >
        © 2026 <strong>DAMACO</strong>. All rights reserved.
      </div>
    </div>
  );
};

export default Login;
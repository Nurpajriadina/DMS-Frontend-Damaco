import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const data = await loginUser(email, password);
            localStorage.setItem("token", data.token);
            navigate("/dashboard");
        } catch (error) {
            alert("Login gagal!");
        }
    };

    return (
        <div
            style={{
                backgroundColor: "#e9e9e9",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    width: "420px",
                    backgroundColor: "#f5f5f5",
                    padding: "40px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    textAlign: "center",
                }}
            >
                <h2 style={{ margin: 0 }}>Welcome back!</h2>

                <p style={{ fontSize: "14px", color: "#777", margin: "15px 0 25px" }}>
                    Hey! Enter your details to get sign in
                    <br />
                    to your account.
                </p>

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "15px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                        }}
                    />

                    <div
                        style={{
                            textAlign: "right",
                            fontSize: "12px",
                            marginBottom: "15px",
                            cursor: "pointer",
                        }}
                    >
                        Forgot Password?
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "black",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "15px",
                        }}
                    >
                        Login
                    </button>
                </form>
            </div>

            <div
                style={{
                    marginTop: "30px",
                    backgroundColor: "black",
                    color: "white",
                    width: "100%",
                    textAlign: "center",
                    padding: "15px 0",
                    position: "fixed",
                    bottom: 0,
                }}
            >
                © 2026 DAMACO. All rights reserved.
            </div>
        </div>
    );
};

export default Login;
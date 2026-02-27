import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaTimes } from "react-icons/fa";

const API_URL = "http://127.0.0.1:8000/api/v1";

const CreateTag: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [color, setColor] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          color,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("SERVER:", text);
        throw new Error("Failed to save");
      }

      navigate("/tags");
    } catch (err) {
      console.error(err);
      alert("Failed to save tag");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1100px", margin: "auto" }}>
      <h2>Form Tags</h2>
      <p style={{ color: "gray" }}>
        Fill in the details below to create a new tag.
      </p>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "40px",
          marginTop: "20px",
          borderRadius: "6px",
          background: "#fff",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "25px" }}>
            <label><b>Name:</b></label>
            <br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "40px" }}>
            <label><b>Color:</b></label>
            <br />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="submit"
              style={{
                background: "black",
                color: "white",
                border: "none",
                padding: "8px 15px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              <FaSave /> Save
            </button>

            <button
              type="button"
              onClick={() => navigate("/tags")}
              style={{
                background: "white",
                color: "red",
                border: "1px solid red",
                padding: "8px 15px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTag;
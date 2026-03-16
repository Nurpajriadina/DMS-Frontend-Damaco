import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave, FaTimes } from "react-icons/fa";

const API_URL = "http://127.0.0.1:8000/api/v1";

const EditTag: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [loading, setLoading] = useState(true);

  // ✅ FETCH DATA SEBELUM EDIT
  useEffect(() => {
    const fetchTagDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/tags/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();

        if (res.ok) {
          setName(json.data.name);
          setColor(json.data.color);
        } else {
          console.error("Failed to fetch tag detail");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTagDetail();
  }, [id]);

  // ✅ FUNGSI UPDATE (SUBMIT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/tags/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, color }),
      });

      if (res.ok) {
        alert("Tag Updated!");
        navigate("/tags");
      } else {
        alert("Failed to update tag");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating tag");
    }
  };

  if (loading) return <div style={{ padding: "30px" }}>Loading...</div>;

  return (
    <>
      <div style={{ padding: "30px", maxWidth: "1100px", margin: "auto" }}>
        <h2>Form Tags</h2>
        <p style={{ color: "gray" }}>
          Fill in the details below to edit this tag.
        </p>

        <div style={{ border: "1px solid #ccc", padding: "40px", marginTop: "20px" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "25px" }}>
              <label><b>Name:</b></label>
              <br />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", padding: "8px" }}
                required
              />
            </div>

            <div style={{ marginBottom: "40px" }}>
              <label><b>Color:</b></label>
              <br />
              <input
                type="color" // Diubah ke type color agar lebih mudah memilih warna
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ width: "100%", height: "40px", padding: "2px", cursor: "pointer" }}
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "10px" }}
                placeholder="#000000"
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
    </>
  );
};

export default EditTag;
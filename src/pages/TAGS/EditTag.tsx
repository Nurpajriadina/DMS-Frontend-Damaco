import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave, FaTimes } from "react-icons/fa";

const EditTag: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("Tag " + id);
  const [color, setColor] = useState("#000000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Tag Updated!");
    navigate("/tags");
  };

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
              />
            </div>

            <div style={{ marginBottom: "40px" }}>
              <label><b>Color:</b></label>
              <br />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
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
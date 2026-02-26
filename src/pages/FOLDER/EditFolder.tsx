import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/Navbar";

const EditFolder: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("Folder " + id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Folder Updated!");
    navigate("/");
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "30px" }}>
        <h2>Edit Folder</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Folder Name</label>
            <br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ padding: "6px", width: "300px" }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "6px 15px",
              background: "black",
              color: "white",
              border: "none",
              marginRight: "10px",
            }}
          >
            Update
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              padding: "6px 15px",
              background: "gray",
              color: "white",
              border: "none",
            }}
          >
            Batal
          </button>
        </form>
      </div>
    </>
  );
};

export default EditFolder;
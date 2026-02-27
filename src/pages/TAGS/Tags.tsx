import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";

interface TagType {
  id: number;
  name: string;
  color: string;
  created_by: number;
}

const API_URL = "http://127.0.0.1:8000/api/v1";

const Tags: React.FC = () => {
  const navigate = useNavigate();

  const [tags, setTags] = useState<TagType[]>([]);
  const [search, setSearch] = useState("");
  const [viewTag, setViewTag] = useState<TagType | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/tags`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      setTags(json.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTag = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tag?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/tags/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTags();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={{ padding: "30px", maxWidth: "1100px", margin: "auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h2 style={{ marginBottom: "5px" }}>Tags</h2>
            <p style={{ marginTop: 0, color: "gray" }}>
              This is a list of all file tags in the system.
            </p>
          </div>

          <button
            onClick={() => navigate("/tags/create")}
            style={{
              background: "black",
              color: "white",
              border: "none",
              padding: "8px 15px",
              height: "35px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <FaPlus /> Add New
          </button>
        </div>

        <div style={{ marginTop: "25px", marginBottom: "15px" }}>
          Search:{" "}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "6px", width: "250px" }}
          />
        </div>

        <table
          width="100%"
          border={1}
          cellPadding={10}
          style={{ borderCollapse: "collapse" }}
        >
          <thead style={{ background: "#f0f0f0" }}>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Color</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <tr key={tag.id}>
                  <td>{tag.id}</td>
                  <td>{tag.name}</td>
                  <td>
                    <span
                      style={{
                        background: tag.color,
                        color: "white",
                        padding: "4px 8px",
                        fontSize: "12px",
                      }}
                    >
                      {tag.color}
                    </span>
                  </td>
                  <td>{tag.created_by}</td>
                  <td style={{ display: "flex", gap: "8px" }}>
                    <FaEye
                      style={{ cursor: "pointer" }}
                      onClick={() => setViewTag(tag)}
                    />
                    <FaEdit
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/tags/edit/${tag.id}`)}
                    />
                    <FaTrash
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => deleteTag(tag.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} align="center">
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ color: "gray" }}>
            Showing 1 to {filteredTags.length} of {filteredTags.length} entries
          </div>

          <div style={{ display: "flex", gap: "5px" }}>
            <button
              style={{
                padding: "5px 10px",
                border: "1px solid #ccc",
                background: "#f8f8f8",
              }}
            >
              Previous
            </button>

            <button
              style={{
                padding: "5px 10px",
                border: "1px solid black",
                background: "black",
                color: "white",
              }}
            >
              1
            </button>

            <button
              style={{
                padding: "5px 10px",
                border: "1px solid #ccc",
                background: "#f8f8f8",
              }}
            >
              Next
            </button>
          </div>
        </div>

        {viewTag && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "20px",
                width: "350px",
                borderRadius: "8px",
              }}
            >
              <h3>Tag Detail</h3>
              <p><b>ID:</b> {viewTag.id}</p>
              <p><b>Name:</b> {viewTag.name}</p>
              <p><b>Color:</b> {viewTag.color}</p>

              <button
                onClick={() => setViewTag(null)}
                style={{
                  marginTop: "10px",
                  padding: "6px 12px",
                  background: "black",
                  color: "white",
                  border: "none",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tags;
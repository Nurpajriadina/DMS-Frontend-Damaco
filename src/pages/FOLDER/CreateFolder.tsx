import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSave,
  FaCloudUploadAlt,
  FaTimes,
  FaFolder,
  FaTag,
  FaBold,
  FaItalic,
  FaUnderline,
  FaQuoteLeft,
  FaListUl,
  FaListOl,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaLink,
  FaImage,
} from "react-icons/fa";

interface TagType {
  id: number;
  name: string;
}

const API_URL = "http://127.0.0.1:8000/api/v1";

const CreateFolder: React.FC = () => {
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);

  const [folderName, setFolderName] = useState("");
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [availableTags, setAvailableTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(false);

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

      console.log("Tags:", json);

      if (json.data) {
        setAvailableTags(json.data);
      }
    } catch (err) {
      console.error("Fetch Tags Error:", err);
    }
  };

  const handleSelectTag = (tag: TagType) => {
    setSelectedTag(tag);
    setShowDropdown(false);
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const createFolder = async () => {
    if (!folderName) {
      alert("Folder name wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/folders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: folderName,
          tag_id: selectedTag?.id ?? null,
        }),
      });

      const data = await res.json();

      console.log("Create Folder Response:", data);

      if (!res.ok) {
        alert("Gagal membuat folder");
        return null;
      }

      return data;
    } catch (err) {
      console.error("Create Folder Error:", err);
      alert("Terjadi error saat membuat folder");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const result = await createFolder();

    if (result) {
      navigate("/folder");
    }
  };

  const handleSaveUpload = async () => {
    const result = await createFolder();

    if (result) {
      navigate("/folder");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1100px", margin: "auto" }}>
      <h2>Create Folder</h2>

      <p style={{ fontSize: "14px", color: "gray" }}>
        Fill in the details below to create a new folder.
      </p>

      {/* Folder Name */}
      <div style={{ marginTop: "20px" }}>
        <label style={{ fontWeight: 600 }}>
          <FaFolder /> Folder Name
        </label>

        <input
          type="text"
          placeholder="Enter folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
          }}
        />
      </div>

      {/* TAG */}
      <div style={{ marginTop: "15px", position: "relative" }}>
        <label style={{ fontWeight: 600 }}>
          <FaTag /> Tags
        </label>

        <div
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            border: "1px solid #ccc",
            cursor: "pointer",
            background: "#fff",
          }}
        >
          {selectedTag ? selectedTag.name : "Select a tag"}
        </div>

        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "70px",
              width: "100%",
              border: "1px solid #ccc",
              background: "#fff",
              zIndex: 10,
            }}
          >
            {availableTags.map((tag) => (
              <div
                key={tag.id}
                onClick={() => handleSelectTag(tag)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  background:
                    selectedTag?.id === tag.id ? "#f0f0f0" : "white",
                }}
              >
                {tag.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DESCRIPTION */}
      <div style={{ marginTop: "20px" }}>
        <label style={{ fontWeight: 600 }}>Description:</label>

        <div
          style={{
            display: "flex",
            gap: "10px",
            margin: "10px 0",
            flexWrap: "wrap",
          }}
        >
          <button type="button" onClick={() => formatText("bold")}><FaBold /></button>
          <button type="button" onClick={() => formatText("italic")}><FaItalic /></button>
          <button type="button" onClick={() => formatText("underline")}><FaUnderline /></button>
          <button type="button" onClick={() => formatText("formatBlock", "blockquote")}><FaQuoteLeft /></button>
          <button type="button" onClick={() => formatText("insertUnorderedList")}><FaListUl /></button>
          <button type="button" onClick={() => formatText("insertOrderedList")}><FaListOl /></button>
          <button type="button" onClick={() => formatText("justifyLeft")}><FaAlignLeft /></button>
          <button type="button" onClick={() => formatText("justifyCenter")}><FaAlignCenter /></button>
          <button type="button" onClick={() => formatText("justifyRight")}><FaAlignRight /></button>

          <button
            type="button"
            onClick={() => {
              const url = prompt("Enter URL");
              if (url) formatText("createLink", url);
            }}
          >
            <FaLink />
          </button>

          <button
            type="button"
            onClick={() => {
              const url = prompt("Enter image URL");
              if (url) formatText("insertImage", url);
            }}
          >
            <FaImage />
          </button>
        </div>

        <div
          ref={editorRef}
          contentEditable
          style={{
            minHeight: "150px",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        />
      </div>

      {/* BUTTON */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            background: "black",
            color: "white",
            padding: "8px 15px",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
          }}
        >
          <FaSave /> {loading ? "Saving..." : "Save"}
        </button>

        <button
          onClick={handleSaveUpload}
          disabled={loading}
          style={{
            background: "#28a745",
            color: "white",
            padding: "8px 15px",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
          }}
        >
          <FaCloudUploadAlt /> Save & Uploads
        </button>

        <button
          type="button"
          onClick={() => navigate("/folder")}
          style={{
            background: "white",
            color: "red",
            border: "1px solid red",
            padding: "8px 15px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
          }}
        >
          <FaTimes /> Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateFolder;
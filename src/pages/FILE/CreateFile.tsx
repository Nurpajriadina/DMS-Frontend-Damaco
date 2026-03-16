import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSave,
  FaCloudUploadAlt,
  FaTimes,
  FaFileUpload,
  FaTag,
  FaFolder,
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

interface FolderType {
  id: number;
  name: string;
}

const API_URL = "http://127.0.0.1:8000/api/v1";

const CreateFile: React.FC = () => {
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
  
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState<TagType[]>([]);
  const [availableFolders, setAvailableFolders] = useState<FolderType[]>([]);

  // ✅ FETCH TAGS & FOLDERS
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        // Fetch Tags
        const resTags = await fetch(`${API_URL}/tags`, { headers });
        const dataTags = await resTags.json();
        if (resTags.ok) setAvailableTags(dataTags.data || dataTags);

        // Fetch Folders
        const resFolders = await fetch(`${API_URL}/folders`, { headers });
        const dataFolders = await resFolders.json();
        if (resFolders.ok) setAvailableFolders(dataFolders.data || dataFolders);

      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    fetchData();
  }, []);

  const handleSelectTag = (tag: TagType) => {
    setSelectedTag(tag);
    setShowTagDropdown(false);
  };

  const handleSelectFolder = (folder: FolderType) => {
    setSelectedFolder(folder);
    setShowFolderDropdown(false);
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const createFile = async () => {
    if (!selectedFile) {
      alert("Please choose file first");
      return null;
    }

    if (!selectedTag) {
      alert("Please select a tag");
      return null;
    }

    if (!selectedFolder) {
      alert("Please select a folder");
      return null;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", selectedFile.name);
      formData.append("tag_id", selectedTag.id.toString());
      formData.append("folder_id", selectedFolder.id.toString()); // Relasi File -> Folder
      formData.append("description", editorRef.current?.innerHTML || "");

      const res = await fetch(`${API_URL}/documents`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json", // 🔥 INI KODE AJAIB YANG DITAMBAHKAN
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Pesan Error Asli dari Laravel:", data);
        alert("Upload failed: " + (data.message || JSON.stringify(data)));
        return null;
      }

      return data;
    } catch (err) {
      console.error("Error Fetch:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const result = await createFile();
    if (result) navigate("/file");
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1100px", margin: "auto" }}>
      <h2>Create File</h2>
      <p style={{ fontSize: "14px", color: "gray" }}>
        Fill in the details below to upload a new file.
      </p>

      {/* Upload File */}
      <div style={{ marginTop: "20px" }}>
        <label style={{ fontWeight: 600 }}>
          <FaFileUpload /> Upload File
        </label>
        <div style={{ display: "flex", marginTop: "5px", gap: "10px" }}>
          <input
            type="text"
            readOnly
            value={selectedFile ? selectedFile.name : ""}
            placeholder="No file chosen"
            style={{ flex: 1, padding: "8px", border: "1px solid #ccc" }}
          />
          <button
            type="button"
            onClick={handleChooseFile}
            style={{
              padding: "8px 15px",
              background: "black",
              color: "white",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FaFileUpload /> Choose File
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Tags */}
      <div style={{ marginTop: "20px", position: "relative" }}>
        <label style={{ fontWeight: 600 }}>
          <FaTag /> Tags
        </label>
        <div
          onClick={() => {
            setShowTagDropdown(!showTagDropdown);
            setShowFolderDropdown(false);
          }}
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
        {showTagDropdown && (
          <div style={{ position: "absolute", top: "70px", width: "100%", border: "1px solid #ccc", background: "#fff", zIndex: 10, maxHeight: "200px", overflowY: "auto" }}>
            {availableTags.length === 0 && <div style={{ padding: "8px" }}>No tags found</div>}
            {availableTags.map((tag) => (
              <div
                key={tag.id}
                onClick={() => handleSelectTag(tag)}
                style={{ padding: "8px", cursor: "pointer", background: selectedTag?.id === tag.id ? "#f0f0f0" : "white" }}
              >
                {tag.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Folders (Pilihan Folder di bawah Tags) */}
      <div style={{ marginTop: "20px", position: "relative" }}>
        <label style={{ fontWeight: 600 }}>
          <FaFolder /> Folder (Select Folder)
        </label>
        <div
          onClick={() => {
            setShowFolderDropdown(!showFolderDropdown);
            setShowTagDropdown(false);
          }}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            border: "1px solid #ccc",
            cursor: "pointer",
            background: "#fff",
          }}
        >
          {selectedFolder ? selectedFolder.name : "Select a folder"}
        </div>
        {showFolderDropdown && (
          <div style={{ position: "absolute", top: "70px", width: "100%", border: "1px solid #ccc", background: "#fff", zIndex: 10, maxHeight: "200px", overflowY: "auto" }}>
            {availableFolders.length === 0 && <div style={{ padding: "8px" }}>No folders found</div>}
            {availableFolders.map((folder) => (
              <div
                key={folder.id}
                onClick={() => handleSelectFolder(folder)}
                style={{ padding: "8px", cursor: "pointer", background: selectedFolder?.id === folder.id ? "#f0f0f0" : "white" }}
              >
                {folder.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <div style={{ marginTop: "20px" }}>
        <label style={{ fontWeight: 600 }}>Description:</label>
        <div style={{ display: "flex", gap: "10px", margin: "10px 0", flexWrap: "wrap" }}>
          <button type="button" onClick={() => formatText("bold")}><FaBold /></button>
          <button type="button" onClick={() => formatText("italic")}><FaItalic /></button>
          <button type="button" onClick={() => formatText("underline")}><FaUnderline /></button>
          <button type="button" onClick={() => formatText("formatBlock", "blockquote")}><FaQuoteLeft /></button>
          <button type="button" onClick={() => formatText("insertUnorderedList")}><FaListUl /></button>
          <button type="button" onClick={() => formatText("insertOrderedList")}><FaListOl /></button>
          <button type="button" onClick={() => formatText("justifyLeft")}><FaAlignLeft /></button>
          <button type="button" onClick={() => formatText("justifyCenter")}><FaAlignCenter /></button>
          <button type="button" onClick={() => formatText("justifyRight")}><FaAlignRight /></button>
          <button type="button" onClick={() => {
            const url = prompt("Enter URL");
            if (url) formatText("createLink", url);
          }}><FaLink /></button>
          <button type="button" onClick={() => {
            const url = prompt("Enter image URL");
            if (url) formatText("insertImage", url);
          }}><FaImage /></button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          style={{ minHeight: "150px", border: "1px solid #ccc", padding: "10px", background: "white" }}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ background: "black", color: "white", padding: "8px 15px", border: "none", display: "flex", alignItems: "center", gap: "5px", cursor: loading ? "not-allowed" : "pointer" }}
        >
          <FaSave /> {loading ? "Saving..." : "Save"}
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ background: "#28a745", color: "white", padding: "8px 15px", border: "none", display: "flex", alignItems: "center", gap: "5px", cursor: loading ? "not-allowed" : "pointer" }}
        >
          <FaCloudUploadAlt /> {loading ? "Uploading..." : "Save & Upload"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/file")}
          style={{ background: "white", color: "red", border: "1px solid red", padding: "8px 15px", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}
        >
          <FaTimes /> Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateFile;
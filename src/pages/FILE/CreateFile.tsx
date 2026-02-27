import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSave,
  FaCloudUploadAlt,
  FaTimes,
  FaFileUpload,
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

const CreateFile: React.FC = () => {
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const availableTags: TagType[] = [
    { id: 1, name: "Important" },
    { id: 2, name: "Finance" },
    { id: 3, name: "HR" },
    { id: 4, name: "Legal" },
  ];

  const handleSelectTag = (tag: TagType) => {
    setSelectedTag(tag);
    setShowDropdown(false);
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

        <div
          style={{
            display: "flex",
            marginTop: "5px",
            gap: "10px",
          }}
        >
          <input
            type="text"
            readOnly
            value={selectedFile ? selectedFile.name : ""}
            placeholder="No file chosen"
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #ccc",
            }}
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

      {/* Description */}
      <div style={{ marginTop: "20px" }}>
        <label style={{ fontWeight: 600 }}>Description:</label>

        {/* Toolbar (tanpa box gabungan) */}
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

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button
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
          <FaSave /> Save
        </button>

        <button
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
          <FaCloudUploadAlt /> Save & Upload
        </button>

        <button
          type="button"
          onClick={() => navigate("/file")}
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

export default CreateFile;
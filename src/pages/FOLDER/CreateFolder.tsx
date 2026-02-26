import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
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

const CreateFolder: React.FC = () => {
    const navigate = useNavigate();

    const [folderName, setFolderName] = useState("");
    const [tags, setTags] = useState("");
    const [description, setDescription] = useState("");

    return (
        <>
            <Navbar />

            <div style={{ padding: "30px", maxWidth: "1100px", margin: "auto" }}>
                <h2>Create Folder</h2>
                <p style={{ fontSize: "14px", color: "gray" }}>
                    Fill in the details below to create a new file type.
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
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                </div>

                {/* Tags */}
                <div style={{ marginTop: "15px" }}>
                    <label style={{ fontWeight: 600 }}>
                        <FaTag /> Tags
                    </label>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                </div>

                {/* Description */}
                <div style={{ marginTop: "15px" }}>
                    <label style={{ fontWeight: 600 }}>Description:</label>

                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                            margin: "10px 0",
                            border: "1px solid #ccc",
                            padding: "6px",
                        }}
                    >
                        <select>
                            <option>Normal text</option>
                        </select>
                        <button type="button"><FaBold /></button>
                        <button type="button"><FaItalic /></button>
                        <button type="button"><FaUnderline /></button>
                        <button type="button">Small</button>
                        <button type="button"><FaQuoteLeft /></button>
                        <button type="button"><FaListUl /></button>
                        <button type="button"><FaListOl /></button>
                        <button type="button"><FaAlignLeft /></button>
                        <button type="button"><FaAlignCenter /></button>
                        <button type="button"><FaAlignRight /></button>
                        <button type="button"><FaLink /></button>
                        <button type="button"><FaImage /></button>
                    </div>

                    <textarea
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ width: "100%", padding: "10px" }}
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
        </>
    );
};

export default CreateFolder;
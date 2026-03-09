import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaSave, 
  FaTimes, 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaQuoteRight, 
  FaListUl, 
  FaListOl, 
  FaAlignLeft, 
  FaAlignRight, 
  FaLink, 
  FaImage 
} from "react-icons/fa";

const CreateUser: React.FC = () => {
  const navigate = useNavigate();

  // State untuk form input utama
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    address: "",
    password: "",
    status: "",
    description: "",
  });

  // State untuk baris Tags Wise Permission
  const [tagPermissions, setTagPermissions] = useState([
    { id: 1, tag: "", read: false, create: false, update: false, delete: false, verify: false }
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Di sini nanti kita panggil API axios.post()
    console.log("Data Disimpan:", formData);
    alert("User berhasil ditambahkan!");
    navigate("/users");
  };

  const addNewTagRow = () => {
    setTagPermissions([
      ...tagPermissions,
      { id: Date.now(), tag: "", read: false, create: false, update: false, delete: false, verify: false }
    ]);
  };

  // Styles Component (Inline agar mudah dibaca)
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "5px", marginTop: "15px" };
  const inputStyle: React.CSSProperties = { width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" };
  const editorBtnStyle: React.CSSProperties = { padding: "5px 10px", background: "white", border: "1px solid #ccc", cursor: "pointer", display: "flex", alignItems: "center" };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "auto", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "25px" }}>Form User</h2>

      <form onSubmit={handleSave}>
        {/* GRID INPUTS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          <div>
            <label style={labelStyle}>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Username:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Address:</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Status:</label>
            <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
              <option value="">-</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* DESCRIPTION EDITOR */}
        <div>
          <label style={labelStyle}>Description (Additional Information):</label>
          {/* Dummy Toolbar */}
          <div style={{ display: "flex", gap: "5px", padding: "5px", border: "1px solid #ccc", borderBottom: "none", background: "#f8f9fa", borderRadius: "4px 4px 0 0", flexWrap: "wrap" }}>
            <button type="button" style={editorBtnStyle}>A Normal text ▼</button>
            <button type="button" style={editorBtnStyle}><FaBold /></button>
            <button type="button" style={editorBtnStyle}><FaItalic /></button>
            <button type="button" style={editorBtnStyle}><FaUnderline /></button>
            <button type="button" style={editorBtnStyle}>Small</button>
            <button type="button" style={editorBtnStyle}><FaQuoteRight /></button>
            <button type="button" style={editorBtnStyle}><FaListUl /></button>
            <button type="button" style={editorBtnStyle}><FaListOl /></button>
            <button type="button" style={editorBtnStyle}><FaAlignLeft /></button>
            <button type="button" style={editorBtnStyle}><FaAlignRight /></button>
            <button type="button" style={editorBtnStyle}><FaLink /></button>
            <button type="button" style={editorBtnStyle}><FaImage /></button>
          </div>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            style={{ ...inputStyle, height: "100px", resize: "vertical", borderRadius: "0 0 4px 4px" }} 
          />
        </div>

        {/* GLOBAL PERMISSIONS */}
        <fieldset style={{ border: "1px solid #ccc", padding: "20px", marginTop: "25px", borderRadius: "4px" }}>
          <legend style={{ color: "gray", fontSize: "14px", padding: "0 5px" }}>Global Permissions</legend>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", fontSize: "13px" }}>
            
            {/* User Col */}
            <div>
              <div style={{ fontWeight: "bold", marginBottom: "10px" }}>User</div>
              {["Create Users", "Read Users", "Update Users", "Delete Users", "Permission management Users"].map(item => (
                <label key={item} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <input type="checkbox" /> {item}
                </label>
              ))}
            </div>

            {/* Tags Col */}
            <div>
              <div style={{ fontWeight: "bold", marginBottom: "10px" }}>Tags</div>
              {["Create Tags", "Read Tags", "Update Tags", "Delete Tags"].map(item => (
                <label key={item} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <input type="checkbox" /> {item}
                </label>
              ))}
            </div>

            {/* Documents Col */}
            <div>
              <div style={{ fontWeight: "bold", marginBottom: "10px" }}>Documents</div>
              {["Create Documents", "Read Documents", "Update Documents", "Delete Documents", "Verify Documents"].map(item => (
                <label key={item} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <input type="checkbox" /> {item}
                </label>
              ))}
            </div>

          </div>
        </fieldset>

        {/* TAGS WISE PERMISSION */}
        <fieldset style={{ border: "1px solid #ccc", padding: "20px", marginTop: "25px", borderRadius: "4px" }}>
          <legend style={{ color: "gray", fontSize: "14px", padding: "0 5px" }}>Tags Wise Permission</legend>
          <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse", textAlign: "left", fontSize: "13px", marginBottom: "15px" }}>
            <thead style={{ borderBottom: "1px solid #ccc" }}>
              <tr>
                <th>Select Tag</th>
                <th style={{ textAlign: "center" }}>Read</th>
                <th style={{ textAlign: "center" }}>Create</th>
                <th style={{ textAlign: "center" }}>Update</th>
                <th style={{ textAlign: "center" }}>Delete</th>
                <th style={{ textAlign: "center" }}>Verify</th>
              </tr>
            </thead>
            <tbody>
              {tagPermissions.map((row) => (
                <tr key={row.id}>
                  <td>
                    <select style={{ padding: "5px", width: "100%" }}>
                      <option>-</option>
                      <option>PDF</option>
                      <option>Word</option>
                    </select>
                  </td>
                  <td align="center"><input type="checkbox" /></td>
                  <td align="center"><input type="checkbox" /></td>
                  <td align="center"><input type="checkbox" /></td>
                  <td align="center"><input type="checkbox" /></td>
                  <td align="center"><input type="checkbox" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button 
            type="button" 
            onClick={addNewTagRow} 
            style={{ background: "black", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
          >
            Add new tag
          </button>
        </fieldset>

        {/* FOOTER BUTTONS */}
        <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
          <button 
            type="submit" 
            style={{ background: "black", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold" }}
          >
            <FaSave /> Save
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate("/users")} 
            style={{ background: "#f87171", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold" }}
          >
            <FaTimes /> Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateUser;
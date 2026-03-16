import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

const API_URL = "http://127.0.0.1:8000/api/v1";

const CreateUser: React.FC = () => {
  const navigate = useNavigate();

  // State untuk menyimpan role user yang sedang login saat ini
  const [currentUserRole, setCurrentUserRole] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    address: "",
    password: "",
    status: "",
    role: "", 
    description: "",
  });

  const [globalPermissions, setGlobalPermissions] = useState<string[]>([]);
  const [tagPermissions, setTagPermissions] = useState([
    { id: Date.now(), tag_id: "", read: false, create: false, update: false, delete: false, verify: false }
  ]);
  const [availableTags, setAvailableTags] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1. Fetch data profil user yang sedang login dengan PENANGKAP SUPER AMAN
    const fetchCurrentUserProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userData = res.data?.data || res.data;
        let roleName = "";

        if (userData?.roles && userData.roles.length > 0) {
          const roleItem = userData.roles[0];
          // Mengecek apakah bentuknya string langsung atau object {name: 'super admin'}
          roleName = typeof roleItem === "string" ? roleItem : roleItem?.name || "";
        }
        
        // Simpan ke state dan pastikan semuanya huruf kecil
        setCurrentUserRole(roleName.toLowerCase());
        
      } catch (error) {
        console.error("Gagal mengambil profil user saat ini", error);
      }
    };

    // 2. Fetch data Tags
    const fetchTags = async () => {
      try {
        const res = await axios.get(`${API_URL}/tags`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAvailableTags(res.data?.data || []);
      } catch (error) {
        console.error("Gagal mengambil daftar tags", error);
      }
    };

    if (token) {
      fetchCurrentUserProfile();
      fetchTags();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGlobalPermToggle = (permValue: string) => {
    setGlobalPermissions((prev) => 
      prev.includes(permValue)
        ? prev.filter((p) => p !== permValue)
        : [...prev, permValue]
    );
  };

  const handleTagPermChange = (index: number, field: string, value: any) => {
    const updatedTags = [...tagPermissions];
    updatedTags[index] = { ...updatedTags[index], [field]: value };
    setTagPermissions(updatedTags);
  };

  const addNewTagRow = () => {
    setTagPermissions([
      ...tagPermissions,
      { id: Date.now(), tag_id: "", read: false, create: false, update: false, delete: false, verify: false }
    ]);
  };

  const removeTagRow = (idToRemove: number) => {
    if (tagPermissions.length > 1) {
      setTagPermissions(tagPermissions.filter(t => t.id !== idToRemove));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validTagPermissions = tagPermissions.filter((tp) => tp.tag_id !== "");

    const payload = {
      ...formData,
      permissions: globalPermissions,
      tag_permissions: validTagPermissions,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/users`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("User berhasil ditambahkan!");
      navigate("/users");
    } catch (error: any) {
      console.error("Error Detail:", error.response?.data);
      alert(error.response?.data?.message || "Gagal menambahkan user. Silakan periksa kelengkapan data.");
    }
  };

  const labelStyle: React.CSSProperties = { display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "5px", marginTop: "15px" };
  const inputStyle: React.CSSProperties = { width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" };
  const editorBtnStyle: React.CSSProperties = { padding: "5px 10px", background: "white", border: "1px solid #ccc", cursor: "pointer", display: "flex", alignItems: "center" };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "auto", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "25px" }}>Form User</h2>

      <form onSubmit={handleSave}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          <div><label style={labelStyle}>Name:</label><input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} /></div>
          <div><label style={labelStyle}>Email:</label><input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} /></div>
          <div><label style={labelStyle}>Username:</label><input type="text" name="username" value={formData.username} onChange={handleChange} required style={inputStyle} /></div>
          <div><label style={labelStyle}>Address:</label><input type="text" name="address" value={formData.address} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={labelStyle}>Password:</label><input type="password" name="password" value={formData.password} onChange={handleChange} required style={inputStyle} /></div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={labelStyle}>Status:</label>
              <select name="status" value={formData.status} onChange={handleChange} required style={inputStyle}>
                <option value="">- Select -</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Role:</label>
              <select name="role" value={formData.role} onChange={handleChange} required style={inputStyle}>
                <option value="">- Select Role -</option>
                
                {/* LOGIKA PENYEMBUNYIAN SUPER ADMIN BERFUNGSI DI SINI */}
                {currentUserRole === "super admin" && (
                  <option value="super admin">Super Admin</option>
                )}
                
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "10px" }}>
          <label style={labelStyle}>Description (Additional Information):</label>
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
          <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, height: "100px", resize: "vertical", borderRadius: "0 0 4px 4px" }} />
        </div>

        <fieldset style={{ border: "1px solid #ccc", padding: "20px", marginTop: "25px", borderRadius: "4px" }}>
          <legend style={{ color: "gray", fontSize: "14px", padding: "0 5px" }}>Global Permissions</legend>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", fontSize: "13px" }}>
            <div>
              <div style={{ fontWeight: "bold", marginBottom: "10px" }}>User</div>
              {[
                { label: "Create Users", value: "create users" },
                { label: "Read Users", value: "view users" },
                { label: "Update Users", value: "edit users" },
                { label: "Delete Users", value: "delete users" },
                { label: "Manage Users", value: "manage users" }
              ].map(item => (
                <label key={item.value} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <input type="checkbox" onChange={() => handleGlobalPermToggle(item.value)} /> {item.label}
                </label>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: "bold", marginBottom: "10px" }}>Tags</div>
              {[
                { label: "Create Tags", value: "create tags" },
                { label: "Read Tags", value: "view tags" },
                { label: "Update Tags", value: "edit tags" },
                { label: "Delete Tags", value: "delete tags" }
              ].map(item => (
                <label key={item.value} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <input type="checkbox" onChange={() => handleGlobalPermToggle(item.value)} /> {item.label}
                </label>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: "bold", marginBottom: "10px" }}>Documents</div>
              {[
                { label: "Create Documents", value: "create document" },
                { label: "Read Documents", value: "view document" },
                { label: "Update Documents", value: "edit document" },
                { label: "Delete Documents", value: "delete document" },
              ].map(item => (
                <label key={item.value} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <input type="checkbox" onChange={() => handleGlobalPermToggle(item.value)} /> {item.label}
                </label>
              ))}
            </div>
          </div>
        </fieldset>

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
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tagPermissions.map((row, index) => (
                <tr key={row.id}>
                  <td>
                    <select 
                      style={{ padding: "5px", width: "100%" }}
                      value={row.tag_id}
                      onChange={(e) => handleTagPermChange(index, "tag_id", e.target.value)}
                    >
                      <option value="">- Select Tag -</option>
                      {availableTags.map((tag) => (
                        <option key={tag.id} value={tag.id}>{tag.name}</option>
                      ))}
                    </select>
                  </td>
                  <td align="center"><input type="checkbox" checked={row.read} onChange={(e) => handleTagPermChange(index, "read", e.target.checked)} /></td>
                  <td align="center"><input type="checkbox" checked={row.create} onChange={(e) => handleTagPermChange(index, "create", e.target.checked)} /></td>
                  <td align="center"><input type="checkbox" checked={row.update} onChange={(e) => handleTagPermChange(index, "update", e.target.checked)} /></td>
                  <td align="center"><input type="checkbox" checked={row.delete} onChange={(e) => handleTagPermChange(index, "delete", e.target.checked)} /></td>
                  <td align="center"><input type="checkbox" checked={row.verify} onChange={(e) => handleTagPermChange(index, "verify", e.target.checked)} /></td>
                  <td align="center">
                    <button type="button" onClick={() => removeTagRow(row.id)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}><FaTimes /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addNewTagRow} style={{ background: "black", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>
            Add new tag
          </button>
        </fieldset>

        <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
          <button type="submit" style={{ background: "black", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold" }}>
            <FaSave /> Save
          </button>
          
          <button type="button" onClick={() => navigate("/users")} style={{ background: "#f87171", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold" }}>
            <FaTimes /> Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateUser;
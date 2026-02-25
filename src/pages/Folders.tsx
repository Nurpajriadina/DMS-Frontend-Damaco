import { useState } from "react";
import Navbar from "../components/Navbar";

const Folder: React.FC = () => {
  const [folders, setFolders] = useState<string[]>(["Finance", "HR"]);
  const [name, setName] = useState("");

  const addFolder = () => {
    if (!name) return;
    setFolders([...folders, name]);
    setName("");
  };

  const deleteFolder = (index: number) => {
    setFolders(folders.filter((_, i) => i !== index));
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "30px", maxWidth: "1100px", margin: "auto" }}>
        <h2>Folder</h2>

        <div style={{ marginBottom: "20px" }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Folder name"
          />
          <button onClick={addFolder}>Add Folder</button>
        </div>

        <table width="100%" border={1} cellPadding={10}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {folders.map((folder, i) => (
              <tr key={i}>
                <td>{folder}</td>
                <td>
                  <button onClick={() => deleteFolder(i)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Folder;
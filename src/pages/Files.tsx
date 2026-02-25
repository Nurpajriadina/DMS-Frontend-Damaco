import { useState } from "react";
import Navbar from "../components/Navbar";

const FilePage: React.FC = () => {
  const [files, setFiles] = useState<string[]>(["report.pdf"]);

  const addFile = () => {
    setFiles([...files, `file-${files.length + 1}.pdf`]);
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "30px", maxWidth: "1100px", margin: "auto" }}>
        <h2>Files</h2>
        <button onClick={addFile}>Upload File</button>

        <ul>
          {files.map((file, i) => (
            <li key={i}>{file}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default FilePage;
import { useState } from "react";
import Navbar from "../components/Navbar";

const Tags: React.FC = () => {
  const [tags, setTags] = useState<string[]>(["Important"]);

  const addTag = () => {
    setTags([...tags, `Tag-${tags.length + 1}`]);
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "30px", maxWidth: "1100px", margin: "auto" }}>
        <h2>Tags</h2>
        <button onClick={addTag}>Add Tag</button>

        <ul>
          {tags.map((tag, i) => (
            <li key={i}>{tag}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Tags;
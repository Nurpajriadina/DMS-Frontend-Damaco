import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Folder from "./pages/FOLDER/Folders";
import CreateFolder from "./pages/FOLDER/CreateFolder";
import EditFolder from "./pages/FOLDER/EditFolder";
import FilePage from "./pages/Files";
import Tags from "./pages/TAGS/Tags";
import CreateTag from "./pages/TAGS/CreateTag";
import EditTag from "./pages/TAGS/EditTag";
import Users from "./pages/Users";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/folder" element={<Folder />} />
      <Route path="/create-folder" element={<CreateFolder />} />
      <Route path="/edit-folder/:id" element={<EditFolder />} />
      <Route path="/file" element={<FilePage />} />
      <Route path="/tags" element={<Tags />} />
      <Route path="/tags/create" element={<CreateTag />} />
      <Route path="/tags/edit/:id" element={<EditTag />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
}

export default App;
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Folder from "./pages/Folders";
import FilePage from "./pages/Files";
import Tags from "./pages/Tags";
import Users from "./pages/Users";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/folder" element={<Folder />} />
      <Route path="/file" element={<FilePage />} />
      <Route path="/tags" element={<Tags />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
}

export default App;
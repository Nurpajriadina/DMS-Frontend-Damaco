import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Folder from "./pages/FOLDER/Folders";
import CreateFolder from "./pages/FOLDER/CreateFolder";
import FilePage from "./pages/FILE/Files";
import CreateFile from "./pages/FILE/CreateFile";
import Tags from "./pages/TAGS/Tags";
import CreateTag from "./pages/TAGS/CreateTag";
import EditTag from "./pages/TAGS/EditTag";
import Users from "./pages/Users";

function App() {
  const location = useLocation();

  // Jangan tampilkan Navbar & Footer di halaman login
  const isLoginPage = location.pathname === "/login";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {!isLoginPage && <Navbar />}

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/folder" element={<Folder />} />
          <Route path="/create-folder" element={<CreateFolder />} />
          <Route path="/file" element={<FilePage />} />
          <Route path="/file/create" element={<CreateFile />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/tags/create" element={<CreateTag />} />
          <Route path="/tags/edit/:id" element={<EditTag />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>

      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Folder from "./pages/FOLDER/Folders";
import CreateFolder from "./pages/FOLDER/CreateFolder";
import FolderDetail from "./pages/FOLDER/FolderDetail"; // 🔥 IMPORT BARU
import File from "./pages/FILE/Files";
import CreateFile from "./pages/FILE/CreateFile";
import Tags from "./pages/TAGS/Tags";
import CreateTag from "./pages/TAGS/CreateTag";
import EditTag from "./pages/TAGS/EditTag";
import Users from "./pages/USER/Users";
import CreateUser from "./pages/USER/CreateUser";
import MyShares from "./pages/MyShares";
import { Navigate } from "react-router-dom";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!isLoginPage && <Navbar />}

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              localStorage.getItem("token")
                ? <Navigate to="/dashboard" replace />
                : <Navigate to="/login" replace />
            }
          />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* FOLDER ROUTES */}
          <Route path="/folder" element={<ProtectedRoute><Folder /></ProtectedRoute>} />
          <Route path="/create-folder" element={<ProtectedRoute><CreateFolder /></ProtectedRoute>} />
          <Route path="/folder/:id" element={<ProtectedRoute><FolderDetail /></ProtectedRoute>} /> {/* 🔥 ROUTE BARU DETAIL */}

          <Route path="/file" element={<ProtectedRoute><File /></ProtectedRoute>} />
          <Route path="/file/create" element={<ProtectedRoute><CreateFile /></ProtectedRoute>} />
          
          <Route path="/tags" element={<ProtectedRoute><Tags /></ProtectedRoute>} />
          <Route path="/tags/create" element={<ProtectedRoute><CreateTag /></ProtectedRoute>} />
          <Route path="/tags/edit/:id" element={<ProtectedRoute><EditTag /></ProtectedRoute>} />
          
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/users/create" element={<ProtectedRoute><CreateUser /></ProtectedRoute>} />
          
          <Route path="/myshares" element={<ProtectedRoute><MyShares /></ProtectedRoute>} />
        </Routes>
      </div>

      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;
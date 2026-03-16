import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Folder from "./pages/FOLDER/Folders";
import CreateFolder from "./pages/FOLDER/CreateFolder";
import FolderDetail from "./pages/FOLDER/FolderDetail";
import File from "./pages/FILE/Files";
import CreateFile from "./pages/FILE/CreateFile";
import Tags from "./pages/TAGS/Tags";
import CreateTag from "./pages/TAGS/CreateTag";
import EditTag from "./pages/TAGS/EditTag";
import Users from "./pages/USER/Users";
import CreateUser from "./pages/USER/CreateUser";
import MyShares from "./pages/MYSHARES/MyShares";
import ViewShare from "./pages/MYSHARES/ViewShare";

function App() {
  const location = useLocation();
  
  // Logika untuk menyembunyikan Navbar & Footer di halaman Login DAN halaman Share
  const isLoginPage = location.pathname === "/login";
  const isSharePage = location.pathname.startsWith("/share/"); 
  const hideLayout = isLoginPage || isSharePage;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Jika bukan halaman login dan bukan halaman share, tampilkan Navbar */}
      {!hideLayout && <Navbar />}

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

          {/* INTERNAL ROUTES (Butuh Login) */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* FOLDER ROUTES */}
          <Route path="/folder" element={<ProtectedRoute><Folder /></ProtectedRoute>} />
          <Route path="/create-folder" element={<ProtectedRoute><CreateFolder /></ProtectedRoute>} />
          <Route path="/folder/:id" element={<ProtectedRoute><FolderDetail /></ProtectedRoute>} /> 

          {/* FILE ROUTES */}
          <Route path="/file" element={<ProtectedRoute><File /></ProtectedRoute>} />
          <Route path="/file/create" element={<ProtectedRoute><CreateFile /></ProtectedRoute>} />
          
          {/* TAGS ROUTES */}
          <Route path="/tags" element={<ProtectedRoute><Tags /></ProtectedRoute>} />
          <Route path="/tags/create" element={<ProtectedRoute><CreateTag /></ProtectedRoute>} />
          <Route path="/tags/edit/:id" element={<ProtectedRoute><EditTag /></ProtectedRoute>} />
          
          {/* USERS ROUTES */}
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/users/create" element={<ProtectedRoute><CreateUser /></ProtectedRoute>} />
          
          {/* MY SHARES (Internal) */}
          <Route path="/myshares" element={<ProtectedRoute><MyShares /></ProtectedRoute>} />
          
          {/* 🔥 SHARE ROUTE (TANPA PROTECTED ROUTE KARENA MENGURUS LOGIN SENDIRI) 🔥 */}
          <Route path="/share/:token" element={<ViewShare />} />

        </Routes>
      </div>

      {/* Jika bukan halaman login dan bukan halaman share, tampilkan Footer */}
      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
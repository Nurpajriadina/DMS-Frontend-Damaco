import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Folder from "./pages/FOLDER/Folders";
import CreateFolder from "./pages/FOLDER/CreateFolder";
import File from"./pages/FILE/Files";
import CreateFile from "./pages/FILE/CreateFile";
import Tags from "./pages/TAGS/Tags";
import CreateTag from "./pages/TAGS/CreateTag";
import EditTag from "./pages/TAGS/EditTag";
import Users from "./pages/USER/Users";
import CreateUser from "./pages/USER/CreateUser"; // 🔥 IMPORT CREATE USER DITAMBAHKAN DI SINI
import MyShares from "./pages/MyShares";
import { Navigate } from "react-router-dom";

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

            {/* PUBLIC */}
            <Route path="/login" element={<Login />} />

            {/* ROOT CHECK */}
            <Route
              path="/"
              element={
                localStorage.getItem("token")
                  ? <Navigate to="/dashboard" replace />
                  : <Navigate to="/login" replace />
              }
            />

            {/* PROTECTED */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/folder"
              element={
                <ProtectedRoute>
                  <Folder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-folder"
              element={
                <ProtectedRoute>
                  <CreateFolder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/file"
              element={
                <ProtectedRoute>
                  <File />
                </ProtectedRoute>
              }
            />

            <Route
              path="/file/create"
              element={
                <ProtectedRoute>
                  <CreateFile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tags"
              element={
                <ProtectedRoute>
                  <Tags />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tags/create"
              element={
                <ProtectedRoute>
                  <CreateTag />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tags/edit/:id"
              element={
                <ProtectedRoute>
                  <EditTag />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />

            {/* 🔥 ROUTE BARU UNTUK HALAMAN CREATE USER */}
            <Route
              path="/users/create"
              element={
                <ProtectedRoute>
                  <CreateUser />
                </ProtectedRoute>
              }
            />

            <Route
              path="/myshares"
              element={
                <ProtectedRoute>
                  <MyShares />
                </ProtectedRoute>
              }
            />

          </Routes>
      </div>

      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;
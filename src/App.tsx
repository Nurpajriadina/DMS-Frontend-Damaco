import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Folders from "./pages/Folders";
import Files from "./pages/Files";
import Tags from "./pages/Tags";
import Users from "./pages/Users";
import MetadataFields from "./pages/MetadataFields";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import SecurityProfile from "./pages/SecurityProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/folders" element={<Folders />} />
        <Route path="/files" element={<Files />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/users" element={<Users />} />
        <Route path="/metadata-fields" element={<MetadataFields />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/security-profile" element={<SecurityProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
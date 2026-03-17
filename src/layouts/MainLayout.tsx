import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#f4f4f4" }}>
      {/* Kita hanya merender children di sini karena Navbar sudah ada di App.tsx */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
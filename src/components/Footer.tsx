import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        width: "100%",
        background: "#000",
        marginTop: "auto", // Menggunakan auto agar terdorong ke paling bawah
        marginRight: 0,
        marginLeft: 0,
        display: "block",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          color: "white",
          textAlign: "center",
          padding: "25px 0", // Sedikit lebih lebar agar terlihat elegan
        }}
      >
        © 2026 DAMACO. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
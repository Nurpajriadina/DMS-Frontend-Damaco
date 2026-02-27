import React from "react";

const Footer: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        background: "#000",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          color: "white",
          textAlign: "center",
          padding: "18px 0",
        }}
      >
        © 2026 DAMACO. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
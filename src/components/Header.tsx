const Header: React.FC = () => {
  return (
    <div
      style={{
        height: "380px",
        backgroundImage:
          "url('https://png.pngtree.com/background/20250102/original/pngtree-aerial-view-oil-palm-estate-in-evening-picture-image_15509865.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* OVERLAY STATIS */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "42px", margin: 0 }}>
          DOCUMENT MANAGEMENT SYSTEM
        </h1>
        <h2 style={{ fontWeight: 400 }}>
          PT. Dunia Maya Communica
        </h2>
      </div>
    </div>
  );
};

export default Header;
import React from "react";
import QRCode from "react-qr-code";

export default function QrCode({
  value = "https://yourwebsite.com",
  size = 120,
  bgColor = "#ffffff",
  fgColor = "#000000",
  logoSrc = "https://res.cloudinary.com/dzjflzbxz/image/upload/v1748345555/logo_s03jy9.png",
  logoSize = 30,
}) {
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <QRCode
        value={value}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level="H"
        style={{ width: "100%", height: "100%", borderRadius: 12 }}
      />
      <img
        src={logoSrc}
        alt="logo"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: logoSize,
          height: logoSize,
          transform: "translate(-50%, -50%)",
          borderRadius: 8,
          boxShadow: "0 0 5px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );
}

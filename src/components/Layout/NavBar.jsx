// src/components/Layout/NavBar.jsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiCloud, FiArrowRight } from "react-icons/fi";

function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinkStyle = {
    color: "#475569",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.2s ease",
    padding: "8px 12px",
    borderRadius: "999px",
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(1180px, calc(100% - 32px))",
        zIndex: 1000,
        padding: scrolled ? "12px 22px" : "16px 26px",
        background: scrolled
          ? "rgba(255, 255, 255, 0.88)"
          : "rgba(255, 255, 255, 0.72)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(148, 163, 184, 0.18)",
        borderRadius: "20px",
        boxShadow: scrolled
          ? "0 10px 30px rgba(15, 23, 42, 0.10)"
          : "0 6px 20px rgba(15, 23, 42, 0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.3s ease",
      }}
    >
      {/* Left: Logo */}
      <a
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 20px rgba(37,99,235,0.22)",
          }}
        >
          <FiCloud size={18} color="#fff" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "-0.03em",
              color: "#0f172a",
            }}
          >
            CloudStorage
          </span>
          <span
            style={{
              fontSize: 12,
              color: "#64748b",
              fontWeight: 500,
            }}
          >
            Secure file storage platform
          </span>
        </div>
      </a>

      {/* Center: Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <a
          href="/features"
          style={navLinkStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#0f172a";
            e.currentTarget.style.background = "rgba(37, 99, 235, 0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#475569";
            e.currentTarget.style.background = "transparent";
          }}
        >
          
          Explore Features
        </a>
        

    
      </nav>

      {/* Right: CTA */}
      <a
        href="/login"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 22px",
          fontSize: 14,
          fontWeight: 600,
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          color: "#fff",
          borderRadius: 999,
          textDecoration: "none",
          boxShadow: "0 8px 20px rgba(37,99,235,.20)",
          transition: "all 0.25s ease",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 12px 24px rgba(37,99,235,.28)";
          e.currentTarget.style.opacity = "0.96";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(37,99,235,.20)";
          e.currentTarget.style.opacity = "1";
        }}
      >
        Go to Login
        <FiArrowRight size={15} />
      </a>
    </motion.header>
  );
}

export default NavBar;
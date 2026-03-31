import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{
      background: "var(--blue)",
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "56px",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "32px", height: "32px",
          background: "white", borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="2" strokeLinecap="round">
            <path d="M8 6h8M8 12h8M8 18h4"/>
            <circle cx="19" cy="18" r="3"/>
            <path d="M21 20l-1.5-1.5"/>
          </svg>
        </div>
        <span style={{ fontSize: "16px", fontWeight: 600, color: "white" }}>
          BugFixer
          <span style={{
            background: "rgba(255,255,255,0.2)",
            color: "white", fontSize: "10px",
            padding: "2px 7px", borderRadius: "99px", marginLeft: "6px",
          }}>AI</span>
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981", display: "inline-block" }}></span>
          API Online
        </span>
        <a href="https://github.com" target="_blank" style={{
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: "6px", padding: "5px 12px",
          fontSize: "12px", color: "white",
        }}>GitHub</a>
      </div>
    </header>
  );
}
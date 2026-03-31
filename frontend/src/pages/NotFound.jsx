import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 0" }}>
      <p style={{ fontSize: "4rem", fontWeight: 800, color: "var(--accent)" }}>404</p>
      <p style={{ color: "var(--text-muted)", marginTop: "1rem" }}>Page not found.</p>
      <Link to="/" style={{ color: "var(--accent)", marginTop: "1rem", display: "inline-block" }}>
        ← Back to home
      </Link>
    </div>
  );
}
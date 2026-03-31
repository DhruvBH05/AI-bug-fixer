export default function CodeEditor({ value, onChange, placeholder = "Paste your buggy code here..." }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      spellCheck={false}
      style={{
        width: "100%",
        minHeight: "260px",
        background: "#0d0d16",
        color: "var(--text)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "1rem",
        fontSize: "0.875rem",
        lineHeight: 1.7,
        resize: "vertical",
        outline: "none",
        transition: "border-color var(--transition)",
      }}
      onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
    />
  );
}
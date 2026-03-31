export default function ResultPanel({ result, error, loading }) {
  if (loading) return (
    <div style={{ color: "var(--text-muted)", padding: "1.5rem 0", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
      ⟳ Analyzing your code...
    </div>
  );

  if (error) return (
    <div style={{ color: "var(--error)", background: "rgba(255,77,106,0.08)", border: "1px solid rgba(255,77,106,0.3)", borderRadius: "var(--radius)", padding: "1rem" }}>
      ✗ {error}
    </div>
  );

  if (!result) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <section>
        <h3 style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
          BUGS FOUND
        </h3>
        <ul style={{ paddingLeft: "1.2rem", color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.8 }}>
          {result.bugs_found?.map((bug, i) => <li key={i}>{bug}</li>)}
        </ul>
      </section>

      <section>
        <h3 style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
          FIXED CODE
        </h3>
        <pre style={{ background: "#0d0d16", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1rem", overflow: "auto", fontSize: "0.875rem", lineHeight: 1.7 }}>
          {result.fixed_code}
        </pre>
      </section>

      <section>
        <h3 style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
          EXPLANATION
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.8 }}>{result.explanation}</p>
      </section>
    </div>
  );
}
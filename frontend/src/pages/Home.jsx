import { useState } from "react";
import { bugFixerApi } from "../api/bugFixerApi";

const LANGUAGES = ["python", "javascript", "typescript", "java", "cpp", "go"];

const COLORS = {
  python: "#1A56DB", javascript: "#D97706",
  typescript: "#7C3AED", java: "#DC2626", cpp: "#059669", go: "#0891B2",
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} style={{
      position: "absolute", top: "8px", right: "8px",
      background: "white", border: "1px solid var(--border)",
      borderRadius: "6px", padding: "3px 10px",
      fontSize: "11px", color: copied ? "var(--success)" : "var(--text-muted)",
      display: "flex", alignItems: "center", gap: "4px",
      transition: "all var(--transition)",
    }}>
      {copied ? "✓ Copied!" : "Copy"}
    </button>
  );
}

function HistoryItem({ item, onClick }) {
  return (
    <button onClick={() => onClick(item)}
      style={{
        background: "var(--code-bg)", border: "1px solid var(--border)",
        borderRadius: "8px", padding: "6px 12px",
        fontSize: "12px", color: "var(--text)",
        display: "flex", alignItems: "center", gap: "6px",
        transition: "all var(--transition)",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--blue)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
    >
      <span style={{
        background: COLORS[item.language] || "var(--blue)",
        color: "white", borderRadius: "4px",
        padding: "1px 5px", fontSize: "10px",
      }}>{item.language.slice(0, 2)}</span>
      {item.code.slice(0, 25)}... → Fixed
    </button>
  );
}

export default function Home() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [history, setHistory] = useState([]);

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setApiError(null);
    setResult(null);
    try {
      const res = await bugFixerApi.fixBug({ code, language, error_message: errorMsg });
      setResult(res.data);
      setHistory(prev => [{ code, language, result: res.data }, ...prev.slice(0, 4)]);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = (item) => {
    setCode(item.code);
    setLanguage(item.language);
    setResult(item.result);
  };

  const noBugs = result && result.bugs_found?.length === 0;

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", display: "flex", flexDirection: "column" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #1A56DB 0%, #1E429F 100%)",
        padding: "28px 24px 48px", textAlign: "center",
      }}>
        <h1 style={{ fontSize: "24px", fontWeight: 600, color: "white", marginBottom: "8px" }}>
          Fix bugs instantly with AI
        </h1>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)" }}>
          Paste your broken code, select a language, and get an AI-powered fix in seconds
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "32px", marginTop: "20px" }}>
          {[["6", "Languages"], ["AI", "Powered"], ["Free", "To Use"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 600, color: "white" }}>{num}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main panels */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "16px", padding: "24px",
        maxWidth: "1100px", margin: "-24px auto 0", width: "100%",
      }}>

        {/* Input panel */}
        <div style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2">
                <path d="M16 18l2-2-2-2M8 6L6 8l2 2"/>
                <rect x="3" y="3" width="18" height="18" rx="2"/>
              </svg>
              Your Code
            </span>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {LANGUAGES.map(lang => (
                <button key={lang} onClick={() => setLanguage(lang)} style={{
                  padding: "3px 9px", borderRadius: "99px", fontSize: "11px",
                  border: `1px solid ${language === lang ? "var(--blue)" : "var(--border)"}`,
                  background: language === lang ? "var(--blue)" : "white",
                  color: language === lang ? "white" : "var(--text-muted)",
                  transition: "all var(--transition)",
                }}>{lang}</button>
              ))}
            </div>
          </div>

          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Paste your buggy code here..."
            spellCheck={false}
            style={{
              width: "100%", minHeight: "220px",
              background: "var(--code-bg)", color: "var(--text)",
              border: "none", padding: "14px 16px",
              fontSize: "13px", lineHeight: 1.7,
              resize: "vertical", outline: "none",
            }}
          />

          <input
            type="text"
            value={errorMsg}
            onChange={e => setErrorMsg(e.target.value)}
            placeholder="Optional: paste error message or stack trace..."
            style={{
              width: "100%", padding: "10px 16px",
              borderTop: "1px solid var(--border)",
              border: "none", borderTop: "1px solid var(--border)",
              background: "white", fontSize: "12px",
              color: "var(--text-muted)", outline: "none",
            }}
          />

          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleSubmit}
              disabled={loading || !code.trim()}
              style={{
                background: loading || !code.trim() ? "#93C5FD" : "var(--blue)",
                color: "white", border: "none",
                borderRadius: "8px", padding: "9px 22px",
                fontSize: "14px", fontWeight: 500,
                display: "flex", alignItems: "center", gap: "6px",
                transition: "background var(--transition)",
              }}
            >
              {loading ? (
                <>
                  <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                  Fix My Bug
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results panel */}
        <div style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
              AI Results
            </span>
            {result && (
              <span style={{
                fontSize: "12px", fontWeight: 500,
                color: noBugs ? "#059669" : "var(--success)",
              }}>
                {noBugs ? "✓ No bugs found" : `✓ ${result.bugs_found?.length} bug${result.bugs_found?.length !== 1 ? "s" : ""} fixed`}
              </span>
            )}
          </div>

          {/* API Error */}
          {apiError && (
            <div style={{
              margin: "16px", background: "var(--danger-bg)",
              border: "1px solid var(--danger-border)",
              borderRadius: "8px", padding: "12px",
              color: "var(--danger)", fontSize: "13px",
            }}>
              ✗ {apiError}
            </div>
          )}

          {/* Empty state */}
          {!result && !loading && !apiError && (
            <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-subtle)" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                style={{ margin: "0 auto 12px", display: "block", opacity: 0.4 }}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <p style={{ fontSize: "14px" }}>Paste your code and click Fix My Bug</p>
              <p style={{ fontSize: "12px", marginTop: "4px" }}>Results will appear here</p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "28px", animation: "spin 1s linear infinite", display: "inline-block", marginBottom: "12px" }}>⟳</div>
              <p style={{ fontSize: "14px" }}>AI is analyzing your code...</p>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <>
              {/* Bugs Found */}
              <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.07em", color: "var(--text-subtle)", marginBottom: "8px", textTransform: "uppercase" }}>
                  Bugs Found
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {noBugs ? (
                    <span style={{
                      background: "#ECFDF5", color: "#059669",
                      fontSize: "12px", padding: "3px 9px",
                      borderRadius: "6px", border: "1px solid #A7F3D0",
                    }}>
                      ✓ No bugs found — code looks correct!
                    </span>
                  ) : (
                    result.bugs_found?.map((bug, i) => (
                      <span key={i} style={{
                        background: "var(--danger-bg)", color: "var(--danger)",
                        fontSize: "12px", padding: "3px 9px", borderRadius: "6px",
                        border: "1px solid var(--danger-border)",
                      }}>{bug}</span>
                    ))
                  )}
                </div>
              </div>

              {/* Fixed Code */}
              <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.07em", color: "var(--text-subtle)", marginBottom: "8px", textTransform: "uppercase" }}>
                  {noBugs ? "Your Code" : "Fixed Code"}
                </div>
                <div style={{ position: "relative" }}>
                  <pre style={{
                    background: "var(--code-bg)", border: "1px solid var(--border)",
                    borderRadius: "8px", padding: "12px", paddingTop: "32px",
                    fontSize: "13px", lineHeight: 1.7,
                    overflow: "auto", whiteSpace: "pre-wrap",
                    color: "var(--text)",
                  }}>
                    {result.fixed_code}
                  </pre>
                  <CopyButton text={result.fixed_code} />
                </div>
              </div>

              {/* Explanation */}
              <div style={{ padding: "14px 16px" }}>
                <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.07em", color: "var(--text-subtle)", marginBottom: "8px", textTransform: "uppercase" }}>
                  Explanation
                </div>
                <p style={{ fontSize: "13px", lineHeight: 1.7, color: "var(--text-muted)" }}>
                  {result.explanation}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%", padding: "0 24px 24px" }}>
          <div style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", padding: "14px 16px" }}>
            <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-subtle)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "5px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Recent Fixes
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {history.map((item, i) => (
                <HistoryItem key={i} item={item} onClick={loadHistory} />
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
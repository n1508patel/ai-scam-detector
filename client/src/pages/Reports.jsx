import { useEffect, useState } from "react";
import api from "../api/api";

const CATEGORIES = {
  kyc: "KYC/Bank Fraud",
  lottery: "Lottery/Prize Scam",
  job: "Fake Job Offer",
  upi: "UPI Fraud",
  courier: "Courier/Customs Scam",
  otp: "OTP Fraud",
  other: "Other",
};

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("other");
  const [catOpen, setCatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function loadReports() {
    api.get("/reports").then(({ data }) => setReports(data.reports));
  }

  useEffect(() => {
    loadReports();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/reports", { text, category });
      setText("");
      loadReports();
    } catch (err) {
      setError(err.response?.data?.error || "Could not submit report");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Community Scam Reports</h1>
      <p className="muted">Seen a scam message? Share it here to warn others.</p>

      <form onSubmit={handleSubmit}>
        <div
          className="dropdown"
          tabIndex={0}
          onBlur={() => setTimeout(() => setCatOpen(false), 150)}
        >
          <button
            type="button"
            className="dropdown-btn"
            onClick={() => setCatOpen((o) => !o)}
          >
            {CATEGORIES[category]}
            <span className="caret">{catOpen ? "▴" : "▾"}</span>
          </button>

          {catOpen && (
            <ul className="dropdown-menu">
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <li
                  key={key}
                  className={category === key ? "active" : ""}
                  onMouseDown={() => {
                    setCategory(key);
                    setCatOpen(false);
                  }}
                >
                  {label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <textarea
          rows={4}
          maxLength={2000}
          placeholder="Paste the scam message you received..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button className="btn" disabled={loading || !text.trim()}>
          {loading ? "Submitting..." : "Report this scam"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <h2>Recent reports</h2>
      {reports.length === 0 && <p className="muted">No reports yet. Be the first!</p>}
      {reports.map((r) => (
        <div key={r._id} className="history-item scam">
          <span className="tag">{CATEGORIES[r.category]}</span>
          <p className="snippet">{r.text}</p>
          <span className="muted small">{new Date(r.createdAt).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
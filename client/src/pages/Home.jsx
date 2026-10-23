import { useState } from "react";
import api from "../api/api";
import ResultCard from "../components/ResultCard";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleScan() {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const { data } = await api.post("/scan", { text });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Could not reach the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Is this message a scam?</h1>
      <p className="muted">Paste an SMS, email, WhatsApp message or link below.</p>

      <textarea
        rows={6}
        maxLength={3000}
        placeholder="Paste the suspicious message here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button className="btn" onClick={handleScan} disabled={loading || !text.trim()}>
        {loading ? "Analyzing..." : "Check now"}
      </button>

      {error && <p className="error">{error}</p>}
      {result && <ResultCard result={result} />}
    </div>
  );
}
import { useEffect, useState } from "react";
import api from "../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/scan/stats").then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <div className="container">Loading...</div>;

  const { totalScans, byVerdict, topRedFlags } = stats;
  const pct = (n) => (totalScans ? Math.round((n / totalScans) * 100) : 0);

  return (
    <div className="container">
      <h1>Community Stats</h1>
      <p className="muted">Based on {totalScans} scans checked by all users.</p>

      <div className="stat-row">
        <div className="stat-box scam">
          <strong>{byVerdict.scam}</strong>
          <span>Scams ({pct(byVerdict.scam)}%)</span>
        </div>
        <div className="stat-box suspicious">
          <strong>{byVerdict.suspicious}</strong>
          <span>Suspicious ({pct(byVerdict.suspicious)}%)</span>
        </div>
        <div className="stat-box safe">
          <strong>{byVerdict.safe}</strong>
          <span>Safe ({pct(byVerdict.safe)}%)</span>
        </div>
      </div>

      <h2>Top red flags detected</h2>
      {topRedFlags.length === 0 && <p className="muted">No data yet.</p>}
      {topRedFlags.map((f) => (
        <div key={f.flag} className="flag-row">
          <span>{f.flag}</span>
          <strong>{f.count}</strong>
        </div>
      ))}
    </div>
  );
}
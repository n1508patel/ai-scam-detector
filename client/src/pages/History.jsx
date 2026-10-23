import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/scan/history")
      .then(({ data }) => setScans(data.scans))
      .catch((err) => {
        // Token expired or invalid: send the user back to login
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    await api.delete(`/scan/${id}`);
    setScans((prev) => prev.filter((s) => s._id !== id));
  }

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>Your scan history</h1>
      {scans.length === 0 && <p className="muted">No scans yet.</p>}

      {scans.map((scan) => (
        <div key={scan._id} className={`history-item ${scan.verdict}`}>
          <div className="result-header">
            <strong>{scan.verdict.toUpperCase()} ({scan.score})</strong>
            <button className="btn-small" onClick={() => handleDelete(scan._id)}>Delete</button>
          </div>
          <p className="snippet">{scan.input.slice(0, 150)}{scan.input.length > 150 ? "..." : ""}</p>
          <span className="muted small">{new Date(scan.createdAt).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
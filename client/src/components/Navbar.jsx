import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand"> Scam Detector</Link>
      <div className="nav-links">
        <Link to="/dashboard">Stats</Link>
        <Link to="/reports">Report Scam</Link>
        {user ? (
          <>
            <Link to="/history">History</Link>
            <span className="muted">Hi, {user.name}</span>
            <button className="btn-small" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
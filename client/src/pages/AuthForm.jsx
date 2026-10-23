import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthForm({ mode }) {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) await register(name, email, password);
      else await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Could not reach the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container narrow">
      <h1>{isRegister ? "Create account" : "Login"}</h1>

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        )}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />

        <button className="btn" disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <p className="muted">
        {isRegister ? (
          <>Already have an account? <Link to="/login">Login</Link></>
        ) : (
          <>New here? <Link to="/register">Create an account</Link></>
        )}
      </p>
    </div>
  );
}
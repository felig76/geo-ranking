import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import "./Auth.css";

function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(form);
      if (res?.success && res?.data) {
        setUser(res.data);
        navigate("/play");
      } else {
        setError(res?.message || "Login failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <h1 className="authTitle">Sign in</h1>
        {error && <div className="authError">{error}</div>}
        <form onSubmit={onSubmit} className="authForm">
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
              autoComplete="current-password"
            />
          </label>
          <button className="authButton" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="authAlt">Don't have an account? <Link to="/register">Sign up</Link></p>
        <p className="authBack"><Link to="/">Back</Link></p>
      </div>
    </div>
  );
}

export default LoginPage;

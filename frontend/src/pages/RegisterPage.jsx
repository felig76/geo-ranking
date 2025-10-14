import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import "./Auth.css";

function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await registerUser(form);
      if (res?.success && res?.data) {
        setUser(res.data);
        navigate("/play");
      } else {
        setError(res?.message || "Sign up failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <h1 className="authTitle">Create account</h1>
        {error && <div className="authError">{error}</div>}
        <form onSubmit={onSubmit} className="authForm">
          <label>
            Username
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={onChange}
              required
              autoComplete="username"
            />
          </label>
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
              autoComplete="new-password"
            />
          </label>
          <button className="authButton" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="authAlt">Already have an account? <Link to="/login">Sign in</Link></p>
        <p className="authBack"><Link to="/">Back</Link></p>
      </div>
    </div>
  );
}

export default RegisterPage;

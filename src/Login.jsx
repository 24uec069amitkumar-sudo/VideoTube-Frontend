import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { request, dataOf } from "./api";

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!identifier.trim() || !password) return setError("Enter your email or username and your password.");
    setLoading(true);
    try {
      const id = identifier.trim();
      const body = id.includes("@") ? { email: id, password } : { username: id, password };
      const d = dataOf(await request("/users/login", { method: "POST", body: JSON.stringify(body) }));
      if (d.accessToken) localStorage.setItem("accessToken", d.accessToken);
      if (d.user) localStorage.setItem("currentUser", JSON.stringify(d.user));
      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit} noValidate>
        <h1>Welcome back</h1>
        <p className="auth-sub">Log in to see your subscriptions, playlists and history.</p>
        {error && <p className="inline-error" role="alert">{error}</p>}
        <div className="form-field">
          <label htmlFor="identifier">Email or username</label>
          <input id="identifier" autoComplete="username" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <div className="pass-box">
            <input id="password" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            <button type="button" className="pass-eye" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </div>
        </div>
        <button className="primary-cta auth-submit" type="submit" disabled={loading}><LogIn size={17} />{loading ? "Logging in…" : "Log in"}</button>
        <p className="auth-foot">New to VideoTube? <Link to="/signup">Create an account</Link></p>
      </form>
    </div>
  );
}

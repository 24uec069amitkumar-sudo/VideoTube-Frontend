import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { request } from "./api";

export default function Signup() {
  const navigate = useNavigate();
  const [f, setF] = useState({ fullName: "", username: "", email: "", password: "" });
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (e) => setF({ ...f, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (f.fullName.trim().length < 2) return setError("Enter your full name.");
    if (!/^[a-z0-9_.]{3,}$/i.test(f.username.trim())) return setError("Username needs 3+ letters, numbers, dots or underscores.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return setError("Enter a valid email address.");
    if (f.password.length < 8) return setError("Password needs at least 8 characters.");
    if (!avatar) return setError("Choose a profile photo.");
    const data = new FormData();
    data.append("fullName", f.fullName.trim());
    data.append("username", f.username.trim().toLowerCase());
    data.append("email", f.email.trim());
    data.append("password", f.password);
    data.append("avatar", avatar);
    if (cover) data.append("coverImage", cover);
    setLoading(true);
    try {
      await request("/users/register", { method: "POST", body: data });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Unable to sign up.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit} noValidate>
        <h1>Create your account</h1>
        <p className="auth-sub">Join VideoTube to subscribe, save playlists and upload videos.</p>
        {error && <p className="inline-error" role="alert">{error}</p>}
        <div className="form-field"><label htmlFor="fullName">Full name</label><input id="fullName" name="fullName" autoComplete="name" value={f.fullName} onChange={set} placeholder="Maya Singh" /></div>
        <div className="form-field"><label htmlFor="username">Username</label><input id="username" name="username" autoComplete="username" value={f.username} onChange={set} placeholder="mayas_kitchen" /></div>
        <div className="form-field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" value={f.email} onChange={set} placeholder="you@example.com" /></div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <div className="pass-box">
            <input id="password" name="password" type={show ? "text" : "password"} autoComplete="new-password" value={f.password} onChange={set} placeholder="At least 8 characters" />
            <button type="button" className="pass-eye" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </div>
        </div>
        <div className="form-field"><label htmlFor="avatar">Profile photo {avatar && <small>· {avatar.name}</small>}</label><input id="avatar" type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] || null)} /></div>
        <div className="form-field"><label htmlFor="cover">Cover image (optional) {cover && <small>· {cover.name}</small>}</label><input id="cover" type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] || null)} /></div>
        <button className="primary-cta auth-submit" type="submit" disabled={loading}><UserPlus size={17} />{loading ? "Creating account…" : "Sign up"}</button>
        <p className="auth-foot">Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Play, Search, Plus, Bell, Menu, Home, Clock3, ThumbsUp, Bookmark, Radio, ListVideo, LogIn, LogOut, UserRound } from "lucide-react";
import { request, dataOf, userOf } from "./api";

const MAIN = [["Home", "/", Home], ["Subscriptions", "/subscriptions", Radio]];
const YOU = [["History", "/history", Clock3], ["Playlists", "/playlists", ListVideo], ["Watch later", "/watch-later", Bookmark], ["Liked videos", "/liked-videos", ThumbsUp]];

function Avatar({ user }) {
  return <span className="yt-avatar">{user?.avatar ? <img src={user.avatar} alt="" /> : (user?.fullName || user?.username || "U").slice(0, 1).toUpperCase()}</span>;
}

export default function Layout() {
  const loc = useLocation(), navigate = useNavigate();
  const [query, setQuery] = useState(new URLSearchParams(loc.search).get("search") || "");
  const [mini, setMini] = useState(false), [drawer, setDrawer] = useState(false), [menu, setMenu] = useState(false), [unread, setUnread] = useState(0);
  const logged = !!localStorage.getItem("accessToken"), user = userOf();
  const watching = loc.pathname.startsWith("/watch/");

  useEffect(() => { setDrawer(false); setMenu(false); }, [loc.pathname]);
  useEffect(() => {
    if (!logged) return;
    request("/notifications").then((r) => { const d = dataOf(r); const a = Array.isArray(d) ? d : d.notifications || []; setUnread(a.filter((n) => !n.isRead).length); }).catch(() => {});
  }, [logged, loc.pathname]);

  const toggle = () => (watching || window.innerWidth <= 1000 ? setDrawer(!drawer) : setMini(!mini));
  const search = (e) => { e.preventDefault(); navigate(query.trim() ? `/?search=${encodeURIComponent(query.trim())}` : "/"); };
  const logout = async () => { try { await request("/users/logout", { method: "POST" }); } catch { /* ignore */ } localStorage.removeItem("accessToken"); localStorage.removeItem("currentUser"); setMenu(false); navigate("/login"); };
  const link = ([label, to, Icon], i) => <NavLink key={label} to={to} end={to === "/"} className={({ isActive }) => `yt-link${isActive ? " on" : ""}`}><Icon size={22} /><span>{label}</span></NavLink>;

  return (
    <div className={`yt${mini ? " is-mini" : ""}${watching ? " is-watch" : ""}`}>
      <header className="yt-top">
        <div className="yt-left">
          <button className="yt-icon" onClick={toggle} aria-label="Toggle menu"><Menu size={22} /></button>
          <Link to="/" className="yt-logo"><i><Play size={13} fill="currentColor" /></i><span>VideoTube</span></Link>
        </div>
        <form className="yt-search" onSubmit={search} role="search">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" aria-label="Search videos" />
          <button type="submit" aria-label="Search"><Search size={20} /></button>
        </form>
        <div className="yt-right">
          <Link className="yt-pill hide-sm" to="/upload"><Plus size={20} /> Create</Link>
          {logged && <Link className="yt-icon" to="/notifications" aria-label="Notifications"><Bell size={22} />{unread > 0 && <b className="yt-badge">{unread > 9 ? "9+" : unread}</b>}</Link>}
          {logged ? <button className="yt-icon" onClick={() => setMenu(!menu)} aria-label="Account menu"><Avatar user={user} /></button>
            : <Link className="yt-signin" to="/login"><UserRound size={18} /> Sign in</Link>}
          {menu && <div className="yt-menu">
            <div className="yt-menu-head"><Avatar user={user} /><div><strong>{user?.fullName || user?.username || "Your account"}</strong><small>@{user?.username || "you"}</small></div></div>
            {user?.username && <Link to={`/channel/${user.username}`}><UserRound size={19} /> Your channel</Link>}
            <button onClick={logout}><LogOut size={19} /> Log out</button>
          </div>}
        </div>
      </header>
      {drawer && <div className="yt-scrim" onClick={() => setDrawer(false)} />}
      <aside className={`yt-side${drawer ? " drawer" : ""}`}>
        {MAIN.map(link)}
        <hr />
        <h4>You</h4>
        {YOU.map(link)}
        <hr />
        <NavLink to="/upload" className="yt-link"><Plus size={22} /><span>Upload video</span></NavLink>
        <p className="yt-foot">VideoTube · Watch your world</p>
      </aside>
      <main className="yt-main"><Outlet /></main>
      <nav className="yt-bottom">
        <NavLink to="/" end><Home size={22} /><span>Home</span></NavLink>
        <NavLink to="/subscriptions"><Radio size={22} /><span>Subscriptions</span></NavLink>
        <NavLink to="/upload"><Plus size={22} /><span>Create</span></NavLink>
        <NavLink to="/history"><Clock3 size={22} /><span>You</span></NavLink>
      </nav>
    </div>
  );
}

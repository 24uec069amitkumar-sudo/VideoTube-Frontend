import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, RefreshCw } from "lucide-react";
import { request, videoListOf } from "./api";
import { formatViews, ago, fmtDuration } from "./format";

const CHIPS = ["All", "Music", "Gaming", "Coding", "Cooking", "Travel", "Sports", "Learning", "News", "Live"];

function VideoCard({ video }) {
  const o = video.owner || video.uploader || {};
  const dur = fmtDuration(video.duration);
  return (
    <article className="video-card">
      <Link to={`/watch/${video._id}`} className="thumb-link">
        <img className="video-thumb" src={video.thumbnail || "https://placehold.co/640x360/272727/ffffff?text=VideoTube"} alt={video.title || "Video thumbnail"} loading="lazy" />
        {dur && <span className="duration-tag">{dur}</span>}
      </Link>
      <div className="video-card-body">
        <Link to={`/channel/${o.username || o._id || ""}`} className="creator-avatar">{o.avatar ? <img src={o.avatar} alt="" /> : (o.fullName || o.username || "V").slice(0, 1).toUpperCase()}</Link>
        <div className="video-copy">
          <Link to={`/watch/${video._id}`} className="video-title">{video.title || "Untitled video"}</Link>
          <Link to={`/channel/${o.username || o._id || ""}`} className="creator-name">{o.fullName || o.username || "VideoTube creator"}</Link>
          <div className="video-meta">{formatViews(video.views)} • {ago(video.createdAt)}</div>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "", sort = params.get("sortType") || "desc";
  const [videos, setVideos] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState("");

  const load = () => {
    setLoading(true); setError("");
    const q = new URLSearchParams(); if (search) q.set("search", search); q.set("sortBy", "createdAt"); q.set("sortType", sort);
    request(`/videos?${q}`).then((r) => setVideos(videoListOf(r))).catch((e) => setError(e.message || "Could not load videos")).finally(() => setLoading(false));
  };
  useEffect(load, [search, sort]); // eslint-disable-line react-hooks/exhaustive-deps
  const pick = (c) => { const p = {}; if (c !== "All") p.search = c; if (sort !== "desc") p.sortType = sort; setParams(p); };
  const active = search ? CHIPS.find((c) => c.toLowerCase() === search.toLowerCase()) : "All";

  return (
    <div className="home-page">
      <div className="yt-chips">
        {CHIPS.map((c) => <button key={c} className={`yt-chip${c === active ? " on" : ""}`} onClick={() => pick(c)}>{c}</button>)}
        <select className="yt-sort" value={sort} onChange={(e) => setParams({ ...(search ? { search } : {}), sortType: e.target.value })} aria-label="Sort videos">
          <option value="desc">Newest</option><option value="asc">Oldest</option>
        </select>
      </div>
      {search && !active && <h2 className="yt-results">Results for “{search}”</h2>}
      {loading && <div className="video-grid">{Array.from({ length: 12 }).map((_, i) => <div className="sk-card" key={i}><div className="sk-thumb" /><div className="sk-line" /><div className="sk-line short" /></div>)}</div>}
      {!loading && error && <div className="state-panel"><div className="state-icon"><RefreshCw size={24} /></div><h3>We couldn’t load the videos</h3><p>{error}</p><button className="primary-cta" onClick={load}>Try again</button><small>Check that your backend is running on port 8000.</small></div>}
      {!loading && !error && videos.length === 0 && <div className="state-panel"><div className="state-icon"><Search size={25} /></div><h3>{search ? "No videos found" : "No videos yet"}</h3><p>{search ? "Try a different keyword or category." : "Be the first to upload a video."}</p><Link className="primary-cta" to={search ? "/" : "/upload"}>{search ? "Show all videos" : "Upload a video"}</Link></div>}
      {!loading && !error && videos.length > 0 && <div className="video-grid">{videos.map((v) => <VideoCard key={v._id} video={v} />)}</div>}
    </div>
  );
}

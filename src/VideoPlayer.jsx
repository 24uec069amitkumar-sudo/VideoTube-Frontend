import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ThumbsUp, Share2, ArrowLeft } from "lucide-react";
import Comments from "./Comments";
import { request, dataOf, videoListOf, token } from "./api";
import { formatViews, ago, fmtDuration } from "./format";

export default function VideoPlayer() {
  const { id } = useParams(), navigate = useNavigate();
  const [video, setVideo] = useState(null), [related, setRelated] = useState([]), [error, setError] = useState("");
  const [liked, setLiked] = useState(false), [subscribed, setSubscribed] = useState(false), [busy, setBusy] = useState(false), [note, setNote] = useState(""), [more, setMore] = useState(false);

  useEffect(() => {
    let live = true; setVideo(null); setError(""); window.scrollTo(0, 0);
    request(`/videos/${id}`).then((r) => { if (live) setVideo(dataOf(r)?.video || dataOf(r)); })
      .catch(async () => { try { const l = videoListOf(await request("/videos")); if (live) setVideo(l.find((v) => v._id === id) || null); if (live && !l.find((v) => v._id === id)) setError("Video not found."); } catch (e) { if (live) setError(e.message); } });
    request("/videos").then((r) => { if (live) setRelated(videoListOf(r).filter((v) => v._id !== id).slice(0, 12)); }).catch(() => {});
    return () => { live = false; };
  }, [id]);

  const history = async () => { if (!token()) return; try { await request(`/users/history/${id}`, { method: "POST" }); } catch { /* ignore */ } };
  async function like() { if (!token()) return navigate("/login"); try { setBusy(true); await request(`/likes/videos/${id}`, { method: "POST" }); setLiked(!liked); setNote(liked ? "Like removed" : "Added to liked videos"); } catch (e) { setNote(e.message); } finally { setBusy(false); } }
  async function subscribe() { if (!token()) return navigate("/login"); const o = video?.owner || video?.uploader; if (!o?._id) return setNote("Creator details are not available."); try { setBusy(true); await request(`/subscriptions/toggle/${o._id}`, { method: "POST" }); setSubscribed(!subscribed); setNote(subscribed ? "Unsubscribed" : "Subscribed"); } catch (e) { setNote(e.message); } finally { setBusy(false); } }

  if (error && !video) return <div className="yt-watch"><div><Link className="back-link" to="/"><ArrowLeft size={16} /> Back to home</Link><p className="inline-error">{error}</p></div></div>;
  if (!video) return <div className="yt-watch"><div><div className="sk-thumb big" /><div className="sk-line" /><div className="sk-line short" /></div></div>;
  const o = video.owner || video.uploader || {};

  return (
    <div className="yt-watch">
      <div className="yt-watch-main">
        <video className="watch-video" src={video.videoFile || video.videoUrl} poster={video.thumbnail} controls autoPlay playsInline onPlay={history} />
        <h1 className="watch-title">{video.title || "Untitled video"}</h1>
        <div className="yt-actions">
          <Link to={`/channel/${o.username || o._id || ""}`} className="yt-owner">
            <span className="creator-avatar big">{o.avatar ? <img src={o.avatar} alt="" /> : (o.fullName || o.username || "V").slice(0, 1).toUpperCase()}</span>
            <span><strong>{o.fullName || o.username || "VideoTube creator"}</strong><small>{o.subscribersCount || 0} subscribers</small></span>
          </Link>
          <button className={`yt-sub${subscribed ? " on" : ""}`} onClick={subscribe} disabled={busy}>{subscribed ? "Subscribed" : "Subscribe"}</button>
          <span className="yt-spacer" />
          <button className={`yt-pill${liked ? " liked" : ""}`} onClick={like} disabled={busy}><ThumbsUp size={18} fill={liked ? "currentColor" : "none"} /> {liked ? "Liked" : "Like"}</button>
          <button className="yt-pill" onClick={() => { navigator.clipboard?.writeText(window.location.href); setNote("Link copied"); }}><Share2 size={18} /> Share</button>
        </div>
        {note && <p className="form-message">{note}</p>}
        <div className={`yt-desc${more ? " open" : ""}`} onClick={() => setMore(true)}>
          <strong>{formatViews(video.views)} • {ago(video.createdAt)}</strong>
          <p>{video.description || "No description has been added for this video yet."}</p>
          {!more && <span className="yt-more">...more</span>}
        </div>
        <Comments videoId={id} />
      </div>
      <aside className="yt-related">
        {related.map((v) => { const r = v.owner || v.uploader || {}; const d = fmtDuration(v.duration); return (
          <Link className="rel" to={`/watch/${v._id}`} key={v._id}>
            <div className="rel-thumb"><img src={v.thumbnail} alt="" loading="lazy" />{d && <span className="duration-tag">{d}</span>}</div>
            <div className="rel-info"><h4>{v.title}</h4><p>{r.fullName || r.username || "VideoTube creator"}</p><p>{formatViews(v.views)} • {ago(v.createdAt)}</p></div>
          </Link>); })}
      </aside>
    </div>
  );
}

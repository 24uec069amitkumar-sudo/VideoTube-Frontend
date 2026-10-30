import { useCallback, useEffect, useState } from "react";
import { Trash2, Send } from "lucide-react";
import { request, dataOf, userOf, token } from "./api";

const listOf = (r) => { const d = dataOf(r); return Array.isArray(d) ? d : d.comments || d.docs || []; };

export default function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const me = userOf();

  const load = useCallback(async () => {
    try { setError(""); setComments(listOf(await request(`/comments/${videoId}`))); }
    catch (e) { setError(e.message || "Could not load comments."); }
  }, [videoId]);
  useEffect(() => { if (videoId) load(); }, [videoId, load]);

  async function add(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setBusy(true); setError("");
    try { await request(`/comments/${videoId}`, { method: "POST", body: JSON.stringify({ content: content.trim() }) }); setContent(""); await load(); }
    catch (e2) { setError(e2.message || "Could not post comment."); }
    finally { setBusy(false); }
  }
  async function remove(id) {
    if (!window.confirm("Delete this comment?")) return;
    try { await request(`/comments/c/${id}`, { method: "DELETE" }); setComments((c) => c.filter((x) => x._id !== id)); }
    catch (e) { setError(e.message || "Could not delete comment."); }
  }

  return (
    <section className="comments">
      <h2>{comments.length} {comments.length === 1 ? "comment" : "comments"}</h2>
      {token() ? (
        <form className="comment-form" onSubmit={add}>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Add a comment…" rows={2} maxLength={2000} aria-label="Add a comment" />
          <button className="primary-cta" type="submit" disabled={busy || !content.trim()}><Send size={15} />{busy ? "Posting…" : "Comment"}</button>
        </form>
      ) : <p className="muted-line">Log in to join the conversation.</p>}
      {error && <p className="inline-error">{error}</p>}
      {!error && comments.length === 0 && <p className="muted-line">No comments yet. Be the first.</p>}
      {comments.map((c) => {
        const o = c.owner || {};
        const mine = me && o._id && me._id === o._id;
        return (
          <article className="comment" key={c._id}>
            <div className="creator-avatar">{(o.fullName || o.username || "U").slice(0, 1).toUpperCase()}</div>
            <div className="comment-body"><strong>{o.fullName || o.username || "User"}</strong><p>{c.content}</p></div>
            {mine && <button className="icon-btn" onClick={() => remove(c._id)} aria-label="Delete comment"><Trash2 size={16} /></button>}
          </article>
        );
      })}
    </section>
  );
}

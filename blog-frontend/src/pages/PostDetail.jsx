import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { Edit, Trash2, MessageSquare, Send, ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Safe Native Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadPostAndComments = async () => {
    try {
      const [postRes, commentRes] = await Promise.all([
        axiosClient.get(`/posts/${id}`),
        axiosClient.get(`/posts/${id}/comments`).catch(() => ({ data: [] })),
      ]);
      setPost(postRes.data);
      setComments(
        Array.isArray(commentRes.data) ? commentRes.data : commentRes.data?.content || []
      );
    } catch (err) {
      console.error('Error loading post:', err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostAndComments();
  }, [id]);

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post permanently?')) return;
    await axiosClient.delete(`/posts/${id}`);
    navigate('/');
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await axiosClient.post(`/posts/${id}/comments`, { text: newComment });
      setNewComment('');
      loadPostAndComments();
    } catch (err) {
      alert(err.response?.data?.message || 'Comment post nahi ho paya');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosClient.delete(`/posts/${id}/comments/${commentId}`);
      loadPostAndComments();
    } catch {
      await axiosClient.delete(`/comments/${commentId}`);
      loadPostAndComments();
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center text-amber-300/80 animate-pulse">
        Loading article...
      </div>
    );
  }

  if (!post) return null;

  const canModifyPost = user && (user.username === post.authorUsername || isAdmin);
  const readTime = Math.max(1, Math.ceil((post.content?.split(/\s+/).length || 100) / 200));

  return (
    <>
      {/* Glowing Top Reading Progress Bar (Amber-Coral) */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-900 z-50">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-3xl mx-auto px-4 pt-10 pb-20"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-amber-300 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </Link>

        {/* Article Reader Card */}
        <article className="bg-zinc-950/80 backdrop-blur-2xl border border-amber-500/20 rounded-3xl p-6 sm:p-10 mb-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between gap-4 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 to-rose-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold px-3.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {post.categoryName || 'General'}
            </span>

            {canModifyPost && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/edit/${post.id}`}
                  className="flex items-center gap-1 text-xs bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-400/30 text-zinc-200 px-3 py-1.5 rounded-xl transition"
                >
                  <Edit className="w-3.5 h-3.5 text-amber-400" /> Edit
                </Link>
                <button
                  onClick={handleDeletePost}
                  className="flex items-center gap-1 text-xs bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-[1.15] tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pb-6 mb-8 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-rose-600 flex items-center justify-center text-xs font-black text-zinc-950 uppercase">
                {post.authorUsername?.[0]}
              </div>
              <span className="font-semibold text-zinc-200">@{post.authorUsername}</span>
            </div>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })
                : ''}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <Clock className="w-3.5 h-3.5" /> {readTime} min read
            </span>
          </div>

          <div className="text-zinc-200 leading-8 whitespace-pre-line text-base sm:text-[17px]">
            {post.content}
          </div>
        </article>

        {/* Comments Panel */}
        <section className="bg-zinc-950/80 backdrop-blur-2xl border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            Discussion ({comments.length})
          </h3>

          {user ? (
           <form
  onSubmit={handleCommentSubmit} // <-- Apne existing submit handler ka naam rakhna
  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full"
>
  <input
    type="text"
    required
    value={commentText} // <-- Apne existing state ka naam rakhna
    onChange={(e) => setCommentText(e.target.value)} // <-- Apna existing setter rakhna
    placeholder="Share your thoughts on this article..."
    className="w-full min-w-0 flex-1 bg-zinc-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition"
  />
  <button
    type="submit"
    disabled={submitting} // <-- Agar loading state hai toh rakhna, warna hata dena
    className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 hover:brightness-110 text-zinc-950 font-extrabold px-5 py-3 rounded-xl text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer"
  >
    <Send className="w-4 h-4" />
    <span>Post</span>
  </button>
</form>
          ) : (
            <p className="text-xs text-zinc-400 mb-6 bg-white/5 p-3.5 rounded-xl border border-white/10">
              <Link to="/login" className="text-amber-400 font-semibold hover:underline">
                Sign in
              </Link>{' '}
              to join the conversation.
            </p>
          )}

          <div className="space-y-3.5">
            {comments.map((c, idx) => {
              const commentAuthor = c.authorName || c.authorUsername || c.username;
              const canDeleteComment = user && (user.username === commentAuthor || isAdmin);
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-zinc-900/80 border border-white/10 rounded-2xl p-4 flex justify-between items-start gap-4"
                >
                  <div>
                    <div className="text-xs font-bold text-amber-400 mb-1">@{commentAuthor}</div>
                    <p className="text-sm text-zinc-300 leading-relaxed">{c.text || c.content}</p>
                  </div>
                  {canDeleteComment && (
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                      title="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      </motion.div>
    </>
  );
}
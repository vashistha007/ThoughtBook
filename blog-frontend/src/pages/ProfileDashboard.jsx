import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Mail, ShieldCheck, FileText, PenSquare, Calendar, Sparkles } from 'lucide-react';

export default function ProfileDashboard() {
  const { user } = useAuth();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get('/users/me/posts?pageNumber=0&pageSize=20')
      .then((res) => setMyPosts(res.data.content || []))
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      })
    : 'Member';

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 pt-10 pb-20">
      {/* Ambient Gold & Coral Glow */}
      <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 w-[680px] h-[260px] bg-gradient-to-r from-amber-500/15 via-orange-600/15 to-rose-600/15 blur-[120px] rounded-full -z-10" />

      {/* Author Identity & Stats Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-zinc-950/80 backdrop-blur-2xl border border-amber-500/25 rounded-3xl p-6 sm:p-10 mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Glowing Gradient Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 flex items-center justify-center text-3xl font-black text-zinc-950 uppercase shadow-xl shadow-amber-500/30 shrink-0">
            {user.username?.[0]}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                @{user.username}
              </h1>
              {user.roles?.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full font-bold"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> {role}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-amber-400" /> {user.email}
              </span>
              <span className="hidden sm:inline text-zinc-600">•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-rose-400" /> Joined {joinedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Stats + Quick Write Action */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-zinc-900/90 border border-amber-500/25 rounded-2xl px-7 py-4 text-center min-w-[150px]">
            <div className="text-3xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              {user.totalPosts ?? myPosts.length}
            </div>
            <div className="text-xs text-zinc-400 mt-1 font-semibold uppercase tracking-wider">
              Articles
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/write"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 hover:brightness-110 text-zinc-950 font-extrabold px-6 py-4 rounded-2xl text-sm shadow-lg shadow-amber-500/25 transition"
            >
              <PenSquare className="w-4 h-4" />
              <span>Write Article</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Author's Published Articles Section */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            My Published Articles
          </h2>
        </div>
        <span className="text-xs font-semibold text-zinc-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
          {myPosts.length} {myPosts.length === 1 ? 'Post' : 'Posts'}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-64 rounded-2xl bg-zinc-900/50 border border-white/5 p-6 animate-pulse"
            />
          ))}
        </div>
      ) : myPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-zinc-950/70 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-12 text-center"
        >
          <p className="text-zinc-300 font-semibold mb-2">No articles published yet</p>
          <p className="text-zinc-500 text-sm mb-6">
            Start sharing your engineering notes and architecture breakdowns with the community.
          </p>
          <Link
            to="/write"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 text-zinc-950 font-extrabold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-amber-500/25"
          >
            <PenSquare className="w-4 h-4" /> Create Your First Post
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPosts.map((post, idx) => (
            <PostCard key={post.id} post={post} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
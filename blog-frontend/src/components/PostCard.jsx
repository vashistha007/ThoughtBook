import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowUpRight, Clock } from 'lucide-react';
import ChemicalFlaskReaction from './ChemicalFlaskReaction';

export default function PostCard({ post, index = 0 }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setTilt({
      rotateX: ((y - centerY) / centerY) * -6,
      rotateY: ((x - centerX) / centerX) * 6,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const readTime = Math.max(1, Math.ceil((post.content?.split(/\s+/).length || 100) / 200));

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{
        opacity: 1,
        y: 0,
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
      }}
      transition={{
        opacity: { duration: 0.45, delay: index * 0.07 },
        y: { duration: 0.45, delay: index * 0.07 },
        rotateX: { type: 'spring', stiffness: 260, damping: 20 },
        rotateY: { type: 'spring', stiffness: 260, damping: 20 },
      }}
      style={{ transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative group rounded-2xl bg-zinc-900/65 backdrop-blur-xl border border-white/10 p-6 flex flex-col justify-between transition-colors duration-300 hover:border-amber-400/50 shadow-[0_12px_35px_rgba(0,0,0,0.6)]"
    >
      {/* Dynamic Golden-Coral Cursor Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl overflow-hidden transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(245, 158, 11, 0.18), rgba(244, 63, 94, 0.08) 45%, transparent 80%)`,
        }}
      />

      <div className="relative z-10">
        {/* Category Pill & Reading Time */}
        <div className="flex items-center justify-between text-xs mb-4">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 to-rose-500/15 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-full font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {post.categoryName || 'General'}
          </span>

          <span className="inline-flex items-center gap-1 text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {readTime} min read
          </span>
        </div>

        {/* Title */}
        <Link to={`/posts/${post.id}`}>
          <h2 className="text-xl font-extrabold text-zinc-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-amber-200 group-hover:via-amber-400 group-hover:to-rose-400 group-hover:bg-clip-text transition-all line-clamp-2 mb-2.5 leading-snug">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-zinc-400 text-sm line-clamp-3 mb-6 leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Footer */}
      <div className="relative z-20 pt-4 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-rose-600 flex items-center justify-center text-[11px] font-black text-zinc-950 uppercase shrink-0">
            {post.authorUsername?.[0]}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-zinc-200 truncate">@{post.authorUsername}</p>
            <p className="text-[11px] text-zinc-500 flex items-center gap-1">
              <Calendar className="w-3 h-3 shrink-0" /> {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ChemicalFlaskReaction postId={post.id} dropdownDirection="up" />

          <Link
            to={`/posts/${post.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-rose-600 text-zinc-300 group-hover:text-zinc-950 font-bold transition-all"
          >
            <span>Read</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
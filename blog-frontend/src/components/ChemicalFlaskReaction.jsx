import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const REACTIONS = [
  { type: 'HAPPY', label: 'Happy', emoji: '😊', rgb: [245, 158, 11], hex: '#f59e0b' },
  { type: 'SAD', label: 'Sad', emoji: '😢', rgb: [59, 130, 246], hex: '#3b82f6' },
  { type: 'LAUGH', label: 'Laugh', emoji: '😂', rgb: [234, 179, 8], hex: '#eab308' },
  { type: 'AMAZING', label: 'Amazing', emoji: '🤩', rgb: [16, 185, 129], hex: '#10b981' },
  { type: 'MIND_BLOWN', label: 'Mind Blown', emoji: '🤯', rgb: [244, 63, 94], hex: '#f43f5e' },
  { type: 'INSPIRED', label: 'Inspired', emoji: '💡', rgb: [139, 92, 246], hex: '#8b5cf6' },
  { type: 'FIRE', label: 'Fire', emoji: '🔥', rgb: [234, 88, 12], hex: '#ea580c' },
  { type: 'LOVE', label: 'Love', emoji: '❤️', rgb: [236, 72, 153], hex: '#ec4899' },
  { type: 'RELATABLE', label: 'Relatable', emoji: '🤝', rgb: [20, 184, 166], hex: '#14b8a6' },
  { type: 'THOUGHTFUL', label: 'Deep', emoji: '🧠', rgb: [99, 102, 241], hex: '#6366f1' },
];

function mixPotionColor(counts, totalCount) {
  if (!totalCount || totalCount === 0) return 'rgba(245, 158, 11, 0.28)';
  let r = 0, g = 0, b = 0;
  REACTIONS.forEach(({ type, rgb }) => {
    const c = counts?.[type] || 0;
    r += rgb[0] * c;
    g += rgb[1] * c;
    b += rgb[2] * c;
  });
  return `rgb(${Math.round(r / totalCount)}, ${Math.round(g / totalCount)}, ${Math.round(b / totalCount)})`;
}

export default function ChemicalFlaskReaction({ postId, dropdownDirection = 'up' }) {
  const [summary, setSummary] = useState({
    counts: {
      HAPPY: 0,
      SAD: 0,
      LAUGH: 0,
      AMAZING: 0,
      MIND_BLOWN: 0,
      INSPIRED: 0,
      FIRE: 0,
      LOVE: 0,
      RELATABLE: 0,
      THOUGHTFUL: 0,
    },
    totalCount: 0,
    userReaction: null,
    users: [],
  });
  const [pickerOpen, setPickerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');
  const [isShaking, setIsShaking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const wrapperRef = useRef(null);

  const fetchSummary = () => {
    if (!postId) return;
    axiosClient
      .get(`/posts/${postId}/reactions`)
      .then((res) => setSummary({ users: [], ...res.data }))
      .catch(() => {});
  };

  useEffect(() => {
    fetchSummary();
  }, [postId]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 650);
  };

  const handleReact = async (type) => {
    if (submitting) return;
    setPickerOpen(false); // Click karte hi dropdown turant close karo
    setSubmitting(true);
    triggerShake();

    const prevSummary = summary;
    const isSame = prevSummary.userReaction === type;
    const nextCounts = { ...prevSummary.counts };
    let nextTotal = prevSummary.totalCount;

    if (prevSummary.userReaction) {
      nextCounts[prevSummary.userReaction] = Math.max(0, (nextCounts[prevSummary.userReaction] || 0) - 1);
      nextTotal = Math.max(0, nextTotal - 1);
    }
    if (!isSame) {
      nextCounts[type] = (nextCounts[type] || 0) + 1;
      nextTotal += 1;
    }

    setSummary((prev) => ({
      ...prev,
      counts: nextCounts,
      totalCount: nextTotal,
      userReaction: isSame ? null : type,
    }));

    try {
      const res = await axiosClient.post(`/posts/${postId}/reactions?type=${type}`);
      setSummary({ users: [], ...res.data });
    } catch (err) {
      setSummary(prevSummary);
      console.error('Reaction update failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const liquidColor = mixPotionColor(summary.counts, summary.totalCount);
  const fillPercent = summary.totalCount === 0 ? 24 : Math.min(84, 34 + summary.totalCount * 7);
  const activeMeta = REACTIONS.find((r) => r.type === summary.userReaction);
  const shouldAnimateFlask = pickerOpen || isShaking;

  const filteredUsers =
    activeTab === 'ALL'
      ? summary.users || []
      : (summary.users || []).filter((u) => u.type === activeTab);

  return (
    <>
      <div
        ref={wrapperRef}
        onMouseEnter={() => {
          setPickerOpen(true);
          triggerShake();
        }}
        onMouseLeave={() => setPickerOpen(false)}
        className="relative inline-flex items-center"
      >
        {/* Compact Pill: Flask Button + Clickable Total Count */}
        <div
          className={`flex items-center rounded-full border text-xs font-bold transition ${
            summary.userReaction || pickerOpen
              ? 'bg-zinc-900/95 border-amber-400/60 text-white shadow-[0_0_20px_rgba(245,158,11,0.25)]'
              : 'bg-zinc-900/80 border-white/10 text-zinc-300 hover:border-amber-400/40'
          }`}
        >
          {/* Left Half: Flask Trigger (Opens Reaction Picker) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              triggerShake();
              setPickerOpen((prev) => !prev);
            }}
            className="flex items-center gap-1.5 pl-2.5 pr-2 py-1.5 cursor-pointer"
            title="React to post"
          >
            <motion.div
              animate={
                shouldAnimateFlask
                  ? {
                      rotate: [0, -14, 14, -10, 10, -5, 5, 0],
                      y: [0, -2, 0, -1.5, 0],
                      scale: [1, 1.08, 1.04, 1.08, 1],
                    }
                  : { rotate: 0, y: 0, scale: 1 }
              }
              transition={{ duration: 0.65, ease: 'easeInOut' }}
              style={{ transformOrigin: 'bottom center' }}
              className="relative w-4 h-5 flex items-center justify-center"
            >
              <svg viewBox="0 0 36 44" className="w-full h-full overflow-visible">
                <defs>
                  <clipPath id={`flask-clip-${postId}`}>
                    <path d="M14 4 H22 V13 L31 35 C32 38 30 41 26 41 H10 C6 41 4 38 5 35 L14 13 Z" />
                  </clipPath>
                </defs>

                <g clipPath={`url(#flask-clip-${postId})`}>
                  <motion.rect
                    x="-4"
                    width="44"
                    initial={false}
                    animate={{
                      y: 42 - (fillPercent / 100) * 36,
                      height: (fillPercent / 100) * 36 + 6,
                      fill: liquidColor,
                      rotate: shouldAnimateFlask ? [-6, 6, -4, 4, 0] : 0,
                    }}
                    transition={{
                      y: { type: 'spring', stiffness: 140, damping: 18 },
                      rotate: { duration: 0.6, ease: 'easeInOut' },
                    }}
                    style={{ transformOrigin: '18px 30px' }}
                  />

                  {(summary.totalCount > 0 || shouldAnimateFlask) && (
                    <>
                      <motion.circle
                        cx="14"
                        r={shouldAnimateFlask ? '1.8' : '1.4'}
                        fill="rgba(255,255,255,0.85)"
                        animate={{ cy: [38, 14], opacity: [0, 1, 0] }}
                        transition={{ duration: shouldAnimateFlask ? 0.9 : 2.1, repeat: Infinity, ease: 'easeOut' }}
                      />
                      <motion.circle
                        cx="21"
                        r={shouldAnimateFlask ? '1.6' : '1.2'}
                        fill="rgba(255,255,255,0.75)"
                        animate={{ cy: [39, 16], opacity: [0, 0.95, 0] }}
                        transition={{ duration: shouldAnimateFlask ? 1.05 : 2.6, delay: 0.3, repeat: Infinity, ease: 'easeOut' }}
                      />
                    </>
                  )}
                </g>

                <path
                  d="M14 4 H22 V13 L31 35 C32 38 30 41 26 41 H10 C6 41 4 38 5 35 L14 13 Z"
                  fill="none"
                  stroke={summary.userReaction || shouldAnimateFlask ? liquidColor : 'rgba(251, 191, 36, 0.65)'}
                  strokeWidth="2.3"
                  strokeLinejoin="round"
                />
                <line
                  x1="12"
                  y1="4"
                  x2="24"
                  y2="4"
                  stroke="rgba(253, 230, 138, 0.85)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            {activeMeta && <span className="text-sm leading-none">{activeMeta.emoji}</span>}
          </button>

          {/* Right Half: Clickable Count (Opens Who Reacted Modal) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPickerOpen(false);
              setActiveTab('ALL');
              fetchSummary();
              setModalOpen(true);
            }}
            title="View reaction breakdown & users"
            className="pl-1.5 pr-2.5 py-1.5 border-l border-white/10 text-zinc-200 hover:text-amber-300 tabular-nums transition cursor-pointer"
          >
            {summary.totalCount}
          </button>
        </div>

        {/* Scrollable Vertical Reaction Picker Dropdown */}
        <AnimatePresence>
          {pickerOpen && (
            <motion.div
              initial={{ opacity: 0, y: dropdownDirection === 'up' ? 8 : -8, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: dropdownDirection === 'up' ? 6 : -6, scale: 0.94 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={`absolute right-0 sm:left-0 sm:right-auto ${
                dropdownDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
              } w-48 max-h-64 overflow-y-auto rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-amber-500/35 p-1.5 shadow-[0_18px_45px_rgba(0,0,0,0.92)] z-50 flex flex-col gap-1`}
            >
              <div className="sticky top-0 bg-zinc-950/95 backdrop-blur-md z-10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-amber-300/80 border-b border-white/10 flex items-center justify-between">
                <span>React</span>
                <button
                  type="button"
                  onClick={() => {
                    setPickerOpen(false);
                    setActiveTab('ALL');
                    setModalOpen(true);
                  }}
                  className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                >
                  View all ({summary.totalCount})
                </button>
              </div>

              {REACTIONS.map((item) => {
                const count = summary.counts?.[item.type] || 0;
                const isSelected = summary.userReaction === item.type;

                return (
                  <motion.button
                    key={item.type}
                    type="button"
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleReact(item.type)}
                    className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-amber-500/20 border border-amber-400/50 text-white font-bold'
                        : 'hover:bg-white/5 text-zinc-300 border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base leading-none">{item.emoji}</span>
                      <span>{item.label}</span>
                    </span>

                    <span
                      style={{
                        backgroundColor: isSelected ? item.hex : 'rgba(255,255,255,0.08)',
                        color: isSelected ? '#09090b' : '#d4d4d8',
                      }}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold tabular-nums"
                    >
                      {count}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dedicated Reactions Breakdown & Users Modal Window */}
      {modalOpen &&
        createPortal(
          <div
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(false);
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl bg-zinc-950 border border-amber-500/30 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div>
                  <h3 className="text-base font-extrabold text-white">Reactions</h3>
                  <p className="text-xs text-zinc-400">{summary.totalCount} total reactions</p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Tabs with Individual Counts */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTab('ALL')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    activeTab === 'ALL'
                      ? 'bg-gradient-to-r from-amber-400 to-rose-500 text-zinc-950'
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  All ({summary.totalCount})
                </button>

                {REACTIONS.map((item) => {
                  const count = summary.counts?.[item.type] || 0;
                  if (count === 0) return null;
                  const isTabActive = activeTab === item.type;

                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setActiveTab(item.type)}
                      style={{
                        borderColor: isTabActive ? item.hex : 'rgba(255,255,255,0.1)',
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition cursor-pointer ${
                        isTabActive
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span>{item.emoji}</span>
                      <span>{item.label}</span>
                      <span className="tabular-nums text-amber-300">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* List of Users Who Reacted */}
              <div className="p-4 max-h-72 overflow-y-auto space-y-2">
                {filteredUsers.length === 0 ? (
                  <p className="text-center text-xs text-zinc-500 py-8">
                    No reactions yet. Be the first to react!
                  </p>
                ) : (
                  filteredUsers.map((u, idx) => {
                    const meta = REACTIONS.find((r) => r.type === u.type);
                    return (
                      <div
                        key={`${u.username}-${idx}`}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-zinc-900/75 border border-white/5"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-rose-600 flex items-center justify-center text-xs font-black text-zinc-950 uppercase">
                            {u.username?.[0] || 'U'}
                          </div>
                          <span className="text-sm font-semibold text-zinc-200">
                            @{u.username}
                          </span>
                        </div>

                        {meta && (
                          <span
                            style={{ borderColor: meta.hex }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-950 border text-zinc-200"
                          >
                            <span>{meta.emoji}</span>
                            <span>{meta.label}</span>
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>,
          document.body
        )}
    </>
  );
}
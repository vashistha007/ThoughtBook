import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../api/axiosClient';
import PostCard from '../components/PostCard';
import { Search, ChevronLeft, ChevronRight, X, ArrowUpRight, Sparkles,LayoutGrid } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const searchWrapperRef = useRef(null);

  useEffect(() => {
    axiosClient.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = keyword.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await axiosClient.get(
          `/posts/search?keyword=${encodeURIComponent(trimmed)}&pageNumber=0&pageSize=5`
        );
        setSuggestions(res.data.content || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = `/posts?pageNumber=${pageNumber}&pageSize=6&sortBy=createdAt&direction=desc`;
      if (keyword.trim()) {
        url = `/posts/search?keyword=${encodeURIComponent(keyword.trim())}&pageNumber=${pageNumber}&pageSize=6`;
      } else if (selectedCategory) {
        url = `/posts/category/${selectedCategory}?pageNumber=${pageNumber}&pageSize=6`;
      }
      const res = await axiosClient.get(url);
      setPosts(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to load posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [pageNumber, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    setSelectedCategory('');
    setPageNumber(0);
    fetchPosts();
  };

  const handleClearSearch = () => {
    setKeyword('');
    setSuggestions([]);
    setShowSuggestions(false);
    setPageNumber(0);
    axiosClient
      .get('/posts?pageNumber=0&pageSize=6&sortBy=createdAt&direction=desc')
      .then((res) => {
        setPosts(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      });
  };

  const [showTopicsModal, setShowTopicsModal] = useState(false);
const [topicSearch, setTopicSearch] = useState('');
const categoryScrollRef = useRef(null);

const scrollCategories = (direction) => {
  if (categoryScrollRef.current) {
    categoryScrollRef.current.scrollBy({
      left: direction === 'left' ? -320 : 320,
      behavior: 'smooth',
    });
  }
};

  return (
    <div className="relative z-10">
      {/* Warm Gold & Crimson Ambient Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[340px] bg-gradient-to-r from-amber-500/15 via-orange-600/15 to-rose-600/15 blur-[130px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto px-4 pt-12 pb-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs text-amber-300 font-semibold mb-5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>3D Interactive Engineering Publication</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4 leading-[1.08]">
            Ideas Forged in{' '}
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 bg-clip-text text-transparent">
              Code & Architecture.
            </span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Deep technical essays on Java, Spring Boot internals, distributed systems, and backend craft.
          </p>

          {/* Search Bar + Live Suggestions */}
          <div ref={searchWrapperRef} className="relative max-w-xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="flex items-center p-1.5 rounded-2xl bg-zinc-950/85 backdrop-blur-2xl border border-amber-500/25 shadow-[0_0_45px_rgba(245,158,11,0.12)] focus-within:border-amber-400 transition"
            >
              <Search className="w-5 h-5 text-amber-400 ml-3 shrink-0" />
              <input
                type="text"
                value={keyword}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search articles, architectures, Spring Boot..."
                className="w-full bg-transparent px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1.5 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:brightness-110 text-zinc-950 px-5 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer shrink-0"
              >
                Search
              </button>
            </form>

            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 right-0 mt-2.5 bg-zinc-950/95 backdrop-blur-2xl border border-amber-500/25 rounded-2xl shadow-2xl overflow-hidden z-40 text-left"
                >
                  {loadingSuggestions ? (
                    <div className="px-4 py-3.5 text-xs text-zinc-400">Scanning articles...</div>
                  ) : suggestions.length === 0 ? (
                    <div className="px-4 py-3.5 text-xs text-zinc-400">
                      No matching articles for "<span className="text-white">{keyword}</span>"
                    </div>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-amber-400 border-b border-white/10">
                        Instant Matches
                      </div>
                      <ul>
                        {suggestions.map((item) => (
                          <li key={item.id} className="border-b border-white/5 last:border-none">
                            <Link
                              to={`/posts/${item.id}`}
                              onClick={() => setShowSuggestions(false)}
                              className="flex items-center justify-between px-4 py-3 hover:bg-amber-500/10 transition group"
                            >
                              <div className="pr-3">
                                <p className="text-sm font-semibold text-zinc-100 group-hover:text-amber-300 transition line-clamp-1">
                                  {item.title}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                                  <span className="text-emerald-400">{item.categoryName || 'General'}</span>
                                  <span>•</span>
                                  <span>@{item.authorUsername}</span>
                                </div>
                              </div>
                              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-300 transition shrink-0" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Animated Sliding Pill Category Filter */}
        <div className="relative max-w-5xl mx-auto mb-10">
  <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800/80 rounded-full p-1.5 backdrop-blur-md">
    {/* Left Scroll Arrow */}
    <button
      type="button"
      onClick={() => scrollCategories('left')}
      className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/80 text-zinc-400 hover:text-amber-300 hover:bg-zinc-800 transition shrink-0 cursor-pointer"
      aria-label="Scroll categories left"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>

    {/* Single-Line Horizontal Scrollable Pills */}
    <div
      ref={categoryScrollRef}
      className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-0.5"
    >
      {[{ id: '', name: 'All Articles' }, ...categories].map((cat) => {
        const isActive =
          cat.id === '' ? selectedCategory === '' && !keyword : selectedCategory === cat.id;

        return (
          <button
            key={cat.id || 'all'}
            onClick={() => {
              setSelectedCategory(cat.id);
              setKeyword('');
              setPageNumber(0);
            }}
            className={`relative px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition shrink-0 cursor-pointer ${
              isActive ? 'text-zinc-950' : 'text-zinc-400 hover:text-amber-200'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="activeCategoryPill"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 shadow-lg shadow-amber-500/30 -z-10"
              />
            )}
            {cat.name}
          </button>
        );
      })}
    </div>

    {/* Right Scroll Arrow */}
    <button
      type="button"
      onClick={() => scrollCategories('right')}
      className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/80 text-zinc-400 hover:text-amber-300 hover:bg-zinc-800 transition shrink-0 cursor-pointer"
      aria-label="Scroll categories right"
    >
      <ChevronRight className="w-4 h-4" />
    </button>

    {/* All Topics Modal Trigger Button */}
    <button
      type="button"
      onClick={() => setShowTopicsModal(true)}
      className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-zinc-800 text-amber-300 hover:bg-zinc-700 border border-zinc-700/70 whitespace-nowrap transition shrink-0 cursor-pointer"
    >
      <LayoutGrid className="w-3.5 h-3.5" />
      <span>Topics ({categories.length})</span>
    </button>
  </div>

  {/* Searchable All Topics Modal */}
  {showTopicsModal && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={() => setShowTopicsModal(false)}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h3 className="text-base font-bold text-zinc-100">
            Explore Topics ({categories.length})
          </h3>
          <button
            type="button"
            onClick={() => setShowTopicsModal(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 border-b border-zinc-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search topics (e.g. Horror, 2 AM, Backend, Love)..."
              value={topicSearch}
              onChange={(e) => setTopicSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              autoFocus
            />
          </div>
        </div>

        <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[{ id: '', name: 'All Articles', description: 'Browse every post on ThoughtBook' }, ...categories]
            .filter((cat) => cat.name.toLowerCase().includes(topicSearch.toLowerCase()))
            .map((cat) => {
              const isSelected =
                cat.id === '' ? selectedCategory === '' && !keyword : selectedCategory === cat.id;

              return (
                <button
                  key={cat.id || 'all-modal'}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setKeyword('');
                    setPageNumber(0);
                    setShowTopicsModal(false);
                    setTopicSearch('');
                  }}
                  className={`text-left p-3 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'border-amber-500/70 bg-amber-500/10 text-amber-300'
                      : 'border-zinc-800 bg-zinc-950/50 hover:border-zinc-700 text-zinc-200'
                  }`}
                >
                  <div className="text-xs font-bold">{cat.name}</div>
                  {cat.description && (
                    <div className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                      {cat.description}
                    </div>
                  )}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  )}
</div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-64 rounded-2xl bg-zinc-900/50 border border-white/5 p-6 animate-pulse flex flex-col justify-between"
              >
                <div>
                  <div className="h-5 w-24 bg-zinc-800 rounded-full mb-4" />
                  <div className="h-6 w-3/4 bg-zinc-800 rounded mb-3" />
                  <div className="h-4 w-full bg-zinc-800/70 rounded mb-2" />
                  <div className="h-4 w-5/6 bg-zinc-800/70 rounded" />
                </div>
                <div className="h-8 w-full bg-zinc-800/50 rounded-lg" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/50 backdrop-blur border border-white/10 rounded-3xl text-zinc-400">
            No articles match this filter right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => (
              <PostCard key={post.id} post={post} index={idx} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              disabled={pageNumber === 0}
              onClick={() => setPageNumber((p) => p - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900/80 border border-white/10 text-sm text-zinc-300 hover:border-amber-400/50 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <span className="text-sm text-zinc-400">
              Page <strong className="text-amber-300">{pageNumber + 1}</strong> of {totalPages}
            </span>
            <button
              disabled={pageNumber + 1 >= totalPages}
              onClick={() => setPageNumber((p) => p + 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900/80 border border-white/10 text-sm text-zinc-300 hover:border-amber-400/50 disabled:opacity-40 transition cursor-pointer"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
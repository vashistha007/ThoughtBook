import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosClient from '../api/axiosClient';
import {
  PenTool,
  Eye,
  FileText,
  Clock,
  ArrowLeft,
  Sparkles,
  Tag,
  Send,
} from 'lucide-react';

export default function CreateEditPost() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', categoryId: '' });
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axiosClient.get('/categories').then((res) => setCategories(res.data || []));

    if (isEditMode) {
      axiosClient.get(`/posts/${id}`).then((res) => {
        setForm({
          title: res.data.title || '',
          content: res.data.content || '',
          categoryId: res.data.categoryId || '',
        });
      });
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        content: form.content,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
      };

      if (isEditMode) {
        await axiosClient.put(`/posts/${id}`, payload);
        navigate(`/posts/${id}`);
      } else {
        const res = await axiosClient.post('/posts', payload);
        navigate(`/posts/${res.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  // Live Writing Metrics
  const wordCount = form.content.trim()
    ? form.content.trim().split(/\s+/).length
    : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const selectedCategoryName =
    categories.find((c) => String(c.id) === String(form.categoryId))?.name ||
    'Uncategorized';

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 pt-10 pb-20">
      {/* Ambient Gold & Coral Glow */}
      <div className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 w-[680px] h-[280px] bg-gradient-to-r from-amber-500/15 via-orange-600/15 to-rose-600/15 blur-[120px] rounded-full -z-10" />

      {/* Top Navigation & Live Metrics Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link
          to={isEditMode ? `/posts/${id}` : '/'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-amber-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isEditMode ? 'Back to Article' : 'Back to Explore'}</span>
        </Link>

        {/* Live Word & Read Time Telemetry */}
        <div className="flex items-center gap-3 text-xs font-semibold bg-zinc-950/80 backdrop-blur-xl border border-amber-500/20 px-4 py-2 rounded-2xl">
          <span className="inline-flex items-center gap-1.5 text-amber-300">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
          <span className="text-zinc-600">•</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-400">
            <Clock className="w-3.5 h-3.5" />
            {readTime} min read
          </span>
        </div>
      </div>

      {/* Main Editorial Studio Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-zinc-950/85 backdrop-blur-2xl border border-amber-500/25 rounded-3xl p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.9)]"
      >
        {/* Studio Header + Write/Preview Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-7 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-500/30">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                {isEditMode ? 'Edit Article' : 'Author Studio'}
              </h1>
              <p className="text-xs text-zinc-400">
                Craft high-impact technical stories for ThoughtBook
              </p>
            </div>
          </div>

          {/* Animated Write / Live Preview Pill Switch */}
          <div className="inline-flex p-1 rounded-2xl bg-zinc-900 border border-white/10 self-start sm:self-auto">
            {[
              { key: 'write', label: 'Write', icon: PenTool },
              { key: 'preview', label: 'Preview', icon: Eye },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive ? 'text-zinc-950' : 'text-zinc-400 hover:text-amber-200'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="studioModePill"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 shadow-md -z-10"
                    />
                  )}
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3.5 rounded-xl mb-6"
          >
            {error}
          </motion.div>
        )}

        {activeTab === 'write' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-300/90 mb-2">
                Headline
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Mastering Spring Security 6 & Stateless JWT Architecture"
                className="w-full bg-zinc-900/90 border border-white/10 rounded-2xl px-4 py-3.5 text-base font-semibold text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-300/90 mb-2">
                Topic Category
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-amber-400 absolute left-4 top-3.5 pointer-events-none" />
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full bg-zinc-900/90 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                >
                  <option value="">-- Select a Topic Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content Textarea */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-300/90">
                  Article Body
                </label>
                <span className="text-[11px] text-zinc-500">
                  {form.content.length} characters
                </span>
              </div>
              <textarea
                rows={13}
                required
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Dive deep into architecture, code patterns, trade-offs, and benchmarks..."
                className="w-full bg-zinc-900/90 border border-white/10 rounded-2xl p-4 sm:p-5 text-sm sm:text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400 leading-relaxed transition"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                to={isEditMode ? `/posts/${id}` : '/'}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-sm font-semibold transition"
              >
                Cancel
              </Link>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 hover:brightness-110 disabled:opacity-50 text-zinc-950 font-extrabold px-7 py-3 rounded-xl text-sm shadow-lg shadow-amber-500/25 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>
                  {saving
                    ? 'Publishing...'
                    : isEditMode
                    ? 'Save Changes'
                    : 'Publish Article'}
                </span>
              </motion.button>
            </div>
          </form>
        ) : (
          /* Live Reader Preview Mode */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 to-rose-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold px-3.5 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {selectedCategoryName}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">
                {readTime} min read • Live Preview
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              {form.title || 'Your Article Headline Will Appear Here'}
            </h2>

            <div className="h-px bg-white/10" />

            <div className="text-zinc-200 leading-8 whitespace-pre-line text-base min-h-[240px]">
              {form.content || (
                <span className="text-zinc-500 italic">
                  Switch back to Write mode to start drafting your article...
                </span>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
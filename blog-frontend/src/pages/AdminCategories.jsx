import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../api/axiosClient';
import { Trash2, Plus, Shield, Edit3, Check, X, FolderKanban, Sparkles } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await axiosClient.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await axiosClient.post('/categories', form);
      setForm({ name: '', description: '' });
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating category');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (cat) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, description: cat.description || '' });
  };

  const handleUpdate = async (id) => {
    setError('');
    try {
      await axiosClient.put(`/categories/${id}`, editForm);
      setEditingId(null);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category permanently?')) return;
    setError('');
    try {
      await axiosClient.delete(`/categories/${id}`);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot delete category (it may have active posts)');
    }
  };

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 pt-10 pb-20">
      {/* Ambient Gold & Coral Glow */}
      <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 w-[640px] h-[250px] bg-gradient-to-r from-amber-500/15 via-orange-600/15 to-rose-600/15 blur-[120px] rounded-full -z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Category Studio
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Create, organize, and curate technical topics across ThoughtBook
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-zinc-950/80 border border-amber-500/25 px-4 py-2 rounded-2xl text-xs font-bold text-amber-300 self-start sm:self-auto">
          <FolderKanban className="w-4 h-4 text-amber-400" />
          <span>{categories.length} Active Categories</span>
        </div>
      </motion.div>

      {/* Create New Category Card */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        onSubmit={handleCreate}
        className="bg-zinc-950/80 backdrop-blur-2xl border border-amber-500/25 rounded-3xl p-6 sm:p-8 mb-10 shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Add New Topic</span>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3.5 rounded-xl mb-5">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-4">
            <input
              type="text"
              required
              placeholder="Name (e.g., Spring Security)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="md:col-span-5">
            <input
              type="text"
              required
              placeholder="Short description of this topic..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="md:col-span-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 hover:brightness-110 disabled:opacity-50 text-zinc-950 px-5 py-3 rounded-xl text-sm font-extrabold shadow-lg shadow-amber-500/25 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? 'Adding...' : 'Create'}</span>
            </motion.button>
          </div>
        </div>
      </motion.form>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-zinc-900/50 border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-12 text-center text-zinc-400 text-sm">
          No categories created yet. Add your first category above!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {categories.map((cat, idx) => {
              const isEditing = editingId === cat.id;

              return (
                <motion.div
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="bg-zinc-950/80 backdrop-blur-xl border border-white/10 hover:border-amber-500/40 rounded-2xl p-5 shadow-xl transition group"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full bg-zinc-900 border border-amber-400/50 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                      />
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-400"
                      />
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white text-xs cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdate(cat.id)}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 font-bold text-xs hover:brightness-110 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-rose-500" />
                          <h3 className="font-extrabold text-amber-300 text-base group-hover:text-amber-200 transition">
                            {cat.name}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                          {cat.description || 'No description provided'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => startEditing(cat)}
                          className="p-2 rounded-xl text-zinc-400 hover:text-amber-300 hover:bg-amber-500/10 transition cursor-pointer"
                          title="Edit category"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                          title="Delete category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
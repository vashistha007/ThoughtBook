import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Flame, Lock, User, ArrowRight } from 'lucide-react';
import OpenBookBackground from '../components/OpenBookBackground';

export default function Login() {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username/email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 overflow-x-hidden">
      {/* 3D Open Glowing Book Background */}
      <OpenBookBackground />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-zinc-950/75 border border-amber-500/30 rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 shadow-lg shadow-amber-500/30 mb-6 mx-auto">
          <Flame className="w-6 h-6 text-zinc-950 fill-zinc-950" />
        </div>

        <h2 className="text-3xl font-black text-center text-white tracking-tight mb-1.5">
          Welcome Back
        </h2>
        <p className="text-zinc-400 text-sm text-center mb-7">
          Step back into your personal thought space
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3.5 rounded-xl mb-5"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300/90 mb-2">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="username or abc@example.com"
                value={form.usernameOrEmail}
                onChange={(e) => setForm({ ...form, usernameOrEmail: e.target.value })}
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300/90 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 hover:brightness-110 disabled:opacity-50 text-zinc-950 font-extrabold py-3 rounded-xl text-sm shadow-lg shadow-amber-500/25 transition cursor-pointer"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </motion.button>

          <div className="text-center pt-1">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline transition"
            >
              Forgot your password?
            </Link>
          </div>
        </form>

        <p className="text-center text-xs text-zinc-400 mt-6 pt-5 border-t border-white/10">
          New to ThoughtBook?{' '}
          <Link
            to="/register"
            className="text-amber-400 font-semibold hover:text-amber-300 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
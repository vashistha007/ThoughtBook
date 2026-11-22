import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { PenSquare, Shield, LogOut, Flame } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-4 z-50 px-4"
    >
      <nav className="max-w-6xl mx-auto h-16 px-5 rounded-2xl bg-zinc-950/75 backdrop-blur-2xl border border-amber-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.75)] flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 shadow-lg shadow-amber-500/30 group-hover:rotate-6 transition-transform">
            <Flame className="w-5 h-5 text-zinc-950 fill-zinc-950" />
          </div>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-rose-400 bg-clip-text text-transparent">
            ThoughtBook
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-5 text-sm font-medium">
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-xl transition ${
              location.pathname === '/'
                ? 'text-amber-300 bg-amber-500/10 border border-amber-500/25'
                : 'text-zinc-400 hover:text-amber-200'
            }`}
          >
            Explore
          </Link>

          {user ? (
            <>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/write"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:brightness-110 px-4 py-2 rounded-xl text-zinc-950 font-bold shadow-lg shadow-amber-500/25 transition"
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Write</span>
                </Link>
              </motion.div>

              {isAdmin && (
                <Link
                  to="/admin/categories"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/20 transition"
                >
                  <Shield className="w-4 h-4" />
                  <span>Categories</span>
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-zinc-200 transition"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-rose-600 flex items-center justify-center text-[11px] font-black text-zinc-950 uppercase">
                  {user.username?.[0]}
                </div>
                <span className="hidden sm:inline">{user.username}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-zinc-300 hover:text-amber-300 transition">
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 px-4 py-2 rounded-xl text-zinc-950 font-bold shadow-lg shadow-amber-500/25 transition"
                >
                  Get Started
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
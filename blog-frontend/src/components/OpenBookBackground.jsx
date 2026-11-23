import { motion } from 'framer-motion';

export default function OpenBookBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10 select-none">
      {/* Desktop-only 3D Open Book Scene */}
      <div className="hidden sm:flex w-full h-full items-center justify-center relative">
        {/* 1. Deep Atmospheric Halo */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.48, 0.3],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[760px] h-[460px] rounded-full bg-gradient-to-tr from-amber-500/25 via-orange-500/20 to-rose-600/25 blur-[130px]"
        />

        {/* 2. Volumetric Light Cone Rising from Book Spine */}
        <motion.div
          animate={{ opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[46%] w-[560px] h-[380px] bg-gradient-to-t from-amber-400/20 via-amber-300/5 to-transparent [clip-path:polygon(38%_100%,62%_100%,100%_0%,0%_0%)] blur-2xl"
        />

        {/* 3. Celestial Astrolabe Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[780px] h-[780px] rounded-full border border-amber-400/10"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[600px] h-[600px] rounded-full border border-dashed border-rose-400/15"
        />

        {/* 4. 3D Levitating Luxury Open Book */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { duration: 0.9 },
            scale: { duration: 0.9 },
            y: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{ perspective: '1600px' }}
          className="relative w-[700px] md:w-[880px] h-[420px] md:h-[500px] flex items-center justify-center opacity-85"
        >
          {/* Leather & Gold-Trimmed Outer Hardcover */}
          <div
            style={{ transform: 'rotateX(14deg)' }}
            className="relative w-full h-full rounded-[28px] bg-gradient-to-b from-amber-950/70 via-zinc-900/95 to-zinc-950 border-2 border-amber-400/40 shadow-[0_35px_100px_rgba(0,0,0,0.95),0_0_50px_rgba(245,158,11,0.15)] p-4 flex"
          >
            {/* Left Page Edge */}
            <div className="w-2.5 h-[94%] my-auto rounded-l-lg bg-gradient-to-r from-amber-200/10 via-zinc-700/40 to-zinc-800/80 border-l border-amber-300/20" />

            {/* LEFT PAGE */}
            <div
              style={{ transform: 'rotateY(11deg)', transformOrigin: 'right center' }}
              className="relative flex-1 h-full rounded-l-2xl bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-800/90 border-r border-amber-400/30 p-10 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/60 via-black/20 to-transparent" />
              <div className="flex items-center justify-between text-[11px] font-mono tracking-[0.2em] text-amber-300/60 uppercase">
                <span>I • Genesis</span>
                <span>ThoughtBook</span>
              </div>

              <div className="space-y-4 my-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-amber-400/40 bg-amber-500/10 flex items-center justify-center font-serif text-xl font-bold text-amber-300/80">
                    T
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-2.5 w-4/5 rounded-full bg-gradient-to-r from-amber-400/35 to-transparent" />
                    <div className="h-2 w-3/5 rounded-full bg-white/10" />
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10" />
                <div className="h-2 w-11/12 rounded-full bg-white/10" />
                <div className="h-2 w-4/5 rounded-full bg-white/10" />
                <div className="pt-2 h-2 w-full rounded-full bg-white/10" />
                <div className="h-2 w-3/4 rounded-full bg-amber-400/20" />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>— 01 —</span>
                <span className="text-amber-400/40">✦</span>
              </div>
            </div>

            {/* CENTER LUMINOUS SPINE */}
            <div className="relative w-3.5 h-full bg-gradient-to-b from-amber-300/70 via-orange-500/80 to-rose-600/70 shadow-[0_0_30px_rgba(251,191,36,0.75)] z-10 rounded-sm">
              <motion.div
                animate={{ rotateZ: [-2, 3, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: 'top center' }}
                className="absolute -bottom-9 left-1/2 -translate-x-1/2 w-3.5 h-12 bg-gradient-to-b from-rose-500 to-amber-500 [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)] shadow-lg"
              />
            </div>

            {/* RIGHT PAGE */}
            <div
              style={{ transform: 'rotateY(-11deg)', transformOrigin: 'left center' }}
              className="relative flex-1 h-full rounded-r-2xl bg-gradient-to-bl from-zinc-900 via-zinc-900/95 to-zinc-800/90 border-l border-amber-400/30 p-10 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
              <div className="flex items-center justify-between text-[11px] font-mono tracking-[0.2em] text-amber-300/60 uppercase">
                <span>Vault</span>
                <span>Ed. 2026</span>
              </div>

              <div className="space-y-4 my-auto">
                <div className="h-2.5 w-2/3 rounded-full bg-gradient-to-r from-rose-400/35 to-transparent" />
                <div className="h-2 w-full rounded-full bg-white/10" />
                <div className="h-2 w-5/6 rounded-full bg-white/10" />
                <div className="h-2 w-11/12 rounded-full bg-white/10" />
                <div className="pt-2 h-2 w-4/5 rounded-full bg-white/10" />
                <div className="h-2 w-full rounded-full bg-white/10" />
                <div className="h-2 w-2/3 rounded-full bg-amber-400/20" />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span className="text-amber-400/40">✦</span>
                <span>— 02 —</span>
              </div>
            </div>

            {/* Right Page Edge */}
            <div className="w-2.5 h-[94%] my-auto rounded-r-lg bg-gradient-to-l from-amber-200/10 via-zinc-700/40 to-zinc-800/80 border-r border-amber-300/20" />

            {/* ANIMATED TRANSLUCENT FLIPPING PAGE */}
            <motion.div
              animate={{
                rotateY: [0, -180],
                opacity: [0, 0.8, 0.8, 0],
              }}
              transition={{
                duration: 5.2,
                repeat: Infinity,
                repeatDelay: 2.2,
                ease: [0.45, 0.05, 0.55, 0.95],
              }}
              style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
              className="absolute top-4 bottom-4 left-1/2 w-[calc(50%-1.5rem)] rounded-r-2xl bg-gradient-to-r from-amber-400/20 via-zinc-800/85 to-zinc-900/95 border border-amber-300/35 shadow-2xl pointer-events-none"
            />
          </div>
        </motion.div>

        {/* 5. Rising Golden Ember Sparks */}
        {[...Array(10)].map((_, i) => (
          <motion.span
            key={i}
            style={{
              left: `${22 + i * 6}%`,
              top: '54%',
            }}
            animate={{
              y: [0, -260],
              x: [0, i % 2 === 0 ? 18 : -18, 0],
              opacity: [0, 0.9, 0],
              scale: [0.5, 1.3, 0.4],
            }}
            transition={{
              duration: 4.2 + (i % 4) * 1.1,
              delay: i * 0.55,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_12px_#fcd34d]"
          />
        ))}
      </div>
    </div>
  );
}
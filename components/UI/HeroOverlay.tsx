import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, ThemeType } from "../../store";
import { audio } from "../../utils/audio";

interface SimMode {
  id: ThemeType;
  label: string;
  name: string;
  sub: string;
  icon: (active: boolean) => React.ReactNode;
}

const SIM_MODES: SimMode[] = [
  {
    id: "TECH",
    label: "STANDARD",
    name: "Standard",
    sub: "3x3 Classic",
    icon: (active) => (
      <svg className={`w-5 h-5 ${active ? "fill-white" : "fill-slate-700 dark:fill-slate-300"}`} viewBox="0 0 24 24">
        <path d="M3 3h4v4H3V3zm7 0h4v4h-4V3zm7 0h4v4h-4V3zM3 10h4v4H3v-4zm7 0h4v4h-4v-4zm7 0h4v4h-4v-4zM3 17h4v4H3v-4zm7 0h4v4h-4v-4zm7 0h4v4h-4v-4z"/>
      </svg>
    ),
  },
  {
    id: "DEV",
    label: "2x2 MINI",
    name: "2x2",
    sub: "Mini",
    icon: (active) => (
      <svg className={`w-5 h-5 ${active ? "fill-white" : "fill-slate-700 dark:fill-slate-300"}`} viewBox="0 0 24 24">
        <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"/>
      </svg>
    ),
  },
  {
    id: "NEON",
    label: "4x4 PRO",
    name: "4x4",
    sub: "Pro",
    icon: (active) => (
      <svg className={`w-5 h-5 ${active ? "fill-white" : "fill-slate-700 dark:fill-slate-300"}`} viewBox="0 0 24 24">
        <path d="M2 2h3.5v3.5H2V2zm5.5 0h3.5v3.5H7.5V2zm5.5 0h3.5v3.5H13V2zm5.5 0H22v3.5h-3.5V2zM2 7.5h3.5V11H2V7.5zm5.5 0h3.5V11H7.5V7.5zm5.5 0h3.5V11H13V7.5zm5.5 0H22V11h-3.5V7.5zM2 13h3.5v3.5H2V13zm5.5 0h3.5v3.5H7.5V13zm5.5 0h3.5v3.5H13V13zm5.5 0H22v3.5h-3.5V13zM2 18.5h3.5V22H2v-3.5zm5.5 0h3.5V22H7.5v-3.5zm5.5 0h3.5V22H13v-3.5zm5.5 0H22V22h-3.5v-3.5z"/>
      </svg>
    ),
  },
  {
    id: "SKETCH",
    label: "MIRROR BLOCKS",
    name: "Mirror",
    sub: "Blocks",
    icon: (active) => (
      <svg className={`w-5 h-5 ${active ? "fill-white" : "fill-slate-700 dark:fill-slate-300"}`} viewBox="0 0 24 24">
        <path d="M3 3h5v9H3V3zm7 0h11v5H10V3zm0 7h11v11H10V10zM3 14h5v7H3v-7z"/>
      </svg>
    ),
  },
  {
    id: "ANIME",
    label: "PYRAMINX STYLE",
    name: "Pyraminx",
    sub: "Style",
    icon: (active) => (
      <svg className={`w-5 h-5 ${active ? "fill-white" : "fill-slate-700 dark:fill-slate-300"}`} viewBox="0 0 24 24">
        <path d="M12 2L1 21h22L12 2zm0 4.5l6.5 11.5h-13L12 6.5z"/>
      </svg>
    ),
  },
];

export const HeroOverlay = () => {
  const { 
    mode, 
    setMode, 
    theme, 
    setTheme, 
    colorMode, 
    toggleColorMode,
    activeNav,
    setActiveNav,
    activeModal,
    setActiveModal,
    bestTime
  } = useStore();

  const isLight = colorMode === "light";
  const [demoPlaying, setDemoPlaying] = useState(false);

  const handleStart = () => {
    audio.click();
    audio.resume();
    setMode("GAME");
  };

  const handleThemeSelect = (modeItem: SimMode) => {
    audio.click();
    setTheme(modeItem.id);
  };

  const handleWatchDemo = () => {
    audio.click();
    setDemoPlaying(true);
    setTimeout(() => setDemoPlaying(false), 3000);
  };

  const currentMode = SIM_MODES.find(m => m.id === theme) || SIM_MODES[0];

  return (
    <AnimatePresence>
      {mode === "HERO" && (
        <motion.div
          className="absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:px-12 lg:py-6 pointer-events-none select-none overflow-y-auto overflow-x-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          {/* Subtle Isometric Background Grid Lines (matches mockup) */}
          <div className="fixed inset-0 pointer-events-none opacity-40 z-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:32px_32px]"></div>

          {/* ========================================================================= */}
          {/* 1. TOP HEADER NAVIGATION BAR                                              */}
          {/* ========================================================================= */}
          <header className="w-full relative z-20 shrink-0 pointer-events-auto">
            <div className="w-full flex items-center justify-between py-2">
              
              {/* Brand Logo & Version */}
              <div className="flex items-center gap-3">
                {/* 3D Isometric Cube Logo Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-orange-500/25">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2L2.5 7.5v9L12 22l9.5-5.5v-9L12 2zm0 2.3l6.9 4-3 1.7-6.9-4 3-1.7zm-8 6.4l7 4.1v7l-7-4.1V10.7zm16 7l-7 4.1v-7l7-4.1v7z"/>
                  </svg>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={`font-tech font-black text-xl tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      CYBERCUBE
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tech font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30">
                      v2.0
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-tech tracking-[0.2em] font-semibold text-slate-400">
                    SOLVE · LEARN · EXPLORE
                  </span>
                </div>
              </div>

              {/* Center Navigation Links */}
              <nav className="hidden lg:flex items-center gap-8">
                {[
                  { name: "Home", action: () => setActiveNav("Home") },
                  { name: "Play", action: handleStart },
                  { name: "Learn", action: () => setActiveModal("learn") },
                  { name: "Themes", action: () => {
                    const nextIndex = (SIM_MODES.findIndex(m => m.id === theme) + 1) % SIM_MODES.length;
                    handleThemeSelect(SIM_MODES[nextIndex]);
                  }},
                  { name: "Stats", action: () => setActiveModal("stats") },
                  { name: "About", action: () => setActiveModal("learn") },
                ].map((item) => {
                  const isActive = activeNav === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => { audio.click(); item.action(); }}
                      onMouseEnter={() => audio.hover()}
                      className={`relative font-sans-std text-sm font-semibold transition-all duration-200 py-1.5 ${
                        isActive
                          ? isLight ? 'text-slate-950 font-bold' : 'text-white font-bold'
                          : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="navUnderline"
                          className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange-500 rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Right Utilities: Status, Light/Dark Toggle & Login */}
              <div className="flex items-center gap-3">
                {/* System Online Pill */}
                <div className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono-tech font-semibold backdrop-blur-md shadow-sm transition-colors ${
                  isLight 
                    ? 'bg-white/80 border-slate-200/80 text-slate-700' 
                    : 'bg-neutral-900/80 border-white/10 text-slate-300'
                }`}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>System Online</span>
                </div>

                {/* Circular Theme Toggle Button (Light/Dark Sun ☀️ / Moon 🌙) */}
                <button
                  onClick={() => { audio.click(); toggleColorMode(); }}
                  onMouseEnter={() => audio.hover()}
                  aria-label="Toggle light and dark mode"
                  className={`w-9 h-9 rounded-full flex items-center justify-center border shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 ${
                    isLight 
                      ? 'bg-white border-slate-200 text-orange-500 hover:bg-orange-50' 
                      : 'bg-neutral-800 border-neutral-700 text-amber-400 hover:bg-neutral-700'
                  }`}
                >
                  {isLight ? (
                    /* Sun Icon with rays */
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
                    </svg>
                  ) : (
                    /* Moon Icon */
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.3 2a10 10 0 0 0-.19 14 9.92 9.92 0 0 0 7.9 4 10 10 0 0 0 2-.2 10 10 0 1 1-9.71-17.8z"/>
                    </svg>
                  )}
                </button>

                {/* Dark Pill Login Button */}
                <button
                  onClick={() => { audio.click(); setActiveModal("login"); }}
                  onMouseEnter={() => audio.hover()}
                  className="flex items-center gap-2 px-4 py-2 rounded-full font-sans-std text-xs font-bold transition-all duration-300 shadow-md hover:scale-105 active:scale-95 bg-[#0a1128] hover:bg-slate-800 text-white"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <span>Login</span>
                </button>
              </div>
            </div>
          </header>

          {/* ========================================================================= */}
          {/* 2. MAIN HERO SECTION                                                      */}
          {/* ========================================================================= */}
          <div className="flex-1 flex flex-col justify-center w-full relative z-10 py-6 pointer-events-none">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Content Column (7 cols) */}
              <div className="lg:col-span-7 flex flex-col items-start pointer-events-auto max-w-xl">
                
                {/* Top Badge: INTERACTIVE 3D PUZZLE SIMULATION */}
                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono-tech font-bold uppercase tracking-wider mb-5 border backdrop-blur-md shadow-sm ${
                  isLight 
                    ? 'bg-white/90 border-slate-200 text-orange-600' 
                    : 'bg-neutral-900/90 border-white/10 text-orange-400'
                }`}>
                  <span className="text-orange-500 text-xs">▶</span>
                  <span>INTERACTIVE 3D PUZZLE SIMULATION</span>
                </div>

                {/* Massive Title: CYBER CUBE */}
                <div className="mb-4 leading-none select-none">
                  <h1 className={`font-tech font-black text-6xl sm:text-7xl md:text-8xl tracking-tight transition-colors ${
                    isLight ? 'text-[#0a1128]' : 'text-white'
                  }`}>
                    CYBER
                  </h1>
                  <h1 className="font-tech font-black text-6xl sm:text-7xl md:text-8xl tracking-tight text-[#f97316]">
                    CUBE
                  </h1>
                </div>

                {/* Description Copy */}
                <p className={`font-sans-std text-sm sm:text-base leading-relaxed mb-6 font-normal ${
                  isLight ? 'text-slate-600' : 'text-slate-300'
                }`}>
                  A next-generation spatial intelligence experience engineered with WebGL & Three.js. Solve the Rubik’s cube in real-time, test multiple rendering themes, and track your metrics.
                </p>

                {/* Action Buttons Row */}
                <div className="flex items-center gap-4 mb-8 flex-wrap">
                  {/* Primary INITIALIZE ENGINE button */}
                  <button
                    onClick={handleStart}
                    onMouseEnter={() => audio.hover()}
                    className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 text-white font-tech font-bold text-base tracking-wider uppercase shadow-xl shadow-orange-500/35 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                      ▶
                    </span>
                    <span>INITIALIZE ENGINE</span>
                    <span className="text-lg transition-transform group-hover:translate-x-1">
                      ›
                    </span>
                  </button>

                  {/* Secondary WATCH DEMO button */}
                  <button
                    onClick={handleWatchDemo}
                    onMouseEnter={() => audio.hover()}
                    className={`flex items-center gap-2.5 px-6 py-4 rounded-2xl border font-tech font-bold text-sm tracking-wider uppercase backdrop-blur-md shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      isLight 
                        ? 'bg-white/80 hover:bg-white border-slate-200 text-slate-800' 
                        : 'bg-neutral-900/80 hover:bg-neutral-800 border-white/10 text-white'
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center text-orange-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                    <span>{demoPlaying ? "PLAYING DEMO..." : "WATCH DEMO"}</span>
                  </button>
                </div>

                {/* Choose Simulation Mode Section */}
                <div className="w-full mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono-tech text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                      CHOOSE SIMULATION MODE
                    </span>
                    <span className="font-mono-tech text-[11px] font-bold text-orange-500 uppercase tracking-widest">
                      {currentMode.label}
                    </span>
                  </div>

                  {/* 5 Mode Selector Cards */}
                  <div className="grid grid-cols-5 gap-2 sm:gap-2.5 w-full">
                    {SIM_MODES.map((item) => {
                      const active = theme === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleThemeSelect(item)}
                          onMouseEnter={() => audio.hover()}
                          className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all duration-300 ${
                            active
                              ? 'bg-gradient-to-b from-orange-500 to-orange-600 border-orange-500 text-white shadow-lg shadow-orange-500/35 scale-[1.03] z-10'
                              : isLight
                                ? 'bg-white/80 hover:bg-white border-slate-200/90 text-slate-700 hover:border-slate-300 shadow-sm'
                                : 'bg-neutral-900/80 hover:bg-neutral-800 border-white/10 text-slate-300'
                          }`}
                        >
                          <div className="mb-1.5">{item.icon(active)}</div>
                          <span className="text-[11px] font-mono-tech font-bold leading-tight">
                            {item.name}
                          </span>
                          <span className={`text-[9px] font-mono-tech leading-tight ${active ? 'text-white/80' : 'text-slate-400'}`}>
                            {item.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Background & Floating Widgets Column (5 cols) */}
              <div className="lg:col-span-5 relative h-full flex flex-col justify-between items-end pointer-events-none min-h-[360px]">
                
                {/* Giant 3D Watermark & Vertical Text (Matches Mockup) */}
                <div className="hidden md:flex flex-col items-end absolute top-0 right-4 pointer-events-none select-none opacity-40">
                  <span className={`font-tech font-black text-8xl lg:text-9xl tracking-tighter leading-none ${
                    isLight ? 'text-slate-200' : 'text-neutral-800'
                  }`}>
                    3D
                  </span>
                  
                  <div className="flex flex-col items-center gap-2 mt-4 font-mono-tech text-[10px] tracking-[0.35em] text-slate-400 uppercase font-semibold">
                    <span>P U Z Z L E</span>
                    <span>E X P L O R E</span>
                    <span>L E A R N</span>
                    <span>I M P R O V E</span>
                    <div className="w-6 h-[2px] bg-orange-500 mt-2"></div>
                  </div>
                </div>

                {/* Handwritten Cursive Note with Arrow: Rotate, Explore, Solve (Positioned on the left side of the cube) */}
                <div className="hidden lg:flex items-center gap-2 xl:gap-3 absolute top-[35%] -left-20 xl:-left-28 2xl:-left-36 pointer-events-none select-none z-20">
                  <div className="font-cursive text-xl xl:text-2xl text-slate-600 dark:text-slate-300 font-bold leading-tight text-right rotate-[-4deg]">
                    Rotate<br />
                    Explore<br />
                    Solve
                  </div>
                  {/* Hand drawn style curvy arrow pointing towards the cube */}
                  <svg 
                    className="w-10 h-10 xl:w-12 xl:h-12 text-slate-400 dark:text-slate-500 drop-shadow-sm select-none" 
                    viewBox="0 0 100 80" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M 12 52 Q 45 15 82 32" />
                    <path d="M 68 23 L 82 32 L 72 45" />
                  </svg>
                </div>

                {/* Floating "YOUR BEST TIME" Widget (Matches Mockup) */}
                <div className="pointer-events-auto mt-auto mb-2 mr-2">
                  <div className={`p-4 rounded-3xl border backdrop-blur-xl shadow-xl transition-all hover:scale-105 ${
                    isLight 
                      ? 'bg-white/90 border-slate-200/90 shadow-slate-200/60' 
                      : 'bg-neutral-900/90 border-white/10 shadow-black/50'
                  }`}>
                    <div className="flex items-center gap-3">
                      {/* Bar Chart Icon Pill */}
                      <div className="w-9 h-9 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
                        </svg>
                      </div>

                      <div className="flex flex-col">
                        <span className="font-mono-tech text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                          YOUR BEST TIME
                        </span>
                        <span className={`font-mono-tech text-xl font-black tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {bestTime || "00:32.14"}
                        </span>
                      </div>

                      {/* Small circular chevron */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ml-2 ${
                        isLight ? 'bg-slate-100 text-slate-600' : 'bg-white/10 text-slate-300'
                      }`}>
                        ›
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-[10px] font-sans-std text-slate-400 mt-1 mr-2 font-medium">
                    Small moves. Big progress.
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. BOTTOM FOOTER BAR                                                      */}
          {/* ========================================================================= */}
          <footer className="w-full pt-2 shrink-0 pointer-events-auto">
            <div className="w-full flex items-center justify-between">
              
              {/* Left Quote Badge */}
              <div className={`flex items-center gap-3 px-4 py-2.5 rounded-full border backdrop-blur-md shadow-xs transition-colors ${
                isLight 
                  ? 'bg-white/80 border-slate-200/80 text-slate-600' 
                  : 'bg-neutral-900/80 border-white/10 text-slate-400'
              }`}>
                <div className="text-orange-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <span className="font-mono-tech text-[11px] font-bold uppercase tracking-wider">
                  " IT'S NOT JUST A PUZZLE, IT'S A MIND UPGRADE. "
                </span>
              </div>

              {/* Right Scroll Indicator with Mouse Icon */}
              <div className="hidden sm:flex items-center gap-3 text-slate-400 font-mono-tech text-[10px] tracking-widest font-semibold uppercase">
                <span>SCROLL TO EXPLORE</span>
                <div className="w-6 h-[1px] bg-slate-300 dark:bg-slate-700"></div>
                {/* Mouse Outline Icon with Animated Wheel */}
                <div className="w-4 h-7 rounded-full border-2 border-slate-400 flex items-start justify-center p-1">
                  <div className="w-1 h-1.5 rounded-full bg-slate-400 animate-bounce"></div>
                </div>
              </div>

            </div>
          </footer>

          {/* ========================================================================= */}
          {/* 4. INTERACTIVE MODALS (Learn, Stats, Login)                               */}
          {/* ========================================================================= */}
          <AnimatePresence>
            {activeModal !== "none" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md pointer-events-auto"
                onClick={() => setActiveModal("none")}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl relative ${
                    isLight 
                      ? 'bg-white border-slate-200 text-slate-900' 
                      : 'bg-neutral-900 border-neutral-700 text-white'
                  }`}
                >
                  <button
                    onClick={() => setActiveModal("none")}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-white/10"
                  >
                    ✕
                  </button>

                  {activeModal === "learn" && (
                    <div>
                      <div className="flex items-center gap-2 text-orange-500 mb-2 font-mono-tech text-xs font-bold uppercase tracking-widest">
                        <span>GUIDE // ALGORITHMS</span>
                      </div>
                      <h2 className="font-tech font-bold text-2xl mb-3">How to Solve CyberCube</h2>
                      <div className="space-y-3 text-sm text-slate-500 dark:text-slate-300 font-sans-std">
                        <p>1. <strong>White Cross</strong>: Create a cross on the white face matching adjacent center colors.</p>
                        <p>2. <strong>First Layer Corners</strong>: Insert white corner pieces using the <code>R U R' U'</code> algorithm.</p>
                        <p>3. <strong>Second Layer Edges</strong>: Rotate edge pieces to complete the middle layer.</p>
                        <p>4. <strong>Yellow Cross & OLL</strong>: Form the yellow cross on top and orient the last layer.</p>
                      </div>
                      <button
                        onClick={handleStart}
                        className="mt-6 w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-tech font-bold uppercase tracking-wider"
                      >
                        Try It Now
                      </button>
                    </div>
                  )}

                  {activeModal === "stats" && (
                    <div>
                      <div className="flex items-center gap-2 text-orange-500 mb-2 font-mono-tech text-xs font-bold uppercase tracking-widest">
                        <span>METRICS // RECORDS</span>
                      </div>
                      <h2 className="font-tech font-bold text-2xl mb-4">Player Statistics</h2>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="p-3 rounded-2xl border border-current/10 text-center">
                          <span className="text-[10px] font-mono-tech text-slate-400 block uppercase">Personal Best</span>
                          <span className="font-tech text-2xl font-black text-orange-500">{bestTime}</span>
                        </div>
                        <div className="p-3 rounded-2xl border border-current/10 text-center">
                          <span className="text-[10px] font-mono-tech text-slate-400 block uppercase">Visual Mode</span>
                          <span className="font-tech text-lg font-bold">{currentMode.name}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveModal("none")}
                        className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white dark:text-black text-white font-tech font-bold uppercase tracking-wider"
                      >
                        Close
                      </button>
                    </div>
                  )}

                  {activeModal === "login" && (
                    <div>
                      <div className="flex items-center gap-2 text-orange-500 mb-2 font-mono-tech text-xs font-bold uppercase tracking-widest">
                        <span>SECURITY // AUTHENTICATION</span>
                      </div>
                      <h2 className="font-tech font-bold text-2xl mb-4">Sign in to CyberCube</h2>
                      <div className="space-y-3 mb-6 font-sans-std">
                        <input
                          type="email"
                          placeholder="Pilot Email or ID"
                          className="w-full p-3 rounded-xl border border-slate-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-orange-500"
                        />
                        <input
                          type="password"
                          placeholder="Passcode"
                          className="w-full p-3 rounded-xl border border-slate-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <button
                        onClick={() => setActiveModal("none")}
                        className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-tech font-bold uppercase tracking-wider"
                      >
                        Authenticate
                      </button>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
};



import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useThree } from '@react-three/fiber';
import { useStore } from '../../store';
import { audio } from '../../utils/audio';
import { MiniCube } from '../3D/MiniCube';
import { generateTicketImage } from '../../utils/ticketGen';
import * as THREE from 'three';

// Helper component for high-performance timer rendering
const GameTimer = ({ isLight }: { isLight: boolean }) => {
    const startTime = useStore(state => state.gameStartTime);
    const endTime = useStore(state => state.gameEndTime);
    const isRunning = useStore(state => state.isTimerRunning);
    
    const [displayTime, setDisplayTime] = useState("00:00.00");
    const reqRef = useRef<number>(0);

    useEffect(() => {
        const update = () => {
            const now = endTime || Date.now();
            if (startTime) {
                const diff = now - startTime;
                const m = Math.floor(diff / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                const ms = Math.floor((diff % 1000) / 10);
                setDisplayTime(
                    `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
                );
            } else {
                setDisplayTime("00:00.00");
            }
            if (isRunning) {
                reqRef.current = requestAnimationFrame(update);
            }
        };
        
        update();

        return () => {
            if (reqRef.current) cancelAnimationFrame(reqRef.current);
        }
    }, [isRunning, startTime, endTime]);

    return (
        <div className={`font-mono-tech text-3xl sm:text-4xl tracking-widest font-black tabular-nums transition-colors ${
            isRunning 
                ? (isLight ? 'text-slate-900' : 'text-white') 
                : 'text-orange-500'
        }`}>
            {displayTime}
        </div>
    );
};

// Sync Camera Component for MiniCube
const CameraSync = () => {
    const { camera } = useThree();
    const cameraQuaternion = useStore(state => state.cameraQuaternion);

    useEffect(() => {
        if (cameraQuaternion) {
            const q = new THREE.Quaternion().fromArray(cameraQuaternion);
            camera.quaternion.copy(q);
            const distance = 10;
            camera.position.set(0, 0, 1).applyQuaternion(q).multiplyScalar(distance);
        }
    }, [cameraQuaternion, camera]);

    return null;
};

export const GameOverlay = () => {
  const { 
    mode, 
    setMode, 
    resetGame, 
    isSolved, 
    gameStartTime, 
    gameEndTime, 
    solvedSnapshot, 
    currentHint,
    colorMode,
    toggleColorMode 
  } = useStore();

  const isLight = colorMode === 'light';
  const [showInfo, setShowInfo] = useState(false);
  const [ticketId] = useState(() => Math.random().toString(36).substring(7).toUpperCase());

  const handleExit = () => {
      audio.click();
      resetGame();
      setMode('HERO');
  };

  const handleToggleColorMode = () => {
      audio.click();
      toggleColorMode();
  };
  
  const getFinalTime = () => {
      if (!gameStartTime || !gameEndTime) return "00:00.00";
      const diff = gameEndTime - gameStartTime;
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const ms = Math.floor((diff % 1000) / 10);
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleDownload = async (e: React.MouseEvent) => {
      e.preventDefault();
      audio.click();
      if (!solvedSnapshot) return;
      
      const fullTicketDataUrl = await generateTicketImage(
          solvedSnapshot,
          getFinalTime(),
          ticketId,
          new Date().toLocaleDateString()
      );

      const link = document.createElement('a');
      link.href = fullTicketDataUrl;
      link.download = `CYBERCUBE_TICKET_${ticketId}.png`;
      link.click();
  };

  return (
    <AnimatePresence>
      {mode === 'GAME' && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          
          {/* --- TOP FLOATING HUD BAR --- */}
          <motion.div 
            className="absolute top-4 left-4 right-4 md:top-6 md:left-8 md:right-8 flex justify-between items-center pointer-events-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Status Pill */}
            <div className={`hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-2xl border backdrop-blur-xl transition-all shadow-md ${
              isLight 
                ? 'bg-white/80 border-slate-200/80 text-slate-700 shadow-slate-200/50' 
                : 'bg-neutral-900/80 border-white/10 text-stone-300 shadow-black/40'
            }`}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
              <div className="flex flex-col">
                <span className="font-mono-tech text-[10px] font-bold tracking-widest uppercase">
                  SIMULATION ACTIVE
                </span>
                <span className={`font-mono-tech text-[9px] ${isLight ? 'text-slate-400' : 'text-stone-400'}`}>
                  SOLVER ENGINE ON
                </span>
              </div>
            </div>

            {/* Central High-Legibility Timer Card */}
            <div className={`px-6 py-2 rounded-2xl border backdrop-blur-xl flex items-center justify-center shadow-lg transition-all ${
              isLight 
                ? 'bg-white/85 border-slate-200/80 shadow-slate-200/50' 
                : 'bg-neutral-900/80 border-white/10 shadow-black/40'
            }`}>
              <GameTimer isLight={isLight} />
            </div>
             
            {/* Top Right Actions: Light/Dark Mode + Exit Button */}
            <div className="flex items-center gap-3">
              {/* THEME TOGGLE BUTTON */}
              <button
                onClick={handleToggleColorMode}
                onMouseEnter={() => audio.hover()}
                aria-label="Toggle light and dark mode"
                className={`p-2.5 rounded-2xl border text-xs font-mono-tech font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center ${
                  isLight 
                    ? 'bg-white/80 hover:bg-slate-100 border-slate-200 text-slate-700' 
                    : 'bg-neutral-900/80 hover:bg-neutral-800 border-white/10 text-stone-300'
                }`}
              >
                <div className={`w-5 h-5 flex items-center justify-center transition-transform duration-300 ${
                  isLight ? 'rotate-0 text-amber-500' : 'rotate-180 text-orange-400'
                }`}>
                  {isLight ? (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.3 2a10 10 0 0 0-.19 14 9.92 9.92 0 0 0 7.9 4 10 10 0 0 0 2-.2 10 10 0 1 1-9.71-17.8z"/>
                    </svg>
                  )}
                </div>
              </button>

              {/* Exit Button */}
              <button
                onClick={handleExit}
                onMouseEnter={() => audio.hover()}
                className={`px-5 py-2.5 rounded-2xl font-tech font-bold text-sm transition-all duration-200 flex items-center gap-2 group shadow-md ${
                  isLight
                    ? 'bg-white/90 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-300'
                    : 'bg-neutral-900/90 hover:bg-rose-950/40 text-stone-300 hover:text-rose-400 border border-white/10 hover:border-rose-500/40'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 group-hover:scale-125 transition-transform"></span>
                <span>EXIT</span>
              </button>
            </div>
          </motion.div>

          {/* --- HINT MODULE (Bottom Left) with MiniCube --- */}
          <motion.div 
            className="absolute bottom-6 left-6 pointer-events-auto"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
             <div className={`backdrop-blur-xl border rounded-2xl shadow-xl w-[210px] overflow-hidden transition-all duration-300 ${
               isLight 
                 ? 'bg-white/85 border-slate-200/80 shadow-slate-200/50' 
                 : 'bg-neutral-900/85 border-white/10 shadow-black/40'
             }`}>
                 <div className={`p-3 border-b flex justify-between items-center ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                     <div className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                         <span className="font-mono-tech text-[10px] text-orange-500 font-bold tracking-widest uppercase">
                           AI PRECOGNITION
                         </span>
                     </div>
                     <span className={`text-[9px] font-mono-tech ${isLight ? 'text-slate-400' : 'text-stone-400'}`}>
                       3D PROJECTION
                     </span>
                 </div>
                 
                 {/* Mini Cube Canvas */}
                 <div className={`h-[160px] w-full relative ${
                   isLight 
                     ? 'bg-gradient-to-b from-slate-100 to-slate-200/70' 
                     : 'bg-gradient-to-b from-neutral-950/80 to-neutral-900/90'
                 }`}>
                     <Canvas camera={{ position: [6, 4.5, 9], fov: 40 }}>
                         <CameraSync />
                         <ambientLight intensity={isLight ? 1.8 : 1.4} />
                         <pointLight position={[10, 10, 10]} intensity={1.2} />
                         <MiniCube />
                     </Canvas>
                 </div>

                 {/* Move Suggestion Footer */}
                 <div className={`p-3 border-t ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                     {currentHint ? (
                         <>
                            <div className={`text-[10px] font-mono-tech uppercase mb-1 ${isLight ? 'text-slate-500' : 'text-stone-400'}`}>
                              RECOMMENDED MOVE:
                            </div>
                            <div className="font-tech text-base font-black text-orange-500 tracking-wider">
                                {currentHint}
                            </div>
                         </>
                     ) : (
                         <div className={`font-mono-tech text-[10px] tracking-wide ${isLight ? 'text-slate-400' : 'text-stone-400'}`}>
                             AWAITING ROTATION...
                         </div>
                     )}
                 </div>
             </div>
          </motion.div>

          {/* --- CONTROLS MODAL & BUTTON (Bottom Right) --- */}
          <div className="absolute bottom-6 right-6 flex flex-col items-end gap-3 pointer-events-auto">
             <AnimatePresence>
                {showInfo && (
                    <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`backdrop-blur-xl p-5 rounded-2xl border shadow-2xl w-72 origin-bottom-right ${
                          isLight 
                            ? 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/50' 
                            : 'bg-neutral-900/95 border-white/10 text-stone-200 shadow-black/60'
                        }`}
                    >
                        <div className="flex items-center justify-between border-b pb-2.5 mb-3 border-current/10">
                            <span className="font-mono-tech text-xs font-bold tracking-widest uppercase">
                                CONTROL SCHEME
                            </span>
                            <span className="text-[10px] font-mono-tech text-orange-500 font-bold">
                                SHORTCUTS
                            </span>
                        </div>

                        <div className="flex flex-col gap-2.5 text-xs font-mono-tech">
                            <div className="flex justify-between items-center">
                                <span className={isLight ? 'text-slate-500' : 'text-stone-400'}>ORBIT VIEW</span>
                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${isLight ? 'bg-slate-100 text-slate-800' : 'bg-white/10 text-white'}`}>
                                  DRAG BG
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={isLight ? 'text-slate-500' : 'text-stone-400'}>ROTATE FACE</span>
                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${isLight ? 'bg-slate-100 text-slate-800' : 'bg-white/10 text-white'}`}>
                                  DRAG CUBE
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-current/10">
                                <span className={isLight ? 'text-slate-500' : 'text-stone-400'}>FACES KEYS</span>
                                <span className="font-bold text-orange-500">[R L U D F B]</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={isLight ? 'text-slate-500' : 'text-stone-400'}>INVERSE ROTATION</span>
                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${isLight ? 'bg-slate-100 text-slate-800' : 'bg-white/10 text-white'}`}>
                                  SHIFT + KEY
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
             </AnimatePresence>

             {/* Help Floating Action Button */}
             <motion.button
                onMouseEnter={() => { setShowInfo(true); audio.hover(); }}
                onMouseLeave={() => setShowInfo(false)}
                onClick={() => { setShowInfo(!showInfo); audio.click(); }}
                aria-label="View controls"
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono-tech font-bold text-base transition-all duration-300 shadow-lg border hover:scale-105 active:scale-95 ${
                  isLight 
                    ? 'bg-white/90 hover:bg-orange-500 text-slate-700 hover:text-white border-slate-200 hover:border-orange-500' 
                    : 'bg-neutral-900/90 hover:bg-orange-500 text-stone-300 hover:text-white border-white/10 hover:border-orange-500'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
             >
                ?
             </motion.button>
          </div>
          
          {/* --- SOLVED VICTORY MODAL (TICKET) --- */}
          <AnimatePresence>
            {isSolved && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 pointer-events-auto"
                >
                    <motion.div 
                        initial={{ scale: 0.85, y: 30 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", bounce: 0.3 }}
                        className={`max-w-sm w-full overflow-hidden relative shadow-2xl rounded-3xl border transition-all ${
                          isLight 
                            ? 'bg-white border-slate-200 text-slate-900' 
                            : 'bg-neutral-900 border-neutral-700 text-white'
                        }`}
                    >
                        {/* Header - Holographic Style */}
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-24 relative overflow-hidden flex flex-col items-center justify-center p-4">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent scale-150"></div>
                            
                            <h2 className="font-tech font-black text-3xl text-white tracking-wider relative z-10 drop-shadow">
                              CYBERCUBE
                            </h2>
                            <div className="flex items-center gap-2 mt-1 relative z-10 bg-black/20 px-3 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                                <span className="font-mono-tech text-[10px] font-bold text-white tracking-widest">
                                  SOLVE COMPLETED
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col items-center gap-5">
                            {/* Cube Snapshot Preview */}
                            <div className={`w-full aspect-square rounded-2xl border p-1.5 relative overflow-hidden shadow-inner ${
                              isLight ? 'bg-slate-50 border-slate-200' : 'bg-black border-neutral-800'
                            }`}>
                                <div className="w-full h-full relative overflow-hidden rounded-xl">
                                    {solvedSnapshot ? (
                                        <img src={solvedSnapshot} alt="Solved Cube" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-mono-tech text-xs animate-pulse">
                                          PROCESSING SNAPSHOT...
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="w-full grid grid-cols-2 gap-3">
                                <div className={`p-3 rounded-xl border text-center ${
                                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-800/50 border-neutral-800'
                                }`}>
                                    <div className={`font-mono-tech text-[10px] uppercase mb-0.5 ${isLight ? 'text-slate-400' : 'text-stone-400'}`}>
                                      SOLVE TIME
                                    </div>
                                    <div className="font-tech text-2xl font-black text-orange-500">
                                      {getFinalTime()}
                                    </div>
                                </div>
                                <div className={`p-3 rounded-xl border text-center ${
                                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-800/50 border-neutral-800'
                                }`}>
                                    <div className={`font-mono-tech text-[10px] uppercase mb-0.5 ${isLight ? 'text-slate-400' : 'text-stone-400'}`}>
                                      RECORDED DATE
                                    </div>
                                    <div className={`font-tech text-base font-bold pt-1 ${isLight ? 'text-slate-700' : 'text-stone-200'}`}>
                                      {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="w-full flex justify-between items-center pt-1 border-t border-current/10">
                                <span className={`font-mono-tech text-[10px] ${isLight ? 'text-slate-400' : 'text-stone-400'}`}>
                                  ID: {ticketId}
                                </span>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <div key={i} className={`w-1 h-3 rounded-full ${isLight ? 'bg-slate-300' : 'bg-neutral-700'}`}></div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 w-full">
                                <button 
                                   onClick={handleDownload}
                                   className="flex-1 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-tech font-bold text-sm tracking-wider uppercase shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    DOWNLOAD TICKET
                                </button>
                                <button 
                                    onClick={handleExit}
                                    className={`px-5 py-3 rounded-xl font-tech font-bold text-sm uppercase transition-all ${
                                      isLight
                                        ? 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                                        : 'border border-neutral-700 text-stone-300 hover:bg-neutral-800'
                                    }`}
                                >
                                    CLOSE
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}
    </AnimatePresence>
  );
};
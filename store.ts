import { create } from 'zustand';

export type GameMode = 'HERO' | 'GAME';
export type ThemeType = 'TECH' | 'DEV' | 'NEON' | 'ANIME' | 'SKETCH';

export interface Move {
    axis: string;
    slice: number;
    dir: number;
}

interface AppState {
  // Theme & Appearance
  mode: GameMode;
  theme: ThemeType;
  colorMode: 'dark' | 'light';
  isSolved: boolean;
  orbitEnabled: boolean;
  
  // Navigation & Modals
  activeNav: string;
  activeModal: 'none' | 'learn' | 'stats' | 'login' | 'demo';
  bestTime: string;

  // Timer State
  gameStartTime: number | null;
  gameEndTime: number | null;
  isTimerRunning: boolean;

  // Snapshot
  solvedSnapshot: string | null;

  // Solver State
  currentHint: string | null;
  moveHistory: Move[];

  // View Sync
  cameraQuaternion: number[] | null;

  setMode: (mode: GameMode) => void;
  setTheme: (theme: ThemeType) => void;
  setColorMode: (colorMode: 'dark' | 'light') => void;
  toggleColorMode: () => void;
  setActiveNav: (nav: string) => void;
  setActiveModal: (modal: 'none' | 'learn' | 'stats' | 'login' | 'demo') => void;
  setBestTime: (time: string) => void;
  setIsSolved: (solved: boolean) => void;
  setOrbitEnabled: (enabled: boolean) => void;
  setSolvedSnapshot: (url: string | null) => void;
  setCurrentHint: (hint: string | null) => void;
  setCameraQuaternion: (quat: number[]) => void;
  
  // History Actions
  pushMove: (move: Move) => void;
  popMove: () => void;
  resetMoves: () => void;

  startGame: () => void;
  stopGame: () => void;
  resetGame: () => void;
}

export const useStore = create<AppState>((set) => ({
  mode: 'HERO',
  theme: 'TECH',
  colorMode: 'light',
  isSolved: false,
  orbitEnabled: true,
  
  activeNav: 'Home',
  activeModal: 'none',
  bestTime: '00:32.14',

  gameStartTime: null,
  gameEndTime: null,
  isTimerRunning: false,
  solvedSnapshot: null,
  currentHint: null,
  moveHistory: [],
  cameraQuaternion: null,

  setMode: (mode) => set({ mode }),
  setTheme: (theme) => set({ theme }),
  setColorMode: (colorMode) => set({ colorMode }),
  toggleColorMode: () => set((state) => ({ colorMode: state.colorMode === 'dark' ? 'light' : 'dark' })),
  setActiveNav: (activeNav) => set({ activeNav }),
  setActiveModal: (activeModal) => set({ activeModal }),
  setBestTime: (bestTime) => set({ bestTime }),
  setIsSolved: (isSolved) => set({ isSolved }),
  setOrbitEnabled: (orbitEnabled) => set({ orbitEnabled }),
  setSolvedSnapshot: (solvedSnapshot) => set({ solvedSnapshot }),
  setCurrentHint: (currentHint) => set({ currentHint }),
  setCameraQuaternion: (cameraQuaternion) => set({ cameraQuaternion }),
  
  pushMove: (move) => set((state) => ({ moveHistory: [...state.moveHistory, move] })),
  popMove: () => set((state) => {
      const newHistory = [...state.moveHistory];
      newHistory.pop();
      return { moveHistory: newHistory };
  }),
  resetMoves: () => set({ moveHistory: [] }),

  startGame: () => set((state) => {
    if (state.isTimerRunning) return {}; 
    return { isTimerRunning: true, gameStartTime: Date.now(), gameEndTime: null, isSolved: false, solvedSnapshot: null, currentHint: null };
  }),
  stopGame: () => set((state) => {
      if (!state.isTimerRunning) return {};
      const endTime = Date.now();
      let newBest = state.bestTime;
      if (state.gameStartTime) {
          const diff = endTime - state.gameStartTime;
          const m = Math.floor(diff / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          const ms = Math.floor((diff % 1000) / 10);
          const formatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
          if (!newBest || formatted < newBest) {
              newBest = formatted;
          }
      }
      return { isTimerRunning: false, gameEndTime: endTime, isSolved: true, bestTime: newBest };
  }),
  resetGame: () => set({ 
      isTimerRunning: false, 
      gameStartTime: null, 
      gameEndTime: null, 
      isSolved: false, 
      solvedSnapshot: null, 
      currentHint: null,
      moveHistory: [],
      cameraQuaternion: null
  }),
}));
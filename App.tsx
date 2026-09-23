import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { HeroOverlay } from './components/UI/HeroOverlay';
import { GameOverlay } from './components/UI/GameOverlay';
import { SceneContainer } from './components/3D/SceneContainer';
import { Loader } from '@react-three/drei';
import { useStore } from './store';

// Loading Screen
const CustomLoader = () => (
    <div className="absolute inset-0 bg-black flex items-center justify-center z-50">
        <div className="font-tech text-orange-500 animate-pulse text-xl tracking-[0.5em]">
            SYSTEM_BOOT...
        </div>
    </div>
);

function App() {
  const colorMode = useStore((state) => state.colorMode);
  const isLight = colorMode === 'light';

  return (
    <div className={`relative w-full min-h-screen transition-colors duration-500 overflow-x-hidden ${
      isLight 
        ? 'bg-[#f8fafc] text-slate-900 selection:bg-orange-500 selection:text-white' 
        : 'bg-[#08080a] text-slate-100 selection:bg-orange-500 selection:text-white'
    }`}>
      {/* 3D Scene - Fixed Background */}
      <div className="fixed inset-0 z-0">
        <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, toneMappingExposure: isLight ? 1.05 : 1.0 }}>
            <Suspense fallback={null}>
                <SceneContainer />
            </Suspense>
        </Canvas>
        <Loader 
          dataInterpolation={(p) => `LOADING ${p.toFixed(0)}%`} 
          containerStyles={{ background: isLight ? '#f1f5f9' : '#08080a' }} 
          innerStyles={{ width: '200px' }} 
          barStyles={{ height: '4px', background: '#ea580c' }} 
          dataStyles={{ fontFamily: 'Share Tech Mono', color: isLight ? '#334155' : '#ea580c' }} 
        />
      </div>

      {/* UI Layers */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-start pointer-events-none">
         <HeroOverlay />
      </div>

      <GameOverlay />
    </div>
  );
}

export default App;
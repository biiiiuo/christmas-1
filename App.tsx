import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import Scene from './components/Scene';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-black">
      {/* Cinematic UI Overlay */}
      <div className="absolute top-0 left-0 w-full z-10 p-8 pointer-events-none flex justify-between items-start text-[#FFD700] mix-blend-screen">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-widest drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" style={{ fontFamily: '"Cinzel", serif' }}>
            2025
          </h1>
          <h2 className="text-2xl md:text-4xl mt-2 tracking-wide text-emerald-400 drop-shadow-[0_0_8px_rgba(4,99,7,0.8)]" style={{ fontFamily: '"Mountains of Christmas", serif' }}>
            Christmas Celebration
          </h2>
        </div>
        <div className="text-right opacity-80">
          <p className="text-sm md:text-lg tracking-widest uppercase">4K High Fidelity</p>
          <p className="text-xs text-orange-300 mt-1">Biu～❤️ Production</p>
        </div>
      </div>

      {/* 3D Scene */}
      <Canvas
        shadows
        dpr={[1, 2]} // Support high DPI for 4K feel
        camera={{ position: [0, 5, 25], fov: 45, near: 0.1, far: 200 }}
        gl={{ 
          antialias: false, // Let post-processing handle AA or keep it raw for crispness with high DPR
          stencil: false,
          depth: true,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <Loader 
        containerStyles={{ background: '#050505' }} 
        innerStyles={{ background: '#046307', width: '200px' }} 
        barStyles={{ background: '#FFD700', height: '5px' }} 
        dataStyles={{ fontFamily: 'Cinzel', color: '#FFD700' }}
      />
    </div>
  );
};

export default App;
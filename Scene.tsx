import React from 'react';
import { OrbitControls, Stars, Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import ChristmasTree from './ChristmasTree';
import Campfire from './Campfire';
import DancingCats from './DancingCats';

const Scene: React.FC = () => {
  return (
    <>
      {/* --- Environment & Lighting --- */}
      <color attach="background" args={['#020205']} />
      <fog attach="fog" args={['#020205', 10, 60]} />
      
      {/* Moon/Ambient Light */}
      <ambientLight intensity={0.15} color="#4c5c70" />
      
      {/* Directional Light for Moon Shadows */}
      <directionalLight 
        position={[-10, 20, -10]} 
        intensity={0.8} 
        color="#aaccff" 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />

      {/* HDRI for realistic reflections on Gold */}
      <Environment preset="night" blur={0.6} />

      {/* --- Objects --- */}
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#080808" 
          roughness={0.4} 
          metalness={0.2} 
        />
      </mesh>

      {/* Left: The Luxurious Christmas Tree */}
      <group position={[-8, 0, 0]} rotation={[0, Math.PI / 6, 0]}>
        <ChristmasTree />
        {/* Spotlight specifically for the tree to make gold pop */}
        <spotLight 
          position={[5, 15, 10]} 
          angle={0.4} 
          penumbra={0.5} 
          intensity={20} 
          color="#fff5cc" 
          castShadow
        />
      </group>

      {/* Right: The Fire & Cats */}
      <group position={[8, 0, 2]}>
        <Campfire />
        <DancingCats radius={5} count={4} />
      </group>

      {/* --- Post Processing for Cinematic Look --- */}
      <EffectComposer disableNormalPass>
        {/* Bloom for the glowy lights and fire */}
        <Bloom 
          luminanceThreshold={0.8} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.4}
        />
        {/* Cinematic Vignette */}
        <Vignette offset={0.3} darkness={0.6} eskil={false} />
        {/* Tone Mapping for high dynamic range handling */}
        <ToneMapping 
            adaptive={true} 
            resolution={256} 
            middleGrey={0.6} 
            maxLuminance={16.0} 
            averageLuminance={1.0} 
            adaptationRate={1.0} 
        />
      </EffectComposer>

      {/* Controls */}
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={10}
        maxDistance={40}
        target={[0, 2, 0]}
      />
    </>
  );
};

export default Scene;
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Instance, Instances } from '@react-three/drei';

const FireParticle: React.FC<{ speed: number; offset: number }> = ({ speed, offset }) => {
  const ref = useRef<any>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed + offset;
      // Move up
      const yBase = (t % 1) * 3; 
      
      // Wiggle
      const x = Math.sin(t * 5) * 0.3 * (1 - yBase/3);
      const z = Math.cos(t * 3) * 0.3 * (1 - yBase/3);
      
      ref.current.position.set(x, yBase, z);
      
      // Scale down as it goes up
      const scale = 1 - (yBase / 3);
      ref.current.scale.setScalar(Math.max(0, scale));

      // Color shift logic is handled in the material or simplified here by scaling
      // Ideally we use a custom shader, but for primitives:
      // We rely on the parent Instances color or post-processing bloom
    }
  });

  return <Instance />;
};

const Campfire: React.FC = () => {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      // Flicker effect
      const t = clock.getElapsedTime();
      lightRef.current.intensity = 15 + Math.sin(t * 10) * 5 + Math.sin(t * 23) * 5;
      lightRef.current.position.y = 1 + Math.sin(t * 15) * 0.1;
    }
  });

  // Wood Logs
  const logs = useMemo(() => {
    return [0, 60, 120].map((deg, i) => (
      <mesh key={i} rotation={[Math.PI / 2.5, 0, (deg * Math.PI) / 180]} position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 2.5, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={0.9} />
      </mesh>
    ));
  }, []);

  return (
    <group>
      {/* Logs */}
      <group position={[0, 0.1, 0]}>
        {logs}
      </group>

      {/* Fire Particles */}
      <group position={[0, 0.5, 0]}>
         {/* Core (Red/Hot) */}
        <Instances range={20}>
          <dodecahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial 
            color="#ff4400" 
            emissive="#ff2200" 
            emissiveIntensity={4} 
            toneMapped={false}
            transparent
            opacity={0.9}
          />
          {Array.from({ length: 15 }).map((_, i) => (
            <FireParticle key={i} speed={1.5} offset={i} />
          ))}
        </Instances>

        {/* Outer Flame (Orange/Yellow) */}
        <Instances range={20}>
          <dodecahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial 
            color="#ffaa00" 
            emissive="#ffaa00" 
            emissiveIntensity={3} 
            toneMapped={false} 
          />
          {Array.from({ length: 15 }).map((_, i) => (
            <FireParticle key={i} speed={2} offset={i + 10} />
          ))}
        </Instances>
      </group>

      {/* Dynamic Light Source */}
      <pointLight 
        ref={lightRef} 
        color="#ffaa00" 
        distance={15} 
        decay={2}
        castShadow 
        shadow-bias={-0.001}
      />
    </group>
  );
};

export default Campfire;
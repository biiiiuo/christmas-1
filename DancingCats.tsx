import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CatProps } from '../types';

// Reusable Materials
const blackFur = new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.6 });
const whiteFur = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5 });
const pinkSkin = new THREE.MeshStandardMaterial({ color: '#ffb6c1' });

const CowCat: React.FC<CatProps> = ({ position, rotation, animationOffset }) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + animationOffset;
    
    // Jump/Bounce
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.abs(Math.sin(t * 8)) * 0.5;
    }

    // Head Bob
    if (headRef.current) {
      headRef.current.rotation.x = Math.sin(t * 8) * 0.1;
      headRef.current.rotation.z = Math.cos(t * 4) * 0.1;
    }

    // Body Squish/Stretch
    if (bodyRef.current) {
        const scaleY = 1 + Math.sin(t * 16) * 0.05;
        bodyRef.current.scale.set(1, scaleY, 1);
    }

    // Tail Wag
    if (tailRef.current) {
        tailRef.current.rotation.z = Math.sin(t * 10) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* --- Body Group --- */}
      <group ref={bodyRef}>
        {/* Main Body (Black Back) */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <capsuleGeometry args={[0.4, 0.5, 4, 8]} />
          <primitive object={blackFur} />
        </mesh>
        
        {/* Belly (White patch) */}
        <mesh position={[0, 0.5, 0.25]} scale={[0.8, 0.7, 0.5]} receiveShadow>
            <sphereGeometry args={[0.4, 16, 16]} />
            <primitive object={whiteFur} />
        </mesh>
      </group>

      {/* --- Head Group --- */}
      <group ref={headRef} position={[0, 1.3, 0.1]}>
        {/* Main Head (Black) */}
        <mesh castShadow>
          <sphereGeometry args={[0.35, 32, 32]} />
          <primitive object={blackFur} />
        </mesh>

        {/* Face Mask (White) - Creates the "Natural Arc" under eye socket */}
        {/* We position a white sphere slightly forward and down to mask the mouth/nose area up to eyes */}
        <mesh position={[0, -0.1, 0.15]} scale={[0.85, 0.7, 0.5]}>
          <sphereGeometry args={[0.36, 32, 32]} />
          <primitive object={whiteFur} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.2, 0.3, 0]} rotation={[0, 0, 0.5]}>
          <coneGeometry args={[0.1, 0.2, 16]} />
          <primitive object={blackFur} />
        </mesh>
        <mesh position={[0.2, 0.3, 0]} rotation={[0, 0, -0.5]}>
          <coneGeometry args={[0.1, 0.2, 16]} />
          <primitive object={blackFur} />
        </mesh>
        
        {/* Eyes (Simple glowing dots for cuteness) */}
        <mesh position={[-0.12, 0.05, 0.3]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="black" />
        </mesh>
        <mesh position={[0.12, 0.05, 0.3]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="black" />
        </mesh>

        {/* Pink Nose */}
        <mesh position={[0, -0.05, 0.35]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <primitive object={pinkSkin} />
        </mesh>
      </group>

      {/* --- Tail --- */}
      <group position={[0, 0.4, -0.3]}>
          <mesh ref={tailRef} position={[0, 0.3, -0.1]} rotation={[-0.5, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.02, 0.6, 8]} />
            <primitive object={blackFur} />
          </mesh>
      </group>
    </group>
  );
};

const DancingCats: React.FC<{ radius: number; count: number }> = ({ radius, count }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    // Rotate the entire group around the fire
    if (groupRef.current) {
        groupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  const cats = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      // Face the center (fire is at 0,0 relative to this group)
      const rotation: [number, number, number] = [0, angle + Math.PI, 0];
      
      return (
        <CowCat 
          key={i} 
          position={[x, 0, z]} 
          rotation={rotation}
          animationOffset={i * 1.5} // Staggered jumping
        />
      );
    });
  }, [count, radius]);

  return (
    <group ref={groupRef}>
      {cats}
    </group>
  );
};

export default DancingCats;
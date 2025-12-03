import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere, Cylinder, Torus, Octahedron } from '@react-three/drei';

// Materials
const emeraldMaterial = new THREE.MeshStandardMaterial({
  color: '#046307',
  roughness: 0.7,
  metalness: 0.1,
});

const goldMaterial = new THREE.MeshStandardMaterial({
  color: '#FFD700',
  roughness: 0.1,
  metalness: 1, // High metalness for luxury
  emissive: '#AA6600',
  emissiveIntensity: 0.1,
});

const silverMaterial = new THREE.MeshStandardMaterial({
  color: '#EEEEFF',
  roughness: 0.2,
  metalness: 0.9,
});

const TreeLevel: React.FC<{ 
  position: [number, number, number]; 
  scale: number; 
  radius: number;
  height: number 
}> = ({ position, scale, radius, height }) => {
  return (
    <mesh position={position} castShadow receiveShadow material={emeraldMaterial}>
      <coneGeometry args={[radius, height, 32]} />
    </mesh>
  );
};

const Ornament: React.FC<{ position: [number, number, number]; type: 'gold' | 'silver' }> = ({ position, type }) => {
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[0.25, 16, 16]} />
      <primitive object={type === 'gold' ? goldMaterial : silverMaterial} />
    </mesh>
  );
};

const TwinklingLight: React.FC<{ position: [number, number, number]; color: string; speed: number }> = ({ position, color, speed }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      // Complex flickering
      const intensity = 1.5 + Math.sin(t * speed) + Math.cos(t * speed * 2.5) * 0.5;
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = Math.max(0, intensity);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.12, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
    </mesh>
  );
};

const ChristmasTree: React.FC = () => {
  // Generate procedural decoration positions
  const decorations = useMemo(() => {
    const items = [];
    const levels = 4;
    
    for (let l = 0; l < levels; l++) {
      const levelY = l * 2.5;
      const baseRadius = 4 - l * 0.9;
      const count = 12 - l * 2;
      
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const radius = baseRadius * 0.9; // Slightly inset
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const y = levelY + 1 - (l * 0.2); // Adjust y slightly per level
        
        // Randomly assign ornament or light
        const r = Math.random();
        if (r > 0.6) {
          items.push(<Ornament key={`orn-${l}-${i}`} position={[x, y, z]} type={Math.random() > 0.3 ? 'gold' : 'silver'} />);
        } else {
           // Warm warm lights + some colorful ones
           const colors = ['#ffaa00', '#ffaa00', '#ff0000', '#00ff00', '#0044ff'];
           const color = colors[Math.floor(Math.random() * colors.length)];
           items.push(<TwinklingLight key={`light-${l}-${i}`} position={[x, y, z]} color={color} speed={2 + Math.random() * 5} />);
        }
      }
    }
    return items;
  }, []);

  return (
    <group>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1.2, 3, 16]} />
        <meshStandardMaterial color="#3e2723" />
      </mesh>

      {/* Levels */}
      <TreeLevel position={[0, 2.5, 0]} scale={1} radius={4} height={4} />
      <TreeLevel position={[0, 4.5, 0]} scale={0.8} radius={3} height={3.5} />
      <TreeLevel position={[0, 6.5, 0]} scale={0.6} radius={2} height={3} />
      <TreeLevel position={[0, 8.2, 0]} scale={0.4} radius={1} height={2.5} />

      {/* Luxury Garlands (Gold Torus rings approximating tinsel) */}
      <mesh position={[0, 3, 0]} rotation={[0.1, 0, 0.1]}>
        <torusGeometry args={[3.2, 0.1, 8, 50]} />
        <primitive object={goldMaterial} />
      </mesh>
      <mesh position={[0, 5, 0]} rotation={[-0.1, 0, -0.1]}>
        <torusGeometry args={[2.2, 0.1, 8, 50]} />
        <primitive object={goldMaterial} />
      </mesh>

      {/* Decorations */}
      {decorations}

      {/* Top Star */}
      <group position={[0, 9.8, 0]}>
        <mesh castShadow>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial 
            color="#FFD700" 
            emissive="#FFD700" 
            emissiveIntensity={2} 
            metalness={1} 
            roughness={0} 
            toneMapped={false}
          />
        </mesh>
        {/* Glow halo for star */}
        <pointLight intensity={5} distance={5} color="#FFD700" />
      </group>

      {/* Tree Ambient Glow */}
      <pointLight position={[0, 5, 2]} intensity={2} color="#046307" distance={10} />
    </group>
  );
};

export default ChristmasTree;
import React, { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Mesh } from 'three';

interface Planet3DProps {
  modelPath: string;
  scale?: number;
  rotationSpeed?: number;
  position?: [number, number, number];
  unlocked?: boolean;
  planetStyle?: {
    background: string;
    gradient: string;
    pattern: string;
    glow: string;
  };
}

// Separate component for the actual 3D model
const PlanetModel: React.FC<{
  modelPath: string;
  scale: number;
  rotationSpeed: number;
  unlocked: boolean;
  position: [number, number, number];
}> = ({ modelPath, scale, rotationSpeed, unlocked, position }) => {
  const meshRef = useRef<Mesh>(null);
  
  console.log('PlanetModel loading:', { modelPath, unlocked });
  
  try {
    const { scene } = useGLTF(modelPath);
    
    useFrame((_, delta) => {
      if (meshRef.current && unlocked) {
        // Use delta time for ultra-smooth horizontal rotation
        const rotationAmount = rotationSpeed * delta * 60; // Normalize to 60fps
        meshRef.current.rotation.y += rotationAmount;
        
        // Keep rotation values in a reasonable range to prevent precision issues
        if (meshRef.current.rotation.y > Math.PI * 2) {
          meshRef.current.rotation.y -= Math.PI * 2;
        }
      }
    });

    if (!unlocked) {
      return (
        <mesh position={position} ref={meshRef}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color="#333333" 
            transparent 
            opacity={0.3}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      );
    }

    return (
      <group position={position}>
        <primitive 
          ref={meshRef}
          object={scene.clone()} 
          scale={scale}
        />
      </group>
    );
  } catch (error) {
    console.error('Error loading GLB model:', error);
    // Fallback to a simple sphere
    return (
      <mesh position={position}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>
    );
  }
};

const Planet3D: React.FC<Planet3DProps> = ({ 
  modelPath, 
  scale = 1, 
  rotationSpeed = 0.01,
  position = [0, 0, 0],
  unlocked = true
}) => {
  return (
    <Suspense fallback={
      <mesh position={position}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
    }>
      <PlanetModel
        modelPath={modelPath}
        scale={scale}
        rotationSpeed={rotationSpeed}
        unlocked={unlocked}
        position={position}
      />
      {/* Enhanced lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[2, 2, 2]} intensity={0.3} color="#ffffff" />
    </Suspense>
  );
};

export default Planet3D;

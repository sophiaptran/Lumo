import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import Planet3D from './Planet3D';

// Preload the GLB models
useGLTF.preload('./models/planet.glb');
useGLTF.preload('./models/planets2.glb');
useGLTF.preload('./models/planets3.glb');
useGLTF.preload('./models/planets4.glb');
useGLTF.preload('./models/planets5.glb');
useGLTF.preload('./models/planets6.glb');
useGLTF.preload('./models/planets7.glb');
useGLTF.preload('./models/planets8.glb');

interface PlanetCanvasProps {
  modelPath: string;
  scale?: number;
  rotationSpeed?: number;
  unlocked?: boolean;
  planetStyle?: {
    background: string;
    gradient: string;
    pattern: string;
    glow: string;
  };
  className?: string;
}

// Fallback component for when GLB fails to load
const FallbackPlanet: React.FC<{ unlocked: boolean; planetStyle?: any }> = ({ unlocked, planetStyle }) => {
  if (!unlocked) {
    return (
      <div className="w-full h-full rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
        <span className="text-white/50 text-2xl">🔒</span>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full rounded-full relative overflow-hidden"
      style={{
        background: planetStyle?.background || 'linear-gradient(135deg, #8B7355 0%, #A0522D 50%, #654321 100%)',
        boxShadow: `0 0 20px ${planetStyle?.glow || 'rgba(139, 115, 85, 0.3)'}`,
        transform: 'perspective(1000px) rotateX(15deg)',
      }}
    >
      <div 
        className="absolute inset-0 rounded-full opacity-50"
        style={{ background: planetStyle?.gradient || 'radial-gradient(circle at 30% 30%, #D2B48C 0%, transparent 50%)' }}
      />
      <div 
        className="absolute inset-0 rounded-full opacity-30"
        style={{ background: planetStyle?.pattern || 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 1px, transparent 1px)' }}
      />
      <div 
        className="absolute top-2 left-4 w-6 h-6 rounded-full opacity-60"
        style={{ 
          background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
          filter: 'blur(1px)'
        }}
      />
    </div>
  );
};

const PlanetCanvas: React.FC<PlanetCanvasProps> = ({ 
  modelPath, 
  scale = 1, 
  rotationSpeed = 0.01,
  unlocked = true,
  planetStyle,
  className = "w-20 h-20"
}) => {
  const [hasError, setHasError] = useState(false);


  if (hasError) {
    return (
      <div className={className}>
        <FallbackPlanet unlocked={unlocked} planetStyle={planetStyle} />
      </div>
    );
  }

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ background: 'transparent' }}
        onError={(error) => {
          console.error('Canvas error:', error);
          setHasError(true);
        }}
        gl={{ antialias: true, alpha: true }}
      >
        <Planet3D
          modelPath={modelPath}
          scale={scale}
          rotationSpeed={rotationSpeed}
          unlocked={unlocked}
          planetStyle={planetStyle}
        />
      </Canvas>
    </div>
  );
};

export default PlanetCanvas;

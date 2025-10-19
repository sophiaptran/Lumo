import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lock } from 'lucide-react';
import { BackgroundBeams } from '@/components/ui/background-beams';
import PlanetCanvas from '@/components/ui/PlanetCanvas';

interface PlanetBadge {
  id: string;
  name: string;
  description: string;
  requiredStreak: number;
  category: 'rock' | 'plant' | 'celestial' | 'cosmic';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedDate?: string;
  modelPath: string;
  planetStyle: {
    background: string;
    gradient: string;
    pattern: string;
    glow: string;
  };
}

const PLANET_BADGES: PlanetBadge[] = [
  // Rock Category - Rocky planets
  {
    id: 'pebble',
    name: 'Pebble Planet',
    description: 'Your first step on the journey',
    requiredStreak: 1,
    category: 'rock',
    rarity: 'common',
    unlocked: true,
    modelPath: './models/planet.glb',
    planetStyle: {
      background: 'linear-gradient(135deg, #8B7355 0%, #A0522D 50%, #654321 100%)',
      gradient: 'radial-gradient(circle at 30% 30%, #D2B48C 0%, transparent 50%)',
      pattern: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 1px, transparent 1px)',
      glow: 'shadow-gray-400/30'
    }
  },
  {
    id: 'stone',
    name: 'Stone World',
    description: 'Building momentum',
    requiredStreak: 3,
    category: 'rock',
    rarity: 'common',
    unlocked: true,
    modelPath: './models/planets2.glb',
    planetStyle: {
      background: 'linear-gradient(135deg, #696969 0%, #2F4F4F 50%, #1C1C1C 100%)',
      gradient: 'radial-gradient(circle at 30% 30%, #708090 0%, transparent 50%)',
      pattern: 'radial-gradient(circle at 15% 15%, rgba(255,255,255,0.15) 2px, transparent 2px)',
      glow: 'shadow-gray-500/30'
    }
  },
  {
    id: 'boulder',
    name: 'Boulder Sphere',
    description: 'A week of consistency',
    requiredStreak: 7,
    category: 'rock',
    rarity: 'uncommon',
    unlocked: true,
    modelPath: './models/planets3.glb',
    planetStyle: {
      background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 30%, #654321 70%, #2F1B14 100%)',
      gradient: 'radial-gradient(circle at 25% 25%, #CD853F 0%, transparent 60%)',
      pattern: 'radial-gradient(circle at 10% 10%, rgba(255,255,255,0.2) 3px, transparent 3px)',
      glow: 'shadow-orange-400/40'
    }
  },

  // Plant Category - Earth-like planets
  {
    id: 'seed',
    name: 'Seed World',
    description: 'Growth begins',
    requiredStreak: 14,
    category: 'plant',
    rarity: 'uncommon',
    unlocked: false,
    modelPath: './models/planets4.glb',
    planetStyle: {
      background: 'linear-gradient(135deg, #228B22 0%, #32CD32 30%, #006400 70%, #004225 100%)',
      gradient: 'radial-gradient(circle at 30% 30%, #90EE90 0%, transparent 50%)',
      pattern: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 2px, transparent 2px)',
      glow: 'shadow-green-400/40'
    }
  },
  {
    id: 'sprout',
    name: 'Sprout Sphere',
    description: 'Breaking through',
    requiredStreak: 21,
    category: 'plant',
    rarity: 'uncommon',
    unlocked: false,
    modelPath: './models/planets5.glb',
    planetStyle: {
      background: 'linear-gradient(135deg, #00FF7F 0%, #32CD32 30%, #228B22 70%, #006400 100%)',
      gradient: 'radial-gradient(circle at 30% 30%, #98FB98 0%, transparent 50%)',
      pattern: 'radial-gradient(circle at 15% 15%, rgba(255,255,255,0.15) 2px, transparent 2px)',
      glow: 'shadow-green-300/50'
    }
  },
  {
    id: 'earth',
    name: 'Earth Twin',
    description: 'A month of dedication',
    requiredStreak: 30,
    category: 'plant',
    rarity: 'rare',
    unlocked: false,
    modelPath: './models/planets6.glb',
    planetStyle: {
      background: 'linear-gradient(135deg, #4169E1 0%, #32CD32 30%, #8B4513 60%, #2F4F4F 100%)',
      gradient: 'radial-gradient(circle at 30% 30%, #87CEEB 0%, transparent 50%)',
      pattern: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2) 1px, transparent 1px)',
      glow: 'shadow-blue-400/50'
    }
  },

  // Celestial Category - Gas giants
  {
    id: 'jupiter',
    name: 'Jupiter Giant',
    description: 'Two months of mastery',
    requiredStreak: 60,
    category: 'celestial',
    rarity: 'rare',
    unlocked: false,
    modelPath: './models/planets7.glb',
    planetStyle: {
      background: 'linear-gradient(135deg, #D2691E 0%, #CD853F 30%, #A0522D 60%, #8B4513 100%)',
      gradient: 'radial-gradient(circle at 30% 30%, #F4A460 0%, transparent 50%)',
      pattern: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
      glow: 'shadow-orange-500/60'
    }
  },
  {
    id: 'saturn',
    name: 'Saturn Lord',
    description: 'Three months of brilliance',
    requiredStreak: 90,
    category: 'celestial',
    rarity: 'epic',
    unlocked: false,
    modelPath: './models/planets2.glb',
    planetStyle: {
      background: 'linear-gradient(135deg, #F0E68C 0%, #DAA520 30%, #B8860B 60%, #8B7355 100%)',
      gradient: 'radial-gradient(circle at 30% 30%, #FFD700 0%, transparent 50%)',
      pattern: 'linear-gradient(90deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.15) 100%)',
      glow: 'shadow-yellow-400/60'
    }
  },
  {
    id: 'neptune',
    name: 'Neptune King',
    description: 'Six months of excellence',
    requiredStreak: 180,
    category: 'celestial',
    rarity: 'epic',
    unlocked: false,
    modelPath: './models/planets3.glb',
    planetStyle: {
      background: 'linear-gradient(135deg, #4169E1 0%, #1E90FF 30%, #0000CD 60%, #191970 100%)',
      gradient: 'radial-gradient(circle at 30% 30%, #87CEEB 0%, transparent 50%)',
      pattern: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2) 2px, transparent 2px)',
      glow: 'shadow-blue-500/70'
    }
  },

  // Cosmic Category - Stars and exotic worlds
  {
    id: 'sun',
    name: 'Solar Star',
    description: 'One year of legendary dedication',
    requiredStreak: 365,
    category: 'cosmic',
    rarity: 'legendary',
    unlocked: false,
    modelPath: './models/planet.glb',
    planetStyle: {
      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 30%, #FF4500 60%, #DC143C 100%)',
      gradient: 'radial-gradient(circle at 30% 30%, #FFFF00 0%, transparent 50%)',
      pattern: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 3px, transparent 3px)',
      glow: 'shadow-yellow-300/80'
    }
  },
  {
    id: 'nebula',
    name: 'Nebula Dream',
    description: 'Two years of cosmic achievement',
    requiredStreak: 730,
    category: 'cosmic',
    rarity: 'legendary',
    unlocked: false,
    modelPath: './models/planets2.glb',
    planetStyle: {
      background: 'linear-gradient(135deg, #8A2BE2 0%, #FF1493 30%, #00BFFF 60%, #4B0082 100%)',
      gradient: 'radial-gradient(circle at 30% 30%, #FF69B4 0%, transparent 50%)',
      pattern: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 2px, transparent 2px)',
      glow: 'shadow-purple-400/80'
    }
  },
  {
    id: 'galaxy',
    name: 'Galactic Core',
    description: 'Five years of universal mastery',
    requiredStreak: 1825,
    category: 'cosmic',
    rarity: 'legendary',
    unlocked: false,
    modelPath: './models/planets3.glb',
    planetStyle: {
      background: 'linear-gradient(135deg, #000000 0%, #4B0082 30%, #8A2BE2 60%, #FF1493 100%)',
      gradient: 'radial-gradient(circle at 30% 30%, #FFD700 0%, transparent 50%)',
      pattern: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5) 1px, transparent 1px)',
      glow: 'shadow-yellow-200/90'
    }
  }
];

const PlanetBadgesPage: React.FC = () => {
  const [badges, setBadges] = useState<PlanetBadge[]>(PLANET_BADGES);
  const [currentStreak, setCurrentStreak] = useState(89);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetBadge | null>(null);

  useEffect(() => {
    // Load streak data and update badge status
    const savedData = localStorage.getItem('streakData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setCurrentStreak(parsed.currentStreak);
      
      // Update badge unlock status based on streak
      setBadges(prevBadges => 
        prevBadges.map((badge) => ({
          ...badge,
          unlocked: badge.requiredStreak <= parsed.currentStreak,
          unlockedDate: badge.requiredStreak <= parsed.currentStreak && !badge.unlockedDate 
            ? new Date().toISOString() 
            : badge.unlockedDate
        }))
      );
    } else {
      // If no saved data, use the current streak to determine unlocks
      setBadges(prevBadges => 
        prevBadges.map((badge) => ({
          ...badge,
          unlocked: badge.requiredStreak <= currentStreak,
          unlockedDate: badge.requiredStreak <= currentStreak && !badge.unlockedDate 
            ? new Date().toISOString() 
            : badge.unlockedDate
        }))
      );
    }
    setIsLoading(false);
  }, []);

  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);
  const nextBadge = badges.find(badge => badge.requiredStreak > currentStreak);
  
  console.log('Badges state:', badges.slice(0, 3).map(b => ({ name: b.name, unlocked: b.unlocked, modelPath: b.modelPath })));

  const getRarityColor = (rarity: PlanetBadge['rarity']): string => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityGlow = (rarity: PlanetBadge['rarity']): string => {
    switch (rarity) {
      case 'common': return 'shadow-gray-400/20';
      case 'uncommon': return 'shadow-green-400/20';
      case 'rare': return 'shadow-blue-400/20';
      case 'epic': return 'shadow-purple-400/20';
      case 'legendary': return 'shadow-yellow-400/20';
      default: return 'shadow-gray-400/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="relative z-10">
      <BackgroundBeams />
      <div className="container mx-auto px-4 pt-6 pb-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-white tracking-wide mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Planet Collection
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-light">
            Collect planets as you build your streak. From rocky worlds to cosmic legends.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
        >
          <div className="bg-blue-900/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-800/30 text-center shadow-lg">
            <h3 className="text-2xl font-light text-white mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {unlockedBadges.length}
            </h3>
            <p className="text-white/60">Planets Discovered</p>
          </div>

          <div className="bg-blue-900/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-800/30 text-center shadow-lg">
            <h3 className="text-2xl font-light text-white mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {currentStreak}
            </h3>
            <p className="text-white/60">Current Streak</p>
          </div>

          <div className="bg-blue-900/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-800/30 text-center shadow-lg">
            <h3 className="text-2xl font-light text-white mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {nextBadge ? nextBadge.requiredStreak - currentStreak : 0}
            </h3>
            <p className="text-white/60">Days to Next Planet</p>
          </div>
        </motion.div>

        {/* Next Badge Preview */}
        {nextBadge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="bg-blue-900/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-800/30 shadow-lg">
              <h3 className="text-xl font-light text-white mb-4 text-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Next Discovery
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-full border border-purple-500/30">
                    <Lock className="w-12 h-12 text-purple-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-white mb-1">{nextBadge.name}</h4>
                  <p className="text-white/60 text-sm mb-2">{nextBadge.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((currentStreak / nextBadge.requiredStreak) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-white/60 text-sm">
                      {currentStreak}/{nextBadge.requiredStreak}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Planet Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <h3 className="text-2xl font-light text-white mb-6 text-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Planet Collection
          </h3>
          
          <div className="grid grid-cols-4 gap-6">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                onClick={() => setSelectedPlanet(badge)}
                className={`
                  relative bg-blue-900/20 backdrop-blur-lg rounded-2xl p-4 border transition-all duration-300 shadow-lg cursor-pointer
                  ${badge.unlocked 
                    ? 'border-blue-800/30 hover:border-blue-700/50 hover:shadow-xl hover:shadow-blue-500/20 hover:bg-blue-900/30' 
                    : 'border-blue-800/20 opacity-50 hover:opacity-60'
                  }
                `}
              >
                {/* 3D Rotating Planet */}
                <div className="text-center mb-4">
                  <div className="relative mx-auto w-20 h-20 group">
                    <PlanetCanvas
                      modelPath={badge.modelPath}
                      scale={1.0}
                      rotationSpeed={0.01}
                      unlocked={badge.unlocked}
                      planetStyle={badge.planetStyle}
                      className="w-20 h-20 transition-all duration-300 group-hover:scale-125 group-hover:brightness-125"
                    />
                    {/* Lock Icon Overlay */}
                    {!badge.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full transition-all duration-300 group-hover:bg-black/30">
                        <Lock className="w-6 h-6 text-white/70 transition-all duration-300 group-hover:text-white/90" />
                      </div>
                    )}
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                         style={{
                           background: `radial-gradient(circle, ${badge.planetStyle.glow.replace('shadow-', '').replace('/30', '')} 0%, transparent 70%)`,
                           filter: 'blur(8px)',
                           transform: 'scale(1.2)'
                         }}
                    />
                  </div>
                </div>

                {/* Badge Info */}
                <div className="text-center">
                  <h4 className={`
                    text-sm font-medium mb-1
                    ${badge.unlocked ? 'text-white' : 'text-white/50'}
                  `}>
                    {badge.name}
                  </h4>
                  <p className={`
                    text-xs mb-2
                    ${badge.unlocked ? 'text-white/60' : 'text-white/30'}
                  `}>
                    {badge.description}
                  </p>
                  
                  {/* Rarity */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className={`text-xs ${getRarityColor(badge.rarity)}`}>
                      {badge.rarity}
                    </span>
                  </div>
                  
                  {/* Streak Requirement */}
                  <div className="text-xs text-white/40">
                    {badge.requiredStreak} day{badge.requiredStreak !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Rarity Glow Effect */}
                {badge.unlocked && (
                  <div className={`
                    absolute inset-0 rounded-2xl opacity-20 pointer-events-none
                    ${getRarityGlow(badge.rarity)}
                  `} />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Planet Popup Modal */}
      {selectedPlanet && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPlanet(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-blue-900/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-800/30 shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPlanet(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Planet Display */}
            <div className="text-center mb-6">
              <div className="relative mx-auto w-32 h-32 mb-4">
                <PlanetCanvas
                  modelPath={selectedPlanet.modelPath}
                  scale={1.2}
                  rotationSpeed={0.02}
                  unlocked={selectedPlanet.unlocked}
                  planetStyle={selectedPlanet.planetStyle}
                  className="w-32 h-32"
                />
                {!selectedPlanet.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <Lock className="w-10 h-10 text-white/70" />
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl font-light text-white mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                {selectedPlanet.name}
              </h2>
              <p className="text-white/60 mb-4">{selectedPlanet.description}</p>
            </div>

            {/* Planet Details */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Category:</span>
                <span className="text-white capitalize">{selectedPlanet.category}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/60">Rarity:</span>
                <span className={`capitalize ${getRarityColor(selectedPlanet.rarity)}`}>
                  {selectedPlanet.rarity}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/60">Required Streak:</span>
                <span className="text-white">{selectedPlanet.requiredStreak} days</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/60">Status:</span>
                <span className={selectedPlanet.unlocked ? 'text-green-400' : 'text-red-400'}>
                  {selectedPlanet.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            </div>

            {/* Progress Bar for Locked Planets */}
            {!selectedPlanet.unlocked && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60 text-sm">Progress:</span>
                  <span className="text-white/60 text-sm">
                    {currentStreak}/{selectedPlanet.requiredStreak}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((currentStreak / selectedPlanet.requiredStreak) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PlanetBadgesPage;

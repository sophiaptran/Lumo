import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, CheckCircle, Target } from 'lucide-react';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Badge, BADGE_PROGRESSION, getRarityColor, getRarityGlow, getNextBadge } from '../types/badges';

const BadgesPage: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>(BADGE_PROGRESSION);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load streak data and update badge status
    const savedData = localStorage.getItem('streakData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setCurrentStreak(parsed.currentStreak);
      
      // Update badge unlock status
      setBadges(prevBadges => 
        prevBadges.map(badge => ({
          ...badge,
          unlocked: badge.requiredStreak <= parsed.currentStreak,
          unlockedDate: badge.requiredStreak <= parsed.currentStreak && !badge.unlockedDate 
            ? new Date().toISOString() 
            : badge.unlockedDate
        }))
      );
    }
    setIsLoading(false);
  }, []);

  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);
  const nextBadge = getNextBadge(currentStreak);

  const getCategoryIcon = (category: Badge['category']) => {
    switch (category) {
      case 'rock': return '🪨';
      case 'plant': return '🌱';
      case 'celestial': return '🌙';
      case 'cosmic': return '⭐';
      default: return '🏆';
    }
  };

  const getCategoryColor = (category: Badge['category']) => {
    switch (category) {
      case 'rock': return 'from-gray-500 to-gray-700';
      case 'plant': return 'from-green-500 to-green-700';
      case 'celestial': return 'from-blue-500 to-purple-600';
      case 'cosmic': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-500 to-gray-700';
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <BackgroundBeams />
      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-6xl font-light text-white tracking-wide" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Badge Collection
            </h1>
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-light">
            Collect badges as you build your streak. From humble rocks to cosmic legends.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
        >
          <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-2xl font-light text-white mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {unlockedBadges.length}
            </h3>
            <p className="text-white/60">Badges Earned</p>
          </div>

          <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-2xl font-light text-white mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {currentStreak}
            </h3>
            <p className="text-white/60">Current Streak</p>
          </div>

          <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center">
            <Star className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-2xl font-light text-white mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {nextBadge ? nextBadge.requiredStreak - currentStreak : 0}
            </h3>
            <p className="text-white/60">Days to Next Badge</p>
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
            <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-light text-white mb-4 text-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Next Badge
              </h3>
              <div className="flex items-center gap-4">
                <div className="text-6xl opacity-50">{nextBadge.icon}</div>
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

        {/* Badge Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <h3 className="text-2xl font-light text-white mb-6 text-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Badge Collection
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                className={`
                  relative bg-black/50 backdrop-blur-lg rounded-2xl p-4 border transition-all duration-300
                  ${badge.unlocked 
                    ? 'border-white/20 hover:border-white/40' 
                    : 'border-white/10 opacity-50'
                  }
                `}
              >
                {/* Badge Icon */}
                <div className="text-center mb-3">
                  <div className={`
                    text-4xl mb-2 transition-all duration-300
                    ${badge.unlocked ? 'scale-100' : 'scale-75 grayscale'}
                  `}>
                    {badge.unlocked ? badge.icon : '🔒'}
                  </div>
                  
                  {/* Unlock indicator */}
                  {badge.unlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
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
                  
                  {/* Category and Rarity */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-xs">{getCategoryIcon(badge.category)}</span>
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
    </div>
  );
};

export default BadgesPage;

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredStreak: number;
  category: 'rock' | 'plant' | 'celestial' | 'cosmic';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedDate?: string;
}

export const BADGE_PROGRESSION: Badge[] = [
  // Rock Category (1-7 days)
  {
    id: 'pebble',
    name: 'Pebble',
    description: 'Your first step on the journey',
    icon: '🪨',
    requiredStreak: 1,
    category: 'rock',
    rarity: 'common',
    unlocked: false
  },
  {
    id: 'stone',
    name: 'Stone',
    description: 'Building momentum',
    icon: '🪨',
    requiredStreak: 3,
    category: 'rock',
    rarity: 'common',
    unlocked: false
  },
  {
    id: 'boulder',
    name: 'Boulder',
    description: 'A week of consistency',
    icon: '🪨',
    requiredStreak: 7,
    category: 'rock',
    rarity: 'uncommon',
    unlocked: false
  },

  // Plant Category (2-4 weeks)
  {
    id: 'seed',
    name: 'Seed',
    description: 'Growth begins',
    icon: '🌱',
    requiredStreak: 14,
    category: 'plant',
    rarity: 'uncommon',
    unlocked: false
  },
  {
    id: 'sprout',
    name: 'Sprout',
    description: 'Breaking through',
    icon: '🌿',
    requiredStreak: 21,
    category: 'plant',
    rarity: 'uncommon',
    unlocked: false
  },
  {
    id: 'tree',
    name: 'Mighty Tree',
    description: 'A month of dedication',
    icon: '🌳',
    requiredStreak: 30,
    category: 'plant',
    rarity: 'rare',
    unlocked: false
  },

  // Celestial Category (2-6 months)
  {
    id: 'moon',
    name: 'Lunar Guardian',
    description: 'Two months of mastery',
    icon: '🌙',
    requiredStreak: 60,
    category: 'celestial',
    rarity: 'rare',
    unlocked: false
  },
  {
    id: 'sun',
    name: 'Solar Champion',
    description: 'Three months of brilliance',
    icon: '☀️',
    requiredStreak: 90,
    category: 'celestial',
    rarity: 'epic',
    unlocked: false
  },
  {
    id: 'comet',
    name: 'Cosmic Comet',
    description: 'Six months of excellence',
    icon: '☄️',
    requiredStreak: 180,
    category: 'celestial',
    rarity: 'epic',
    unlocked: false
  },

  // Cosmic Category (1+ years)
  {
    id: 'planet',
    name: 'Planetary Master',
    description: 'One year of legendary dedication',
    icon: '🪐',
    requiredStreak: 365,
    category: 'cosmic',
    rarity: 'legendary',
    unlocked: false
  },
  {
    id: 'star',
    name: 'Stellar Legend',
    description: 'Two years of cosmic achievement',
    icon: '⭐',
    requiredStreak: 730,
    category: 'cosmic',
    rarity: 'legendary',
    unlocked: false
  },
  {
    id: 'galaxy',
    name: 'Galactic Emperor',
    description: 'Five years of universal mastery',
    icon: '🌌',
    requiredStreak: 1825,
    category: 'cosmic',
    rarity: 'legendary',
    unlocked: false
  }
];

export const getBadgeByStreak = (streak: number): Badge[] => {
  return BADGE_PROGRESSION.filter(badge => badge.requiredStreak <= streak);
};

export const getNextBadge = (streak: number): Badge | null => {
  const nextBadge = BADGE_PROGRESSION.find(badge => badge.requiredStreak > streak);
  return nextBadge || null;
};

export const getRarityColor = (rarity: Badge['rarity']): string => {
  switch (rarity) {
    case 'common': return 'text-gray-400';
    case 'uncommon': return 'text-green-400';
    case 'rare': return 'text-blue-400';
    case 'epic': return 'text-purple-400';
    case 'legendary': return 'text-yellow-400';
    default: return 'text-gray-400';
  }
};

export const getRarityGlow = (rarity: Badge['rarity']): string => {
  switch (rarity) {
    case 'common': return 'shadow-gray-400/20';
    case 'uncommon': return 'shadow-green-400/20';
    case 'rare': return 'shadow-blue-400/20';
    case 'epic': return 'shadow-purple-400/20';
    case 'legendary': return 'shadow-yellow-400/20';
    default: return 'shadow-gray-400/20';
  }
};

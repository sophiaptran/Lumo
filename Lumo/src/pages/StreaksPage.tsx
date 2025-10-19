import React from 'react';
import { motion } from 'framer-motion';
import { BackgroundBeams } from '@/components/ui/background-beams';

const StreaksPage: React.FC = () => {
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
          <h1 className="text-6xl font-light text-white tracking-wide mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Streaks
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-light">
            Track your daily progress and build consistent habits.
          </p>
        </motion.div>

        {/* Placeholder Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-blue-900/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-800/30 text-center shadow-lg">
            <h2 className="text-2xl font-light text-white mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Streaks Coming Soon
            </h2>
            <p className="text-white/60">
              This page will show your daily streaks, progress tracking, and habit building features.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StreaksPage;
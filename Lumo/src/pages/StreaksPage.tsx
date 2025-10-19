import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BackgroundBeams } from '@/components/ui/background-beams';

const StreaksPage: React.FC = () => {
  const [selectedStreak, setSelectedStreak] = useState<number | null>(null);

  const streakTypes = [
    { name: 'No Spending on Wants', color: 'bg-purple-500/40' },
    { name: 'Balance Check', color: 'bg-blue-500/40' },
    { name: 'Investing Goals', color: 'bg-green-500/40' },
    { name: 'Lesson a Day', color: 'bg-red-600/40' }
  ];

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
            Streaks
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-light">
            Track your daily progress and build consistent habits.
          </p>
        </motion.div>

        {/* Calendar Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex gap-8 items-start">
            {/* Calendar */}
            <div className="bg-blue-900/20 backdrop-blur-lg rounded-2xl p-10 border border-blue-800/30 shadow-lg flex-1 max-w-xl">
              <div className="text-center mb-5">
                <h2 className="text-2xl font-light text-white mb-3" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
              </div>
              
              <div className="grid grid-cols-7 gap-4 mb-6">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-white/60 text-lg font-medium py-4">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 6;
                  const currentDate = new Date();
                  const currentDay = currentDate.getDate();
                  const currentMonth = currentDate.getMonth();
                  const currentYear = currentDate.getFullYear();
                  
                  const isCurrentMonth = day > 0 && day <= new Date(currentYear, currentMonth + 1, 0).getDate();
                  const isToday = day === currentDay && isCurrentMonth;
                  
                  // Generate random streaks for demo - only show selected streak type
                  const hasStreak = isCurrentMonth && Math.random() < 0.3;
                  const showStreak = hasStreak && selectedStreak !== null;
                  
                  return (
                    <div
                      key={i}
                      className={`
                        aspect-square flex items-center justify-center rounded-lg text-lg font-medium relative overflow-hidden
                        ${!isCurrentMonth ? 'text-white/20' : ''}
                        ${isCurrentMonth ? 'text-white' : ''}
                        ${isToday ? 'ring-2 ring-blue-400' : ''}
                        ${isCurrentMonth && !isToday ? 'hover:bg-white/10 cursor-pointer' : ''}
                      `}
                    >
                      {showStreak ? (
                        <div className="absolute inset-0 blur-sm">
                          <div className={`${streakTypes[selectedStreak!].color} backdrop-blur-sm w-full h-full rounded`} />
                        </div>
                      ) : null}
                      <span className="relative z-10">
                        {day > 0 ? day : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Streak Legend */}
            <div className="bg-blue-900/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-800/30 shadow-lg min-w-[280px]">
              <h3 className="text-lg font-light text-white mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Your Streaks
              </h3>
              <p className="text-white/60 text-xs mb-4">
                Click a streak to view it on the calendar
              </p>
              
              <div className="space-y-3">
                {streakTypes.map((streak, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedStreak === index 
                        ? 'bg-white/10 border border-white/20' 
                        : 'hover:bg-white/5'
                    }`}
                    onClick={() => setSelectedStreak(selectedStreak === index ? null : index)}
                  >
                    <div className={`w-4 h-4 ${streak.color} backdrop-blur-sm rounded`}></div>
                    <span className={`text-sm font-bold transition-colors ${
                      selectedStreak === index ? 'text-white' : 'text-white/80'
                    }`}>
                      {streak.name}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 border-2 border-blue-400 rounded"></div>
                  <span className="text-white/60 text-sm">Today</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StreaksPage;
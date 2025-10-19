import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flame, Trophy, Target, CheckCircle, Clock } from 'lucide-react';
import { BackgroundBeams } from '@/components/ui/background-beams';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  lastCheckIn: string | null;
  checkInHistory: string[];
}

const StreaksPage: React.FC = () => {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalCheckIns: 0,
    lastCheckIn: null,
    checkInHistory: []
  });
  
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load streak data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('streakData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setStreakData(parsed);
      
      // Check if user has already checked in today
      const today = new Date().toDateString();
      setHasCheckedInToday(parsed.checkInHistory.includes(today));
    }
    setIsLoading(false);
  }, []);

  // Save streak data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('streakData', JSON.stringify(streakData));
    }
  }, [streakData, isLoading]);

  const checkIn = () => {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    setStreakData(prev => {
      const newCheckInHistory = [...prev.checkInHistory, today];
      const newTotalCheckIns = prev.totalCheckIns + 1;
      
      let newCurrentStreak = 1;
      if (prev.checkInHistory.includes(yesterdayString)) {
        newCurrentStreak = prev.currentStreak + 1;
      }
      
      const newLongestStreak = Math.max(newCurrentStreak, prev.longestStreak);

      return {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        totalCheckIns: newTotalCheckIns,
        lastCheckIn: today,
        checkInHistory: newCheckInHistory
      };
    });
    
    setHasCheckedInToday(true);
  };

  const getStreakMessage = () => {
    if (streakData.currentStreak === 0) {
      return "Start your streak today!";
    } else if (streakData.currentStreak === 1) {
      return "Great start! Keep it going!";
    } else if (streakData.currentStreak < 7) {
      return "You're building momentum!";
    } else if (streakData.currentStreak < 30) {
      return "Amazing consistency!";
    } else {
      return "You're a streak master! 🔥";
    }
  };

  const getStreakColor = () => {
    if (streakData.currentStreak === 0) return "from-gray-400 to-gray-600";
    if (streakData.currentStreak < 7) return "from-blue-400 to-purple-500";
    if (streakData.currentStreak < 30) return "from-purple-400 to-pink-500";
    return "from-pink-400 to-yellow-400";
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
          <h1 className="text-6xl font-light text-white mb-6 tracking-wide" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Daily Streaks
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-light">
            Build consistency by checking in every day. Your streak grows with each consecutive day.
          </p>
        </motion.div>

        {/* Main Streak Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-black/50 backdrop-blur-lg rounded-3xl p-8 border border-white/10 relative overflow-hidden">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white/10 border border-white/20 mb-6 relative"
              >
                <Flame className="w-16 h-16 text-white" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-6xl font-light mb-2 text-white"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {streakData.currentStreak}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xl text-white/70"
              >
                {getStreakMessage()}
              </motion.p>
            </div>

            {/* Check-in Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-center"
            >
              {hasCheckedInToday ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-green-500/20 border border-green-500/30 rounded-full backdrop-blur-sm"
                >
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-green-400 font-semibold">Checked in today!</span>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={checkIn}
                  className="px-12 py-4 bg-white text-black hover:bg-white/90 rounded-full font-medium text-lg transition-all duration-300"
                >
                  Check In Today
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
        >
          {/* Longest Streak */}
          <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center">
            <Trophy className="w-8 h-8 text-white mx-auto mb-3" />
            <h3 className="text-2xl font-light text-white mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{streakData.longestStreak}</h3>
            <p className="text-white/60">Longest Streak</p>
          </div>

          {/* Total Check-ins */}
          <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center">
            <Target className="w-8 h-8 text-white mx-auto mb-3" />
            <h3 className="text-2xl font-light text-white mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{streakData.totalCheckIns}</h3>
            <p className="text-white/60">Total Check-ins</p>
          </div>

          {/* Last Check-in */}
          <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center">
            <Clock className="w-8 h-8 text-white mx-auto mb-3" />
            <h3 className="text-lg font-light text-white mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {streakData.lastCheckIn ? new Date(streakData.lastCheckIn).toLocaleDateString() : 'Never'}
            </h3>
            <p className="text-white/60">Last Check-in</p>
          </div>
        </motion.div>

        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-white" />
              <h3 className="text-xl font-light text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Recent Activity</h3>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 30 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (29 - i));
                const dateString = date.toDateString();
                const isCheckedIn = streakData.checkInHistory.includes(dateString);
                const isToday = dateString === new Date().toDateString();
                
                return (
                  <motion.div
                    key={dateString}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6 + i * 0.01 }}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center text-xs font-medium relative overflow-hidden
                      ${isCheckedIn 
                        ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white' 
                        : 'bg-white/5 text-white/40 border border-white/10'
                      }
                      ${isToday ? 'ring-2 ring-blue-400/50' : ''}
                    `}
                  >
                    {isCheckedIn && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-20 animate-pulse"></div>
                    )}
                    <span className="relative z-10">{date.getDate()}</span>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="flex items-center gap-4 mt-4 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
                <span>Checked in</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-white/10 border border-white/20"></div>
                <span>Missed</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StreaksPage;

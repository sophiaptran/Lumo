import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { getCustomerAccounts, getAccountPurchases, type NessiePurchase } from '@/lib/nessie'
import { useSession } from '@/session'

const StreaksPage: React.FC = () => {
  const [selectedStreak, setSelectedStreak] = useState<number | null>(0);
  const [savedDates, setSavedDates] = useState<Set<string>>(new Set());
  const [noWantsDates, setNoWantsDates] = useState<Set<string>>(new Set());
  const { session } = useSession()
  const userKey = useMemo(() => session?.email || localStorage.getItem('userEmail') || 'anon', [session?.email])

  const needsCategories = useMemo(() => new Set([
    'Groceries','Wholesale','Utilities','Bills','Transportation','Health','Insurance','Education','Phone'
  ]), [])

  function normalizeCategory(name?: string): string | undefined {
    if (!name) return undefined
    const n = String(name).toLowerCase()
    if (/(grocery|grocer|supermarket)/.test(n)) return 'Groceries'
    if (/(wholesale|costco|sam's club|sams club|bj's|bjs)/.test(n)) return 'Wholesale'
    if (/(restaurant|dining|food|cafe|coffee)/.test(n)) return 'Dining'
    if (/(shopping|retail|store|walmart|target|amazon)/.test(n)) return 'Shopping'
    if (/(uber|lyft|airline|flight|hotel|travel|taxi)/.test(n)) return 'Travel'
    if (/(movie|cinema|netflix|spotify|entertain)/.test(n)) return 'Entertainment'
    if (/(bill|electric|water|gas|utility|utilities|internet)/.test(n)) return 'Utilities'
    if (/(fuel|gas station|parking|toll|transport)/.test(n)) return 'Transportation'
    if (/(pharmacy|health|doctor|hospital|medical)/.test(n)) return 'Health'
    if (/(rent|mortgage)/.test(n)) return 'Bills'
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  useEffect(() => {
    const load = async () => {
      try {
        const arr = JSON.parse(localStorage.getItem(`roundupSavedDates:${userKey}`) || '[]') as string[]
        setSavedDates(new Set(arr))
      } catch {}

      const customerId = localStorage.getItem('nessieCustomerId') || ''
      if (!customerId) { setNoWantsDates(new Set()); return }

      try {
        const accs = await getCustomerAccounts(customerId)
        const today = new Date()
        const currentMonth = today.getMonth()
        const currentYear = today.getFullYear()
        const wantsByDay = new Map<string, number>()
        for (const a of accs) {
          try {
            const ps: NessiePurchase[] = await getAccountPurchases(a._id)
            for (const p of ps) {
              if (!p.purchase_date) continue
              const d = new Date(p.purchase_date)
              if (d.getFullYear() !== currentYear || d.getMonth() !== currentMonth) continue
              const key = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
              const cat = (p.category as string) || normalizeCategory((p as any)?.description)
              const isNeed = cat ? needsCategories.has(cat) : false
              const isWant = !isNeed
              if (isWant) wantsByDay.set(key, (wantsByDay.get(key)||0) + (p.amount||0))
            }
          } catch {}
        }

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
        const noWants = new Set<string>()
        for (let day=1; day<=daysInMonth; day++) {
          const dayDate = new Date(currentYear, currentMonth, day)
          if (dayDate > today) continue
          const key = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
          if ((wantsByDay.get(key) || 0) === 0) noWants.add(key)
        }
        setNoWantsDates(noWants)
      } catch {}
    }
    load()
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'nessie:lastChange' || e.key?.startsWith('roundupSavedDates:')) load()
    }
    const onVis = () => { if (document.visibilityState === 'visible') load() }
    window.addEventListener('storage', onStorage)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('storage', onStorage)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [needsCategories, userKey])

  const streakTypes = [
    { name: 'No Spending on Wants', color: 'bg-purple-500/40' },
    { name: 'Round-up Savings', color: 'bg-green-500/40' },
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
                  
                  const key = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
                  let showStreak = false
                  if (isCurrentMonth && selectedStreak !== null) {
                    if (selectedStreak === 0) {
                      showStreak = noWantsDates.has(key)
                    } else if (selectedStreak === 1) {
                      showStreak = savedDates.has(key)
                    }
                  }
                  
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
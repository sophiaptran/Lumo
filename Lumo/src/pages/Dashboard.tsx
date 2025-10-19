
import { useEffect, useState } from 'react'
import supabase from '@/assets/supabase-client'
import { useSession } from '@/session'
import { AuroraBackground, BentoGrid, BentoGridItem } from '@/components/ui/dashboard'
import { PieCharts } from '@/components/ui/pie-chart'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { cn } from '@/lib/utils'
import { BarChart, Trophy, Zap } from 'lucide-react'
import { MonthlyBarGraph } from '@/components/ui/bar-graph'

function capitalize(word: string) {
  if (!word) return ''
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

export default function Dashboard() {
  const [fullName, setFullName] = useState<string>('')
  const { session } = useSession()

  useEffect(() => {
    const email = session?.email || localStorage.getItem('userEmail') || ''
    if (!email) return

    ;(async () => {
      const { data, error } = await supabase
        .from('userLogin')
        .select('first_name, last_name')
        .eq('email', email)
        .limit(1)
        .single()
      if (!error && data) {
        const first = capitalize(data.first_name as string)
        const last = capitalize(data.last_name as string)
        setFullName(`${first} ${last}`)
      }
    })()
  }, [session?.email])

  return (
    <div className="min-h-screen w-full bg-black text-white relative">
      <AuroraBackground />
      <div className="relative z-10 px-6 pt-6">
        <h1 className="text-3xl md:text-4xl font-semibold">Dashboard</h1>
        {fullName && (
          <p className="mt-2 text-white/80 text-lg">Welcome, {fullName}</p>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-12 gap-6 pt-6 pb-12 px-6">
        <div className="col-span-12 md:col-span-3 lg:col-span-2">
          <Sidebar />
        </div>

        <div className="col-span-12 md:col-span-9 lg:col-span-10">
          <BentoGrid>
            <GlowingBentoItem
              className="md:col-span-4 md:row-span-2"
              gradientFrom="from-slate-800/60"
              gradientTo="to-slate-700/60"
            >
              <PieCharts
                data={spendingData}
                colors={colors}
                title="Spending Breakdown"
              />
            </GlowingBentoItem>

            <GlowingBentoItem
              className="md:col-span-2 md:row-span-2"
              gradientFrom="from-slate-800/60"
              gradientTo="to-slate-700/60"
            >
              <div className="text-white h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-1 opacity-80">
                    Monthly Budget
                  </h2>
                  <p className="text-4xl font-bold text-white">$2,450</p>
                </div>
                <div>
                  <div className="bg-white/20 rounded-full h-1.5 mb-2">
                    <div className="bg-white rounded-full h-1.5 w-3/4"></div>
                  </div>
                  <p className="text-sm opacity-50">$550 remaining</p>
                </div>
              </div>
            </GlowingBentoItem>

            <GlowingBentoItem
              className="md:col-span-3"
              gradientFrom="from-slate-800/40"
              gradientTo="to-slate-800/40"
            >
              <div className="text-white">
                <h2 className="text-lg font-semibold mb-3 opacity-80">
                  Recent Transactions
                </h2>
                <div className="space-y-2 divide-y divide-white/20">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm opacity-60">Coffee Shop</span>
                    <span className="font-medium text-red-500">-$5.50</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm opacity-60">Grocery Store</span>
                    <span className="font-medium text-red-500">-$87.32</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm opacity-60">Salary Deposit</span>
                    <span className="font-medium text-green-500">+$3,200</span>
                  </div>
                </div>
              </div>
            </GlowingBentoItem>

            <GlowingBentoItem
              className="md:col-span-3"
              gradientFrom="from-slate-800/40"
              gradientTo="to-slate-800/40"
            >
              <div className="text-white h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-2 opacity-80 text-center">
                  Monthly Spending
                </h2>
                <div className="flex-grow min-h-[150px]">
                  <MonthlyBarGraph data={monthlySpendingData} />
                </div>
              </div>
            </GlowingBentoItem>

            <GlowingBentoItem
              className="md:col-span-2"
              gradientFrom="from-slate-800/60"
              gradientTo="to-slate-700/60"
            >
              <div className="text-white">
                <h2 className="text-lg font-semibold mb-1 opacity-80">
                  Savings Goal
                </h2>
                <p className="text-3xl font-bold text-white">65%</p>
                <p className="text-xs opacity-40 mt-1">$6,500 / $10,000</p>
              </div>
            </GlowingBentoItem>

            <GlowingBentoItem
              className="md:col-span-2"
              gradientFrom="from-slate-800/60"
              gradientTo="to-slate-700/60"
            >
              <div className="text-white">
                <h2 className="text-lg font-semibold mb-1 opacity-80">
                  Credit Score
                </h2>
                <p className="text-3xl font-bold text-white">742</p>
                <p className="text-xs opacity-40 mt-1">↑ 12 points</p>
              </div>
            </GlowingBentoItem>

            <GlowingBentoItem
              className="md:col-span-2"
              gradientFrom="from-slate-800/60"
              gradientTo="to-slate-700/60"
            >
              <div className="text-white">
                <h2 className="text-lg font-semibold mb-1 opacity-80">
                  Investment
                </h2>
                <p className="text-3xl font-bold text-white">$15,840</p>
                <p className="text-xs opacity-40 mt-1">+8.5% YTD</p>
              </div>
            </GlowingBentoItem>
          </BentoGrid>
        </div>
      </div>
    </div>
  )
}

// Helper component to wrap content and include GlowingEffect correctly
function GlowingBentoItem({
  children,
  className,
  gradientFrom,
  gradientTo,
  ...props
}: {
  children: React.ReactNode
  className?: string
  gradientFrom: string
  gradientTo: string
}) {
  return (
    <BentoGridItem
      className={cn(className, 'relative')}
      gradientFrom={gradientFrom}
      gradientTo={gradientTo}
      {...props as any}
    >
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={3}
        className="rounded-[inherit]"
      />
      <div className="relative z-10 h-full p-4 rounded-[inherit]">
        {children}
      </div>
    </BentoGridItem>
  )
}

function Sidebar() {
  const menuItems = [
    { name: 'Analytics', icon: BarChart, current: true },
    { name: 'Streaks', icon: Zap, current: false },
    { name: 'Badges', icon: Trophy, current: false },
  ]
  return (
    <div className="flex flex-col space-y-4 pt-16 px-4">
      {menuItems.map((item) => (
        <a
          key={item.name}
          href={`#${item.name.toLowerCase()}`}
          className={cn(
            'flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200',
            item.current
              ? 'bg-purple-600/30 text-purple-300 border border-purple-600 shadow-lg'
              : 'text-white/70 hover:bg-slate-800/50 hover:text-white'
          )}
        >
          <item.icon className="w-5 h-5" />
          <span className="font-medium">{item.name}</span>
        </a>
      ))}
    </div>
  )
}

const spendingData = [
  { name: 'Food', value: 400 },
  { name: 'Travel', value: 150 },
  { name: 'Entertainment', value: 100 },
  { name: 'Bills', value: 250 },
]

const monthlySpendingData = [
  { month: 'Jan', amount: 850 },
  { month: 'Feb', amount: 920 },
  { month: 'Mar', amount: 780 },
  { month: 'Apr', amount: 900 },
  { month: 'May', amount: 1100 },
  { month: 'Jun', amount: 950 },
]

const colors = {
  Food: '#8B5CF6',
  Travel: '#3B82F6',
  Entertainment: '#14B8A6',
  Bills: '#22D3EE',
}



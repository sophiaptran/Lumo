import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { BarChart, Trophy, Zap } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/dashboard'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const menuItems = [
    { name: 'Analytics', icon: BarChart, path: '/dashboard' },
    { name: 'Streaks', icon: Zap, path: '/streaks' },
    { name: 'Badges', icon: Trophy, path: '/badges' },
  ]

  const handleMenuClick = (path: string) => {
    navigate(path)
  }

  const isCurrentPage = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen w-full bg-black text-white relative">
      <AuroraBackground />
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-12 gap-6 pt-6 pb-12 px-6">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3 lg:col-span-2">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-9 lg:col-span-10">
          {children}
        </div>
      </div>
    </div>
  )

  function Sidebar() {
    return (
      <div className="flex flex-col space-y-4 pt-16 px-4">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleMenuClick(item.path)}
            className={cn(
              'group flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 w-full text-left transform hover:scale-125',
              isCurrentPage(item.path)
                ? 'bg-purple-600/30 text-purple-300 border border-purple-600 shadow-lg'
                : 'text-white/70 hover:bg-slate-700/50 hover:text-white hover:border hover:border-slate-500/50 hover:shadow-lg hover:shadow-slate-500/20'
            )}
          >
            <item.icon className="w-5 h-5 transition-all duration-300 group-hover:text-white" />
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </div>
    )
  }
}

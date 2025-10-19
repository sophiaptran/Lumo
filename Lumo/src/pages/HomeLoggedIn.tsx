import { HeroScrollDemo } from "../scroller"
import { GridEffect } from "../grid"
import { LastHero } from "../last-hero"
import { DashboardButton as DashboardButtonComp } from "@/components/ui/dashboard-btn"
import { useSession } from "@/session"
import { useNavigate } from "react-router-dom"

export function HomeLoggedIn() {
  const { setSession } = useSession()
  const navigate = useNavigate()

  const onLogout = () => {
    navigate('/logout', { replace: true })
  }
  return (
    <>
      <div className="w-full flex items-center justify-between gap-2 p-4">
        <h1 className="text-lg md:text-xl font-semibold text-white/90">Welcome Back</h1>
        <div className="flex items-center gap-2">
          <DashboardButtonComp />
          <button
            onClick={onLogout}
            className="group relative inline-flex items-center justify-center text-sm rounded-md bg-transparent border border-white/30 backdrop-blur-sm px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-white/10 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
            aria-label="Logout"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
      <HeroScrollDemo />
      <GridEffect />
      <LastHero />
    </>
  )
}

export default HomeLoggedIn



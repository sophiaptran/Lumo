import { useNavigate } from "react-router-dom"
import { useSession } from "@/session"

export default function LogoutConfirm() {
  const navigate = useNavigate()
  const { setSession } = useSession()

  const onConfirm = () => {
    try { localStorage.removeItem('userEmail') } catch {}
    setSession(null)
    navigate('/', { replace: true })
  }

  const onCancel = () => {
    navigate('/home')
  }

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold">Confirm logout</h1>
        <p className="text-white/70">Are you sure you want to log out?</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onConfirm}
            className="rounded-full bg-white text-black font-medium px-6 py-2 hover:bg-white/90 transition-colors"
            type="button"
          >
            Yes, log me out
          </button>
          <button
            onClick={onCancel}
            className="rounded-full bg-white/10 text-white font-medium px-6 py-2 border border-white/20 hover:bg-white/15 transition-colors"
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}



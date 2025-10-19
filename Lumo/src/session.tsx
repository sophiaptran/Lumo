import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type UserSession = {
  email: string
  firstName?: string
  lastName?: string
}

type SessionContextValue = {
  session: UserSession | null
  setSession: (s: UserSession | null) => void
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null)
  const value = useMemo(() => ({ session, setSession }), [session])
  useEffect(() => {
    try {
      const email = localStorage.getItem('userEmail')
      if (email) {
        setSession({ email })
      }
    } catch {}

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'userEmail') {
        setSession(e.newValue ? { email: e.newValue } : null)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within a SessionProvider')
  return ctx
}



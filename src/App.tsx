import { useCallback, useState } from 'react'

import { LoginPage } from './components/LoginPage'
import { MainApp } from './MainApp'

const SESSION_KEY = 'inceif-pdf-auth-session-v1'

type StoredSession = {
  accountType: 'user' | 'corporate'
  email: string
}

function readSession(): StoredSession | null {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) {
      return null
    }
    const p = JSON.parse(raw) as StoredSession
    if (p && (p.accountType === 'user' || p.accountType === 'corporate')) {
      return { accountType: p.accountType, email: String(p.email ?? '') }
    }
    return null
  } catch {
    return null
  }
}

function App() {
  const [session, setSession] = useState<StoredSession | null>(() =>
    readSession(),
  )

  const handleLogin = useCallback(
    (payload: {
      accountType: 'user' | 'corporate'
      email: string
      password: string
    }) => {
      const next: StoredSession = {
        accountType: payload.accountType,
        email: payload.email,
      }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(next))
      setSession(next)
    },
    [],
  )

  if (!session) {
    return <LoginPage onSubmit={handleLogin} />
  }

  return <MainApp />
}

export default App

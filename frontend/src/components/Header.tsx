'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import AuthModal from '../modals/Auth/Modal'
import AccountModal from '../modals/Account/Modal'

export default function Header() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' })
        setIsAuthenticated(res.ok)
      } catch {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
    setAuthOpen(false)
    router.refresh()
  }

  const handleLogout = async () => {

    setIsAuthenticated(false)
    setAccountOpen(false)
    router.refresh()
  }

  const handleClick = () => {
    if (isAuthenticated) {
      setAccountOpen(true)
    } else {
      setAuthOpen(true)
    }
  }

  if (isAuthenticated === null) return null // ждем результата

  return (
    <>
      <header className="bg-gradient-to-br from-indigo-500 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faSearch} className="text-2xl" />
            <span className="text-xl font-bold">
              <a href="/">Tender Parsing</a>
            </span>
          </div>
          <button
            onClick={handleClick}
            className="bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition duration-300 flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={isAuthenticated ? faUser : faSignInAlt} />
            <span>{isAuthenticated ? 'Личный кабинет' : 'Авторизоваться'}</span>
          </button>
        </div>
      </header>

      {authOpen && (
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          onLogin={handleLogin}
        />
      )}

      {accountOpen && (
        <AccountModal 
          isOpen={accountOpen} 
          onClose={() => setAccountOpen(false)}
        />
      )}
    </>
  )
}

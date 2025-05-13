'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Добавлен импорт Link
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import AuthModal from "../modals/AuthModal";
import AccountModal from '../modals/AccountModal';

export default function Header() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('isAuthenticated')
    setIsAuthenticated(stored === 'true')
  }, [])

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true')
    setIsAuthenticated(true)
    setAuthOpen(false)
    router.push('/')
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
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

  if (isAuthenticated === null) return null

  return (
    <>
      <header className="bg-gradient-to-br from-indigo-500 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faSearch} className="text-2xl" />
            <span className="text-xl font-bold">
              <Link href="/">Tender Parsing</Link> {/* Заменено a на Link */}
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
          onLogout={handleLogout}
        />
      )}
    </>
  );
};
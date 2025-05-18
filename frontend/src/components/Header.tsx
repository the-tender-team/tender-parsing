'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/context/AuthProvider'
import { useRouter } from 'next/navigation'
import AccountModal from '../modals/AccountModal'
import AuthModal from '../modals/AuthModal'
import { useState } from 'react'

export default function Header() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [authOpen, setAuthOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const handleClick = () => {
    if (isAuthenticated) {
      setAccountOpen(true)
    } else {
      setAuthOpen(true)
    }
  }

  return (
    <>
      <header className="bg-gradient-to-br from-indigo-500 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <FontAwesomeIcon icon={faSearch} className="text-2xl" />
            <span className="text-xl font-bold">Tender Parsing</span>
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

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <AccountModal isOpen={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  )
}
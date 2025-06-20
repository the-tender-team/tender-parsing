'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import AccountModal from '../modal/AccountModal'
import AuthModal from '../modal/AuthModal'
import Button from "./Button"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSignInAlt, faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

export default function Header() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [authOpen, setAuthOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  const navItems = [
    { id: 'how-it-works', name: 'Принцип работы' },
    { id: 'roles', name: 'Роли' },
    { id: 'parsing', name: 'Парсинг' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      navItems.forEach((item) => {
        const element = document.getElementById(item.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= window.innerHeight * 0.3 && rect.top >= 0) {
            setActiveSection(item.id)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [navItems])

  const handleClick = () => {
    if (isAuthenticated) {
      setAccountOpen(true)
    } else {
      setAuthOpen(true)
    }
  }

  const handleMenuToggle = () => setMenuOpen(!menuOpen)
  
  const handleLinkClick = (id: string) => {
    setMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      const headerHeight = document.querySelector('header')?.clientHeight || 0
      const offset = element.offsetTop - headerHeight
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      })
    }
  }

  return (
    <>
      <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Логотип (левая часть) */}
          <div 
            className="flex items-center space-x-2 cursor-pointer flex-shrink-0 mr-2"
            onClick={() => router.push('/')}
          >
            <FontAwesomeIcon icon={faSearch} className="text-xl md:text-2xl" />
            <span className="text-xl font-semibold whitespace-nowrap">
              <span className="sm:hidden">TP</span>
              <span className="hidden sm:inline">Tender Parsing</span>
            </span>
          </div>

          {/* Центральное меню */}
          <div className="hidden md:flex flex-1 justify-center mx-2 min-w-0">
            <nav className="flex space-x-4 md:space-x-6">
              {navItems.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <a 
                    key={item.id}
                    href={`#${item.id}`}
                    className={`text-base px-2 py-1 border-b-2 transition whitespace-nowrap ${
                      isActive 
                        ? 'border-white'
                        : 'border-transparent text-indigo-200 hover:border-indigo-400'
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      handleLinkClick(item.id)
                    }}
                  >
                    {item.name}
                  </a>
                )
              })}
            </nav>
          </div>

          {/* Правая часть (кнопки) */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <Button
              variant="primary"
              type="button"
              onClick={handleMenuToggle}
              icon={menuOpen ? faTimes : faBars}
              size="lg"
              className="md:hidden"
            />
            <Button 
              type="button"
              variant="auth"
              onClick={handleClick}
              icon={isAuthenticated ? faUser : faSignInAlt}
              size="lg"
            >
              {isAuthenticated ? 'Личный кабинет' : 'Авторизоваться'}
            </Button>
          </div>
        </div>

        {/* Мобильное меню */}
        {menuOpen && (
          <nav className="md:hidden bg-indigo-600 text-white px-4 pb-4">
            <div className="flex flex-row flex-wrap items-start gap-2 pt-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <a 
                    key={item.id}
                    href={`#${item.id}`}
                    className={`p-2 pb-1 border-b-2 transition ${
                      isActive 
                        ? 'border-white'
                        : 'border-transparent text-indigo-200 hover:border-indigo-400'
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      handleLinkClick(item.id)
                    }}
                  >
                    {item.name}
                  </a>
                )
              })}
            </div>
          </nav>
        )}
      </header>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <AccountModal isOpen={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faCog,
  faUserShield,
  faTimes
} from '@fortawesome/free-solid-svg-icons'

import { useNotification } from '@/components/ui/NotificationProvider'
import AccountTab from './AccountTab'
import SettingsTab from './SettingsTab'
import PanelTab from './PanelTab'

type Tab = 'account' | 'settings' | 'panel'

export default function UserDashboard({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [userData, setUserData] = useState<null | {
    username?: string
    role?: string
    regDate?: string
    userId?: string
  }>(null)
  const [activeTab, setActiveTab] = useState<Tab>('account')

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).finally(() => {
      onClose()
    })
  }

  useEffect(() => {
    if (!isOpen) return

    const fetchUser = async () => {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store'
      })

      if (res.ok) {
        const data = await res.json()
        setUserData(data)
      } else {
        handleLogout()
      }
    }

    fetchUser()
  }, [isOpen])

  if (!isOpen || !userData) return null

  const renderTab = () => {
    switch (activeTab) {
      case 'account':
        return <AccountTab userData={userData} onLogout={handleLogout} />
      case 'settings':
        return <SettingsTab userData={userData} />
      case 'panel':
        return <PanelTab />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {{
                account: 'Аккаунт',
                settings: 'Настройки',
                panel: 'Панель'
              }[activeTab]}
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('account')}
                className={`p-2 pb-1 border-b-2 transition ${
                  activeTab === 'account'
                    ? 'border-white'
                    : 'border-transparent text-indigo-200'
                }`}
              >
                <FontAwesomeIcon icon={faHome} className="text-xl" />
              </button>
              {userData.role === 'owner' && (
                <button
                  onClick={() => setActiveTab('panel')}
                  className={`p-2 pb-1 border-b-2 transition ${
                    activeTab === 'panel'
                      ? 'border-white'
                      : 'border-transparent text-indigo-200'
                  }`}
                  title="Панель управления"
                >
                  <FontAwesomeIcon icon={faUserShield} className="text-xl" />
                </button>
              )}
              <button
                onClick={() => setActiveTab('settings')}
                className={`p-2 pb-1 border-b-2 transition ${
                  activeTab === 'settings'
                    ? 'border-white'
                    : 'border-transparent text-indigo-200'
                }`}
              >
                <FontAwesomeIcon icon={faCog} className="text-xl" />
              </button>
              <button
                onClick={onClose}
                className="text-white hover:text-indigo-200 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-grow">{renderTab()}</div>
      </div>
    </div>
  )
} 

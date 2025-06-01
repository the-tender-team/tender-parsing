'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import ModalWindow from '@/components/Modal'
import GeneralTab from './AccountTabs/GeneralTab'
import SettingsTab from './AccountTabs/SettingsTab'
import PanelTab from './AccountTabs/PanelTab'
import IconButton from '@/components/IconButton'
import { faHome, faSliders, faCog } from '@fortawesome/free-solid-svg-icons'

type Tab = 'account' | 'settings' | 'panel'

export default function AccountModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('account')

  useEffect(() => {
    if (isOpen && !user) {
      onClose()
    }
  }, [isOpen, user, onClose])

  useEffect(() => {
    if (!isOpen) {
      setActiveTab('account')
    }
  }, [isOpen])

  if (!isOpen || !user) return null

  const renderTab = () => {
    switch (activeTab) {
      case 'account':
        return <GeneralTab onLogout={logout} />
      case 'settings':
        return <SettingsTab userData={user} />
      case 'panel':
        return user.role === 'owner' ? <PanelTab /> : null
    }
  }

  const iconButtons = (
    <>
      <IconButton
        onClick={() => setActiveTab('account')}
        icon={faHome}
        title="Главная"
        tabKey="account"
        activeTab={activeTab}
      />
      {user.role === 'owner' && (
        <IconButton
          onClick={() => setActiveTab('panel')}
          icon={faSliders}
          title="Панель управления"
          tabKey="panel"
          activeTab={activeTab}
        />
      )}
      <IconButton
        onClick={() => setActiveTab('settings')}
        icon={faCog}
        title="Настройки"
        tabKey="settings"
        activeTab={activeTab}
      />
    </>
  )

  const titleMap: Record<Tab, string> = {
    account: 'Главная',
    settings: 'Настройки',
    panel: 'Панель управления'
  }

  return (
    <ModalWindow
      isOpen={isOpen}
      onClose={onClose}
      title={titleMap[activeTab]}
      iconButtons={iconButtons}
    >
      {renderTab()}
    </ModalWindow>
  )
}
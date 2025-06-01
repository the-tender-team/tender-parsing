'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { formatDate } from '@/libs/formatDate'
import InfoField from '../../components/ModalField'
import Button from '../../components/Button'
import Section from '../../components/ModalSection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faCircleInfo, faSpinner } from '@fortawesome/free-solid-svg-icons'

interface Props {
  onLogout: () => Promise<void>
}

export default function AccountTab({ onLogout }: Props) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const roles = {
    owner: 'Владелец',
    admin: 'Администратор',
    user: 'Пользователь'
  } as const

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await onLogout()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Section icon={<FontAwesomeIcon icon={faCircleInfo} />} title="Информация об аккаунте">        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <InfoField label="Имя пользователя" value={user?.username} />
            <InfoField 
              label="Роль" 
              value={user?.role ? roles[user.role as keyof typeof roles] : undefined} 
            />
          </div>
          
          <div className="space-y-4">
            <InfoField
              label="Дата и время регистрации"
              value={user?.createdAt ? formatDate(user.createdAt) : undefined}
            />
            <InfoField label="ID" value={user?.id?.toString()} />
          </div>
        </div>
      </Section>

      <div className="flex justify-end items-center gap-2">
        {isLoading && (
          <FontAwesomeIcon icon={faSpinner} className="text-indigo-600 animate-spin text-xl" />
        )}
        <Button
          onClick={handleLogout}
          type="button"
          variant="danger"
          icon={faSignOutAlt}
          disabled={isLoading}
        >
          Выйти
        </Button>
      </div>
    </>
  )
}
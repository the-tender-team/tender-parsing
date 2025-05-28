'use client'

import { useAuth } from '@/context/AuthProvider'
import { formatDate } from '@/libs/formatDate'
import InfoField from '../ModalField'
import Button from '../../components/Button'
import Section from '../ModalSection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons'

interface Props {
  onLogout: () => Promise<void>
}

export default function AccountTab({ onLogout }: Props) {
  const { user } = useAuth()

  const roles = {
    owner: 'Владелец',
    admin: 'Администратор',
    user: 'Пользователь'
  } as const

  return (
    <div className="p-6 space-y-6">
      <Section icon={<FontAwesomeIcon icon={faUserEdit} />} title="Информация об аккаунте">        
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

      <div className="flex justify-end">
        <Button
          onClick={onLogout}
          type={"submit"}
          variant="danger"
          icon={faSignOutAlt}
          className="flex items-center gap-2"
        >
          Выйти
        </Button>
      </div>
    </div>
  )
}
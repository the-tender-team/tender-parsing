'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useUser } from '@/providers/UserProvider'
import { useNotification } from '@/providers/NotificationProvider'
import InputField from '../ModalInputField'
import Section from '@/components/ModalSection'
import Button from '@/components/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserShield, faUserEdit, faKey, faCheck, faPaperPlane, faLock } from '@fortawesome/free-solid-svg-icons'

interface UserData {
  username: string
  role: string
  id?: number
  hasPendingAdminRequest?: boolean
}

interface Props {
  userData: UserData
}

export default function SettingsTab({ userData }: Props) {
  const { changePassword, changeUsername, requestAdminRole } = useUser()
  const { notify } = useNotification()
  const { refreshUser } = useAuth()
  
  // Состояния для формы изменения username
  const [usernameForm, setUsernameForm] = useState({
    newUsername: userData.username,
    currentPassword: ''
  })
  const [isSubmittingUsername, setIsSubmittingUsername] = useState(false)

  // Состояния для формы изменения пароля
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)

  // Состояния для запроса прав администратора
  const [isSubmittingAdminRequest, setIsSubmittingAdminRequest] = useState(false)

  // Обработчик изменения username
  const handleSaveUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!usernameForm.newUsername || !usernameForm.currentPassword) {
      return
    }

    setIsSubmittingUsername(true)

    try {
      const { success, error } = await changeUsername(
        usernameForm.newUsername,
        usernameForm.currentPassword
      )

      if (success) {
        setUsernameForm(prev => ({ ...prev, currentPassword: '' }))
      } else {
        throw new Error(error)
      }
    } catch (error: any) {
      console.error('Error changing username:', error)
    } finally {
      setIsSubmittingUsername(false)
    }
  }

  // Обработчик изменения пароля
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return
    }

    setIsSubmittingPassword(true)

    try {
      const { success, error } = await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      )

      if (success) {
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        throw new Error(error)
      }
    } catch (error: any) {
      console.error('Error changing password:', error)
    } finally {
      setIsSubmittingPassword(false)
    }
  }

  // Обработчик запроса прав администратора
  const handleAdminRequest = async () => {
    if (userData.hasPendingAdminRequest) {
      notify({
        type: 'error',
        title: 'Ошибка',
        message: 'Заявка уже подана и ожидает рассмотрения'
      });
      return;
    }

    setIsSubmittingAdminRequest(true);
    
    try {
      const { success, error } = await requestAdminRole();

      if (success) {
        // Обновляем данные пользователя после успешной отправки запроса
        await refreshUser();
        
        notify({
          type: 'success',
          title: 'Успешно',
          message: 'Заявка на получение прав администратора отправлена'
        });
      } else {
        throw new Error(error);
      }
    } catch (error: any) {
      console.error('Error requesting admin role:', error);
      notify({
        type: 'error',
        title: 'Ошибка',
        message: error.message || 'Ошибка при отправке заявки'
      });
    } finally {
      setIsSubmittingAdminRequest(false);
    }
  };

  return (
    <>
      {/* Секция изменения имени пользователя */}
      <Section icon={<FontAwesomeIcon icon={faUserEdit} />} title="Изменение имени пользователя">
        <form onSubmit={handleSaveUsername} className="space-y-4">
          <InputField
            id="newUsername"
            label="Новое имя пользователя"
            type="text"
            value={usernameForm.newUsername}
            onChange={(e) => setUsernameForm({...usernameForm, newUsername: e.target.value})}
          />
          <InputField
            id="currentPasswordForNewUsername"
            label="Текущий пароль"
            type="password"
            value={usernameForm.currentPassword}
            onChange={(e) => setUsernameForm({...usernameForm, currentPassword: e.target.value})}
          />
          <Button
            type="button"
            variant="disabled"
            disabled={isSubmittingUsername}
            icon={faLock}
          >
            Недоступно
          </Button>
        </form>
      </Section>

      {/* Секция изменения пароля */}
      <Section icon={<FontAwesomeIcon icon={faKey} />} title="Изменение пароля">
        <form onSubmit={handleSavePassword} className="space-y-4">
          <InputField
            id="currentPasswordForNewPassword"
            label="Текущий пароль"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
          />
          <InputField
            id="newPassword"
            label="Новый пароль"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
          />
          <InputField
            id="confirmPassword"
            label="Повтор нового пароля"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmittingPassword}
            icon={faCheck}
          >
            Сохранить изменения
          </Button>
        </form>
      </Section>

      {/* Секция запроса прав администратора (только для обычных пользователей) */}
      {userData.role === 'user' && (
        <Section icon={<FontAwesomeIcon icon={faUserShield} />} title="Запрос прав администратора">
          <p className="text-sm text-gray-500 mb-4">
            {userData.hasPendingAdminRequest 
              ? "Ваш запрос находится на рассмотрении" 
              : "Отправьте запрос, чтобы получить расширенные права в системе"}
          </p>
          <Button
            onClick={handleAdminRequest}
            type="submit"
            disabled={userData.hasPendingAdminRequest || isSubmittingAdminRequest}
            variant={userData.hasPendingAdminRequest ? 'disabled' : 'primary'}
            icon={userData.hasPendingAdminRequest ? faLock : faPaperPlane}
          >
            {userData.hasPendingAdminRequest ? 'Запрос отправлен' : 'Отправить запрос'}
          </Button>
        </Section>
      )}
    </>
  )
}
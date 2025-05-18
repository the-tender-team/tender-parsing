'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { useNotification } from '@/libs/NotificationProvider'
import InputField from '../ModalnputField'
import Section from '../ModalSection'
import Button from '../../components/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserShield, faUserEdit, faKey } from '@fortawesome/free-solid-svg-icons'

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
  const { notify } = useNotification()
  const { changePassword, requestAdminRole, refreshUser } = useAuth()
  
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
  const [adminRequested, setAdminRequested] = useState(userData.hasPendingAdminRequest || false)
  const [isSubmittingAdminRequest, setIsSubmittingAdminRequest] = useState(false)

  // Проверяем статус запроса при загрузке
  useEffect(() => {
    setAdminRequested(userData.hasPendingAdminRequest || false)
  }, [userData.hasPendingAdminRequest])

  // Обработчик изменения username
  const handleSaveUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!usernameForm.newUsername || !usernameForm.currentPassword) {
      notify({ title: 'Ошибка', message: 'Заполните все поля', type: 'error' })
      return
    }

    setIsSubmittingUsername(true)

    try {
      const res = await fetch('/api/auth/change-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_username: usernameForm.newUsername,
          current_password: usernameForm.currentPassword
        }),
        credentials: 'include'
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.detail || 'Ошибка изменения имени пользователя')
      }

      const data = await res.json()
      notify({ 
        title: 'Успех', 
        message: `Имя пользователя изменено на ${data.newUsername}`, 
        type: 'success' 
      })
      setUsernameForm(prev => ({ ...prev, currentPassword: '' }))
      await refreshUser()
    } catch (error: any) {
      notify({ 
        title: 'Ошибка', 
        message: error.message || 'Не удалось изменить имя пользователя', 
        type: 'error' 
      })
    } finally {
      setIsSubmittingUsername(false)
    }
  }

  // Обработчик изменения пароля
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      notify({ title: 'Ошибка', message: 'Заполните все поля', type: 'error' })
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      notify({ title: 'Ошибка', message: 'Пароли не совпадают', type: 'error' })
      return
    }

    setIsSubmittingPassword(true)

    try {
      const { success, error } = await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      )

      if (success) {
        notify({ title: 'Успешно', message: 'Вы изменили пароль.', type: 'success' })
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        throw new Error(error || 'Ошибка изменения пароля')
      }
    } catch (error: any) {
      notify({ title: 'Ошибка', message: error.message, type: 'error' })
    } finally {
      setIsSubmittingPassword(false)
    }
  }

  // Обработчик запроса прав администратора
  const handleAdminRequest = async () => {
    setIsSubmittingAdminRequest(true)
    
    try {
      const res = await fetch('/api/admin-request', {
        method: 'POST',
        credentials: 'include'
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || 'Ошибка сервера')
      }

      const data = await res.json()
      notify({
        title: 'Успех',
        message: data.msg || 'Запрос отправлен администратору',
        type: 'success'
      })
      setAdminRequested(true)

    } catch (error: any) {
      notify({
        title: 'Ошибка',
        message: error.message || 'Не удалось отправить запрос',
        type: 'error'
      })
    } finally {
      setIsSubmittingAdminRequest(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Секция изменения username */}
      <Section icon={<FontAwesomeIcon icon={faUserEdit} />} title="Изменение электронной почты">
        <form onSubmit={handleSaveUsername} className="space-y-4">
          <InputField
            id="newUsername"
            label="Новая электронная почта"
            type="text"
            value={usernameForm.newUsername}
            onChange={(e) => setUsernameForm({...usernameForm, newUsername: e.target.value})}
          />
          <InputField
            id="currentPassword"
            label="Текущий пароль"
            type="password"
            value={usernameForm.currentPassword}
            onChange={(e) => setUsernameForm({...usernameForm, currentPassword: e.target.value})}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmittingUsername}
            className="w-full sm:w-auto"
          >
            Сохранить изменения
          </Button>
        </form>
      </Section>

      {/* Секция изменения пароля */}
      <Section icon={<FontAwesomeIcon icon={faKey} />} title="Изменение пароля">
        <form onSubmit={handleSavePassword} className="space-y-4">
          <InputField
            id="currentPassword"
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
            className="w-full sm:w-auto"
          >
            Сохранить изменения
          </Button>
        </form>
      </Section>

      {/* Секция запроса прав администратора (только для обычных пользователей) */}
      {userData.role === 'user' && (
        <Section icon={<FontAwesomeIcon icon={faUserShield} />} title="Запрос прав администратора">
          <p className="text-sm text-gray-500 mb-4">
            {adminRequested 
              ? "Ваш запрос находится на рассмотрении" 
              : "Отправьте запрос, чтобы получить расширенные права в системе"}
          </p>
          <Button
            onClick={handleAdminRequest}
            type="submit"
            disabled={adminRequested || isSubmittingAdminRequest}
            variant={adminRequested ? 'disabled' : 'primary'}
            className="w-full sm:w-auto"
          >
            {adminRequested ? 'Запрос отправлен' : 'Отправить запрос'}
          </Button>
        </Section>
      )}
    </div>
  )
}
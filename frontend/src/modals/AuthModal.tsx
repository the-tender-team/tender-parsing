'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNotification } from '@/libs/NotificationProvider'
import { validateAuthData } from '@/libs/validation'
import { useAuth } from '@/providers/AuthProvider'
import IconButton from '@/components/IconButton'
import ModalWindow from './ModalWindow'
import InputField from './ModalInputField'
import Button from '@/components/Button'
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons'

type Tab = 'login' | 'register'

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const { notify } = useNotification()
  const { login, register } = useAuth()
  
  const [activeTab, setActiveTab] = useState<'login'|'register'>('login')
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const validationResult = validateAuthData({
        username: formData.username,
        password: formData.password,
        confirmPassword: activeTab === 'register' ? formData.confirmPassword : undefined
      })

      if (!validationResult.isValid) {
        setError(validationResult.error || 'Ошибка валидации')
        return
      }

      if (activeTab === 'register') {
        const { success, error } = await register(formData.username, formData.password)
        if (success) {
          notify({
            title: 'Успешно',
            message: 'Регистрация выполнена успешно',
            type: 'success'
          })
          onClose()
        } else {
          setError(error || 'Ошибка при регистрации')
        }
      } else {
        const { success, error } = await login(formData.username, formData.password)
        if (success) {
          notify({
            title: 'Успешно',
            message: 'Вход выполнен успешно',
            type: 'success'
          })
          onClose()
        } else {
          setError(error || 'Ошибка при входе')
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  const iconButtons = (
    <>
      <IconButton
        onClick={() => setActiveTab("login")}
        icon={faSignInAlt}
        title="Вход"
        tabKey="login"
        activeTab={activeTab}
        
      />
      <IconButton
        onClick={() => setActiveTab("register")}
        icon={faUserPlus}
        title="Регистрация"
        tabKey="register"
        activeTab={activeTab}
      />
    </>
  );

  const titleMap: Record<Tab, string> = {
    login: 'Вход',
    register: 'Регистрация'
  }

  return (
    <ModalWindow 
      isOpen={isOpen}
      onClose={onClose}
      title={titleMap[activeTab]}
      iconButtons={iconButtons}
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <InputField
              id="username"
              label="Имя пользователя"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
            />
            
            <InputField
              id="password"
              label="Пароль"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            
            {activeTab === 'register' && (
              <InputField
                id="confirmPassword"
                label="Повтор пароля"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            )}
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
            >
              {activeTab === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </div>
        </form>
      </div>
    </ModalWindow>
  )
}
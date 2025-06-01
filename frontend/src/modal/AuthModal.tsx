'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useNotification } from '@/providers/NotificationProvider'
import { useAuth } from '@/providers/AuthProvider'
import { validateAuthData } from '@/libs/validation'
import IconButton from '@/components/IconButton'
import ModalWindow from '@/components/Modal'
import Button from '@/components/Button'
import InputField from './ModalInputField'
import { faSignInAlt, faUserPlus, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Tab = 'login' | 'register'

const defaultFormData = {
  username: '',
  password: '',
  confirmPassword: ''
}

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const { notify } = useNotification()
  const { login, register } = useAuth()
  
  const [activeTab, setActiveTab] = useState<Tab>('login')
  const [formData, setFormData] = useState(defaultFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  // При открытии окна сбрасываем форму
  useEffect(() => {
    if (isOpen) {
      setFormData(defaultFormData)
    } else {
      // При закрытии окна сбрасываем таб
      setActiveTab('login')
    }
  }, [isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Если уже идет загрузка, не делаем ничего
    if (isLoading) return
    
    setIsLoading(true)

    try {
      const validationResult = validateAuthData({
        username: formData.username,
        password: formData.password,
        confirmPassword: activeTab === 'register' ? formData.confirmPassword : undefined
      })

      if (!validationResult.isValid) {
        notify({
          title: 'Ошибка',
          message: validationResult.error || 'Ошибка валидации',
          type: 'error'
        })
        setIsLoading(false)
        return
      }

      if (activeTab === 'register') {
        const { success } = await register(formData.username, formData.password)
        if (success) {
          onClose()
        }
      } else {
        const { success } = await login(formData.username, formData.password)
        if (success) {
          onClose()
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      notify({
        title: 'Ошибка',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка',
        type: 'error'
      })
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
        <div className="flex justify-end items-center gap-2">
          {isLoading && (
            <FontAwesomeIcon icon={faSpinner} className="text-indigo-600 animate-spin text-xl" />
          )}
          <Button
            type="submit"
            variant={isLoading ? "disabled" : "primary"}
            disabled={isLoading}
          >
            {activeTab === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </div>
      </form>
    </ModalWindow>
  )
}
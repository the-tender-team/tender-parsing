'use client'

import { useState } from 'react'
import { useNotification } from '@/components/ui/NotificationProvider'
import ModalTemplate from './Template'
import { validateAuthData } from '@/libs/validation'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
}

export default function ModalMain({ isOpen, onClose, onLogin }: AuthModalProps) {
  const { notify } = useNotification()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })

  const iconButtons = (
    <>
      <button
        onClick={() => setActiveTab('login')}
        className={`text-xl font-bold pb-1 border-b-2 transition ${
          activeTab === 'login' ? 'border-white' : 'border-transparent text-indigo-200'
        }`}
      >
        Вход
      </button>
      <button
        onClick={() => setActiveTab('register')}
        className={`text-xl font-bold pb-1 border-b-2 transition ${
          activeTab === 'register' ? 'border-white' : 'border-transparent text-indigo-200'
        }`}
      >
        Регистрация
      </button>
    </>
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const dataToValidate =
      activeTab === 'register'
        ? {
            username: formData.username,
            password: formData.password,
            confirmPassword: formData.confirmPassword
          }
        : {
            username: formData.username,
            password: formData.password
          }

    const { valid, errors } = validateAuthData(dataToValidate)

    if (!valid) {
      errors.forEach(err => notify({ title: 'Ошибка', message: err, type: 'error' }))
      return
    }

    try {
      const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/register'

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.detail || 'Ошибка входа')
      }

      if (activeTab === 'register') {
        notify({ title: 'Успешно', message: 'Вы зарегистрировались, теперь можете войти.', type: 'success' })
        setActiveTab('login')
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
        return
      }

      const me = await fetch('/api/auth/me')
      const user = await me.json()
      localStorage.setItem('user', JSON.stringify(user))
      notify({ title: 'Успешно', message: 'Вы вошли в свой аккаунт.', type: 'success' })
      onLogin()
    } catch (error: any) {
      notify({ title: 'Ошибка', message: error.message, type: 'error' })
    }
  }

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      title={'Авторизация'}
      iconButtons={iconButtons}
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-base font-medium text-gray-700 mb-1">
                Электронная почта
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            {activeTab === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700 mb-1">
                  Повтор пароля
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300 font-medium"
            >
              {activeTab === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </div>
        </form>
      </div>
    </ModalTemplate>
  )
}
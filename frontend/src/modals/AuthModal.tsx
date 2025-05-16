'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
}

export default function AuthModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [notification, setNotification] = useState({
    show: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'error'
  })

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }))
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notification.show])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setNotification({
        show: true,
        title: 'Ошибка',
        message: 'Пожалуйста, заполните все поля',
        type: 'error'
      })
      return
    }

    // Имитация успешного входа/регистрации
    onLogin()
    setNotification({
      show: true,
      title: activeTab === 'login' ? 'Успешный вход' : 'Регистрация успешна',
      message: activeTab === 'login' ? 'Вы успешно авторизовались' : 'Вы успешно зарегистрированы',
      type: 'success'
    })
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">

          {/* Header with Tabs */}
          <div className="bg-indigo-600 text-white p-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  className={`text-xl font-bold pb-1 border-b-2 transition ${
                    activeTab === 'login' ? 'border-white' : 'border-transparent text-indigo-200'
                  }`}
                  onClick={() => setActiveTab('login')}
                >
                  Вход
                </button>
                <button
                  className={`text-xl font-bold pb-1 border-b-2 transition ${
                    activeTab === 'register' ? 'border-white' : 'border-transparent text-indigo-200'
                  }`}
                  onClick={() => setActiveTab('register')}
                >
                  Регистрация
                </button>
              </div>
              <button onClick={onClose} className="text-white hover:text-indigo-200 transition-colors">
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-1">
                    Электронная почта
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    required
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
                    required
                  />
                </div>
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
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className="fixed top-5 right-5 bg-white rounded-lg shadow-lg p-4 max-w-sm z-50 animate-fade-in">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FontAwesomeIcon 
                icon={notification.type === 'error' ? faExclamationCircle : faCheckCircle} 
                className={`text-xl ${notification.type === 'error' ? 'text-red-500' : 'text-green-500'}`} 
              />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
              className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

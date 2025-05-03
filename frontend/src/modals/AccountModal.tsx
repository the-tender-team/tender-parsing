'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCog, 
  faSignOutAlt, 
  faUserShield, 
  faCheckCircle, 
  faExclamationCircle, 
  faInfoCircle, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons'

export default function AccountModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [settingsActive, setSettingsActive] = useState(false)

  const [notification, setNotification] = useState<{
    show: boolean
    title: string
    message: string
    type: 'success' | 'error' | 'info'
  }>({ show: false, title: '', message: '', type: 'success' })

  const [userData, setUserData] = useState({
    email: "user@example.com",
    role: "Пользователь",
    regDate: "2025-05-01 12:34:56",
    userId: "#123456"
  })

  const [formData, setFormData] = useState({
    newEmail: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [adminRequested, setAdminRequested] = useState(false)

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

    const { newEmail, currentPassword, newPassword, confirmPassword } = formData

    // Валидация пароля при попытке изменить его
    if (newPassword || currentPassword) {
      if (!currentPassword) {
        showNotification('Ошибка', 'Пожалуйста, введите Ваш текущий пароль.', 'error')
        return
      }
      
      if (newPassword !== confirmPassword) {
        showNotification('Ошибка', 'Новый пароль не подходит.', 'error')
        return
      }
      
      if (newPassword.length < 8) {
        showNotification('Ошибка', 'В пароле должно быть минимум 8 символов.', 'error')
        return
      }
    }
    
    // Update email if changed
    if (newEmail) {
      setUserData(prev => ({ ...prev, email: newEmail }))
      setFormData(prev => ({ ...prev, newEmail: '' }))
    }
    
    // Clear form
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }))
    
    // Close settings panel
    setSettingsActive(false)
    
    // Show success notification
    showNotification('Успешно', 'Ваши изменения были сохранены.', 'success')
  }

  const handleAdminRequest = () => {
    showNotification('Успешно', 'Ваш запрос на получение прав администратора был отправлен.', 'info')
    setAdminRequested(true)
  }

  const handleLogout = () => {
    showNotification('Выход из аккаута', 'Вы успешно вышли из своей учётной записи.', 'info')
    // In a real app, this would redirect to logout endpoint
    setTimeout(() => {
      window.location.href = '/'
    }, 1500)
  }

  const showNotification = (title: string, message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ show: true, title, message, type })
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
          
          {/* Header */}
          <div className="bg-indigo-600 text-white p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Личный кабинет</h1>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSettingsActive(!settingsActive)} 
                  className="text-white hover:text-indigo-200 transition-colors"
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
          
          {/* Информация об аккаунте */}
          <div className="p-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Информация об аккаунте</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Электронная почта</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Роль</p>
                    <p className="font-medium">{userData.role}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Дата и время регистрации</p>
                    <p className="font-medium">{userData.regDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ID</p>
                    <p className="font-medium">{userData.userId}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Кнопки */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors font-medium"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Выйти
              </button>
              {userData.role !== "Admin" && (
                <button 
                  onClick={handleAdminRequest}
                  disabled={adminRequested}
                  className={`flex items-center gap-2 ${adminRequested ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white py-2 px-4 rounded-md transition-colors font-medium`}
                >
                  <FontAwesomeIcon icon={faUserShield} />
                  {adminRequested ? 'Запрос отправлен' : 'Запросить права администратора'}
                </button>
              )}
            </div>
            
            {/* Настройки аккаунта */}
            <div 
              className={`bg-gray-50 p-4 rounded-lg transition-all duration-300 overflow-hidden ${settingsActive ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Настройки аккаунта</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Блок изменения электронной почты */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">Изменить электронную почту</h3>
                  <div className="space-y-3">
                    <div>
                      {/*<label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1">Новый Email</label>*/}
                      <input 
                        type="email" 
                        id="newEmail" 
                        value={formData.newEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                        placeholder="Введите новый email" 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Линия-разделитель */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center"></div>
                </div>
                
                {/* Блок изменения пароля */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">Изменить пароль</h3>
                  <div className="space-y-3">
                    <div>
                      {/*<label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Текущий пароль</label>*/}
                      <input 
                        type="password" 
                        id="currentPassword" 
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                        placeholder="Введите текущий пароль" 
                      />
                    </div>
                    <div>
                      {/*<label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Новый пароль</label>*/}
                      <input 
                        type="password" 
                        id="newPassword" 
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                        placeholder="Введите новый пароль" 
                      />
                    </div>
                    <div>
                      {/*<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Подтвердите новый пароль</label>*/}
                      <input 
                        type="password" 
                        id="confirmPassword" 
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                        placeholder="Подтвердите новый пароль" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setSettingsActive(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Отмена
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Сохранить изменения
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className="fixed top-5 right-5 bg-white rounded-lg shadow-lg p-4 max-w-sm z-50 animate-fade-in">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FontAwesomeIcon 
                icon={
                  notification.type === 'error' ? faExclamationCircle : 
                  notification.type === 'info' ? faInfoCircle : faCheckCircle
                } 
                className={`text-xl ${
                  notification.type === 'error' ? 'text-red-500' : 
                  notification.type === 'info' ? 'text-blue-500' : 'text-green-500'
                }`} 
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

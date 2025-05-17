'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserShield } from '@fortawesome/free-solid-svg-icons'
import { useNotification } from '@/components/ui/NotificationProvider'
import { validateSettingsData } from '@/libs/validation'

interface UserData {
  username?: string
  role?: string
  regDate?: string
  userId?: string
}

interface Props {
  userData: UserData
}

export default function SettingsTab({ userData }: Props) {
  const { notify } = useNotification()

  const [formData, setFormData] = useState({
    newUsername: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [adminRequested, setAdminRequested] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault()

    const { newUsername } = formData

    if (!newUsername) {
      return notify({ title: 'Ошибка', message: 'Необходимо заполнить все поля.', type: 'error' })
    }

    try {
      const res = await fetch('/api/auth/change-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({new_username: newUsername})
      })

      const data = await res.json()
      if (res.ok) {
        notify({ title: 'Успешно', message: 'Электронная почта обновлена.', type: 'success' })
        setFormData(prev => ({ ...prev, newUsername: '' }))
      } else {
        notify({ title: 'Ошибка', message: 'Возникла ошибка при смене пароля.\n' + data.detail, type: 'error' })
      }
    } catch (err: any) {
      notify({ title: 'Ошибка', message: 'Возникла ошибка сервера.\n' + err.message, type: 'error' })
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    const { currentPassword, newPassword, confirmPassword } = formData

    if (!currentPassword || !newPassword || !confirmPassword) {
      return notify({ title: 'Ошибка', message: 'Заполните все поля.', type: 'error' })
    }

    if (newPassword !== confirmPassword) {
      return notify({ title: 'Ошибка', message: 'Пароли не совпадают.', type: 'error' })
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword
        })
      })

      const data = await res.json()
      if (res.ok) {
        notify({ title: 'Успешно', message: data.msg || 'Пароль обновлён.', type: 'success' })
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
      } else if (res.status === 401) {
        notify({ title: 'Ошибка', message: 'Пароль не соответствует требованиям.', type: 'error' })
      } else {
        notify({ title: 'Ошибка', message: 'Ошибка при смене пароля.', type: 'error' })
        console.error(data.detail)
      }
    } catch (err: any) {
      notify({ title: 'Ошибка', message: 'Ошибка сервера.', type: 'error' })
      console.error(err.message)
    }
  }

  const handleAdminRequest = async () => {
    try {
      const res = await fetch('/api/auth/admin-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })

      const data = await res.json()

      if (res.status === 200) {
        notify({ title: 'Успешно', message: 'Заявка отправлена.', type: 'success' })
        setAdminRequested(true)
      } else if (res.status === 400) {
        notify({ title: 'Ошибка', message: 'Заявка уже отправлена.', type: 'error' })
      } else if (res.status === 403) {
        notify({ title: 'Ошибка', message: 'Недостаточно прав для отправки заявки.', type: 'error' })
      } else {
        notify({ title: 'Ошибка', message: 'Неизвестная ошибка.', type: 'error' })
      }
    } catch (err: any) {
      notify({ title: 'Ошибка', message: 'Ошибка сервера.', type: 'error' })
      console.error(err.message)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Изменить электронную почту (в разработке)</h2>
        <form onSubmit={handleUsernameChange} className="space-y-4">
          <label htmlFor="newUsername" className="block text-base font-medium text-gray-700 mb-1">
            Новая электронная почта
          </label>
          <input
            type="text"
            id="newUsername"
            value={formData.newUsername}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
            disabled
          >
            Недоступно
          </button>
        </form>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Изменить пароль</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <label htmlFor="newUsername" className="block text-base font-medium text-gray-700 mb-1">
            Текущий пароль
          </label>
          <input
            type="password"
            id="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <label htmlFor="newUsername" className="block text-base font-medium text-gray-700 mb-1">
            Новый пароль
          </label>
          <input
            type="password"
            id="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <label htmlFor="newUsername" className="block text-base font-medium text-gray-700 mb-1">
            Повтор нового пароля
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Сохранить изменения
          </button>
        </form>
      </div>

      {userData.role === 'user' && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Запросить права администратора</h2>
          <p className="text-sm text-gray-500 mb-4">
            Ваша заявка будет рассмотрена владельцем. После одобрения вы получите права администратора.
          </p>
          <button
            onClick={handleAdminRequest}
            disabled={adminRequested}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition-colors ${
              adminRequested ? 'bg-gray-500' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <FontAwesomeIcon icon={faUserShield} />
            {adminRequested ? 'Заявка отправлена' : 'Отправить заявку'}
          </button>
        </div>
      )}
    </div>
  )
}

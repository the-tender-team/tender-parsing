'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

export default function AccountTab({
  userData,
  onLogout
}: {
  userData: {
    username?: string
    role?: string
    regDate?: string
    userId?: string
  }
  onLogout: () => void
}) {
  const displayData = (value?: string) =>
    value || <span className="text-gray-400">Нет данных</span>

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'owner': return 'Владелец'
      case 'admin': return 'Администратор'
      case 'user': return 'Пользователь'
      default: return 'Нет данных'
    }
  }

  return (
    <div className="p-6">
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Информация об аккаунте</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Электронная почта</p>
              <p className="font-medium">{displayData(userData.username)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Роль</p>
              <p className="font-medium">{displayData(getRoleLabel(userData.role))}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Дата и время регистрации</p>
              <p className="font-medium">{displayData(userData.regDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ID</p>
              <p className="font-medium">{displayData(userData.userId)}</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors font-medium"
      >
        <FontAwesomeIcon icon={faSignOutAlt} />
        Выйти
      </button>
    </div>
  )
}

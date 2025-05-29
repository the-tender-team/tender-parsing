'use client'

import React, { createContext, useContext } from 'react'
import { useNotification } from '@/libs/NotificationProvider'
import { useAuth } from './AuthProvider'

interface AdminRequest {
  id: number
  username: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

interface AdminContextType {
  requestAdminRole: () => Promise<{ success: boolean; error?: string }>
  handleAdminRequest: (username: string, action: 'approve' | 'reject') => Promise<{ success: boolean; error?: string }>
  fetchAdminRequests: () => Promise<{ success: boolean; data?: AdminRequest[]; error?: string }>
}

const AdminContext = createContext<AdminContextType>({
  requestAdminRole: async () => ({ success: false }),
  handleAdminRequest: async () => ({ success: false }),
  fetchAdminRequests: async () => ({ success: false })
})

export function useAdmin() {
  return useContext(AdminContext)
}

export const ControlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notify } = useNotification()
  const { user, refreshUser } = useAuth()

  const requestAdminRole = async () => {
    try {
      // Проверяем авторизацию
      if (!user) {
        notify({
          title: 'Ошибка',
          message: 'Необходима авторизация',
          type: 'error'
        })
        return { success: false, error: 'Необходима авторизация' }
      }

      // Проверяем роль
      if (user.role !== 'user') {
        notify({
          title: 'Ошибка',
          message: 'Заявку могут подавать только пользователи',
          type: 'error'
        })
        return { success: false, error: 'Недостаточно прав (роль не user)' }
      }

      const res = await fetch('/api/auth/admin-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      // Если получили 401, пробуем обновить данные пользователя
      if (res.status === 401) {
        const refreshResult = await refreshUser()
        if (!refreshResult) {
          notify({
            title: 'Ошибка',
            message: 'Сессия истекла, необходимо войти заново',
            type: 'error'
          })
          return { success: false, error: 'Сессия истекла' }
        }
      }

      if (!res.ok) {
        let error;
        try {
          error = await res.json()
        } catch (e) {
          const text = await res.text()
          error = { detail: text || 'Ошибка сервера' }
        }

        const errorMessage = error.detail || 'Ошибка подачи заявки'
        notify({
          title: 'Ошибка',
          message: errorMessage,
          type: 'error'
        })
        return { success: false, error: errorMessage }
      }

      // После успешной подачи заявки обновляем данные пользователя
      await refreshUser()

      notify({
        title: 'Успешно',
        message: 'Заявка успешно подана',
        type: 'success'
      })
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка подачи заявки'
      notify({
        title: 'Ошибка',
        message: errorMessage,
        type: 'error'
      })
      return { success: false, error: errorMessage }
    }
  }

  const handleAdminRequest = async (username: string, action: 'approve' | 'reject') => {
    try {
      // Проверяем авторизацию
      if (!user) {
        notify({
          title: 'Ошибка',
          message: 'Необходима авторизация',
          type: 'error'
        })
        return { success: false, error: 'Необходима авторизация' }
      }

      // Проверяем роль
      if (user.role !== 'owner') {
        notify({
          title: 'Ошибка',
          message: 'Недостаточно прав для обработки заявок',
          type: 'error'
        })
        return { success: false, error: 'Недостаточно прав' }
      }

      // Проверяем валидность параметров
      if (!username || !['approve', 'reject'].includes(action)) {
        notify({
          title: 'Ошибка',
          message: 'Некорректные параметры запроса',
          type: 'error'
        })
        return { success: false, error: 'Некорректные параметры запроса' }
      }

      const res = await fetch(`/api/auth/admin-requests/${action}/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      // Если получили 401, пробуем обновить данные пользователя
      if (res.status === 401) {
        const refreshResult = await refreshUser()
        if (!refreshResult) {
          notify({
            title: 'Ошибка',
            message: 'Сессия истекла, необходимо войти заново',
            type: 'error'
          })
          return { success: false, error: 'Сессия истекла' }
        }
      }

      if (!res.ok) {
        let error;
        try {
          error = await res.json()
        } catch (e) {
          const text = await res.text()
          error = { detail: text || 'Ошибка сервера' }
        }

        const errorMessage = error.detail || `Ошибка при ${action === 'approve' ? 'одобрении' : 'отклонении'} заявки`
        notify({
          title: 'Ошибка',
          message: errorMessage,
          type: 'error'
        })
        return { success: false, error: errorMessage }
      }

      const data = await res.json()
      
      // После успешного действия обновляем данные пользователя
      await refreshUser()
      
      notify({
        title: 'Успешно',
        message: data.msg || `Заявка успешно ${action === 'approve' ? 'одобрена' : 'отклонена'}`,
        type: 'success'
      })
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка обработки заявки'
      notify({
        title: 'Ошибка',
        message: errorMessage,
        type: 'error'
      })
      return { success: false, error: errorMessage }
    }
  }

  const fetchAdminRequests = async () => {
    try {
      if (!user || user.role !== 'owner') {
        notify({
          title: 'Ошибка',
          message: 'Недостаточно прав для просмотра заявок',
          type: 'error'
        })
        return { success: false, error: 'Недостаточно прав' }
      }

      const res = await fetch('/api/auth/admin-requests', {
        credentials: 'include'
      })
      
      if (!res.ok) {
        const error = await res.json()
        notify({
          title: 'Ошибка',
          message: error.detail || 'Ошибка загрузки заявок',
          type: 'error'
        })
        return { success: false, error: error.detail || 'Ошибка загрузки заявок' }
      }
      
      const data = await res.json()
      return { success: true, data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки заявок'
      notify({
        title: 'Ошибка',
        message: errorMessage,
        type: 'error'
      })
      return { success: false, error: errorMessage }
    }
  }

  return (
    <AdminContext.Provider value={{
      requestAdminRole,
      handleAdminRequest,
      fetchAdminRequests
    }}>
      {children}
    </AdminContext.Provider>
  )
} 
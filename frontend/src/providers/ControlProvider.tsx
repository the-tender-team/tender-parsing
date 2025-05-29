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
      const res = await fetch('/api/auth/admin-request', {
        method: 'POST',
        credentials: 'include'
      })

      if (!res.ok) {
        const error = await res.json()
        let errorMessage = 'Ошибка подачи заявки'

        switch (res.status) {
          case 400:
            errorMessage = 'Заявка уже подана и ожидает рассмотрения'
            break
          case 403:
            errorMessage = 'Недостаточно прав (роль не user)'
            break
        }

        notify({
          title: 'Ошибка',
          message: error.detail || errorMessage,
          type: 'error'
        })
        return { success: false, error: error.detail || errorMessage }
      }

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
      if (!user || user.role !== 'owner') {
        notify({
          title: 'Ошибка',
          message: 'Недостаточно прав для обработки заявок',
          type: 'error'
        })
        return { success: false, error: 'Недостаточно прав' }
      }

      const res = await fetch(`/api/auth/admin-requests/${action}/${username}`, {
        method: 'POST',
        credentials: 'include'
      })

      if (!res.ok) {
        const error = await res.json()
        notify({
          title: 'Ошибка',
          message: error.detail || `Ошибка при ${action === 'approve' ? 'одобрении' : 'отклонении'} заявки`,
          type: 'error'
        })
        return { success: false, error: error.detail }
      }

      const data = await res.json()
      notify({
        title: 'Успешно',
        message: data.msg,
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
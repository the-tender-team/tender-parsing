'use client'

import React, { createContext, useContext } from 'react'
import { useNotification } from '@/providers/NotificationProvider'
import { useAuth } from '@/providers/AuthProvider'
import { validateChangePasswordData } from '@/libs/validation'

interface UserContextType {
  changeUsername: (newUsername: string, currentPassword: string) => Promise<{ success: boolean; error?: string }>
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
  checkAdminRequestStatus: (username: string) => Promise<{ success: boolean; data?: AdminRequest; error?: string }>
  requestAdminRole: () => Promise<{ success: boolean; error?: string }>
}

interface AdminRequest {
  id: number
  username: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

const UserContext = createContext<UserContextType>({
  changeUsername: async () => ({ success: false }),
  changePassword: async () => ({ success: false }),
  checkAdminRequestStatus: async () => ({ success: false }),
  requestAdminRole: async () => ({ success: false })
})

export function useUser() {
  return useContext(UserContext)
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notify } = useNotification()
  const { user, refreshUser } = useAuth()

  const changeUsername = async (newUsername: string, currentPassword: string) => {
    try {
      const validationResult = validateChangePasswordData({
        newUsername,
        currentPassword
      });

      if (!validationResult.isValid) {
        notify({
          title: 'Ошибка валидации',
          message: validationResult.error || 'Ошибка валидации данных',
          type: 'error'
        });
        return { success: false, error: validationResult.error };
      }

      const res = await fetch('/api/auth/change-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          new_username: newUsername,
          current_password: currentPassword
        }),
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        notify({
          title: 'Ошибка',
          message: data.detail || 'Ошибка при изменении имени пользователя',
          type: 'error'
        });
        return { success: false, error: data.detail };
      }

      notify({
        title: 'Успешно',
        message: `Имя пользователя изменено на ${data.newUsername}`,
        type: 'success'
      });

      return { success: true };
    } catch (error) {
      console.error('Error changing username:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      notify({
        title: 'Ошибка',
        message: errorMessage,
        type: 'error'
      });
      return { success: false, error: errorMessage };
    }
  }

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
      })

      if (!res.ok) {
        const error = await res.json()
        let errorMessage = 'Ошибка изменения пароля'

        switch (res.status) {
          case 401:
            errorMessage = 'Старый пароль неверен'
            break
          case 404:
            errorMessage = 'Пользователь не найден'
            break
        }

        notify({
          title: 'Ошибка',
          message: error.detail || errorMessage,
          type: 'error'
        })
        return { success: false, error: error.detail || errorMessage }
      }

      notify({
        title: 'Успешно',
        message: 'Пароль успешно изменён',
        type: 'success'
      })
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка изменения пароля'
      notify({
        title: 'Ошибка',
        message: errorMessage,
        type: 'error'
      })
      return { success: false, error: errorMessage }
    }
  }

  const checkAdminRequestStatus = async (username: string) => {
    try {
      const res = await fetch(`/api/auth/admin-request-status/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!res.ok) {
        const error = await res.json()
        notify({
          title: 'Ошибка',
          message: error.detail || 'Ошибка проверки статуса заявки',
          type: 'error'
        })
        return { success: false, error: error.detail || 'Ошибка проверки статуса заявки' }
      }

      const data = await res.json()
      return { success: true, data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка проверки статуса заявки'
      notify({
        title: 'Ошибка',
        message: errorMessage,
        type: 'error'
      })
      return { success: false, error: errorMessage }
    }
  }

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

      // Проверяем, нет ли уже активной заявки
      if (user.hasPendingAdminRequest) {
        notify({
          title: 'Ошибка',
          message: 'У вас уже есть активная заявка на рассмотрении',
          type: 'error'
        })
        return { success: false, error: 'Заявка уже существует' }
      }

      const res = await fetch('/api/auth/admin-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

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
      const refreshResult = await refreshUser()
      if (!refreshResult) {
        notify({
          title: 'Предупреждение',
          message: 'Заявка отправлена, но не удалось обновить данные пользователя',
          type: 'error'
        })
      }

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

  return (
    <UserContext.Provider value={{
      changeUsername,
      changePassword,
      checkAdminRequestStatus,
      requestAdminRole
    }}>
      {children}
    </UserContext.Provider>
  )
} 
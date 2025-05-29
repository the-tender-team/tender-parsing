'use client'

import React, { createContext, useContext } from 'react'
import { useNotification } from '@/libs/NotificationProvider'
import { validateChangePasswordData } from '@/libs/validation'

interface UserContextType {
  changeUsername: (newUsername: string, currentPassword: string) => Promise<{ success: boolean; error?: string }>
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
}

const UserContext = createContext<UserContextType>({
  changeUsername: async () => ({ success: false }),
  changePassword: async () => ({ success: false })
})

export function useUser() {
  return useContext(UserContext)
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notify } = useNotification()

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

  return (
    <UserContext.Provider value={{
      changeUsername,
      changePassword
    }}>
      {children}
    </UserContext.Provider>
  )
} 
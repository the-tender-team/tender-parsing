'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNotification } from '@/libs/NotificationProvider'

interface User {
  username: string
  role: 'user' | 'admin' | 'owner'
  createdAt?: string
  id?: number
  hasPendingAdminRequest?: boolean
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => false
})

export function useAuth() {
  return useContext(AuthContext)
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { notify } = useNotification()

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { 
        credentials: 'include',
        cache: 'no-store'
      })
      
      if (!res.ok) {
        setIsAuthenticated(false)
        setUser(null)
        return false
      }
      
      const data = await res.json()
      setUser({
        id: data.id,
        username: data.username,
        role: data.role,
        createdAt: data.created_at,
        hasPendingAdminRequest: data.has_pending_admin_request
      })
      setIsAuthenticated(true)
      return true
    } catch (error) {
      console.error('Failed to refresh user:', error)
      setUser(null)
      setIsAuthenticated(false)
      return false
    }
  }

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      })

      if (!res.ok) {
        let error;
        try {
          error = await res.json();
        } catch {
          const text = await res.text();
          error = { detail: text || 'Пустой или невалидный ответ от сервера' };
        }
        notify({
          title: 'Ошибка',
          message: error.detail || 'Ошибка входа',
          type: 'error'
        })
        return { success: false, error: error.detail || 'Ошибка входа' }
      }

      const refreshResult = await refreshUser()
      if (!refreshResult) {
        notify({
          title: 'Ошибка',
          message: 'Не удалось получить данные пользователя',
          type: 'error'
        })
        return { success: false, error: 'Не удалось получить данные пользователя' }
      }

      notify({
        title: 'Успешно',
        message: 'Вы вошли в свой аккаунт',
        type: 'success'
      })
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка входа'
      notify({
        title: 'Ошибка',
        message: errorMessage,
        type: 'error'
      })
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      })
      setUser(null)
      setIsAuthenticated(false)
      notify({ title: 'Успешно', message: 'Вы вышли из своего аккаунта.', type: 'success' })
    } catch (error) {
      console.error('Logout error:', error)
      notify({ 
        title: 'Ошибка', 
        message: error instanceof Error ? error.message : 'Ошибка при выходе', 
        type: 'error' 
      })
    }
  }

  const register = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!res.ok) {
        let error;
        try {
          error = await res.json();
        } catch {
          const text = await res.text();
          error = { detail: text || 'Пустой или невалидный ответ от сервера' };
        }
        notify({
          title: 'Ошибка',
          message: error.detail || 'Ошибка регистрации',
          type: 'error'
        })
        return { success: false, error: error.detail || 'Ошибка регистрации' }
      }

      notify({
        title: 'Успешно',
        message: 'Вы зарегистрировались. Теперь можете войти в свой аккаунт.',
        type: 'success'
      })
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка регистрации'
      notify({
        title: 'Ошибка',
        message: errorMessage,
        type: 'error'
      })
      return { success: false, error: errorMessage }
    }
  }

  if (loading) return null

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!user, 
      user, 
      login, 
      register,
      logout, 
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}
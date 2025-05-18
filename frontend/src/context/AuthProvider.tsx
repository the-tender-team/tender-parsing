'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id?: number
  username: string
  email?: string
  role: 'user' | 'admin' | 'owner'
  createdAt?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
  requestAdminRole: () => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {},
  changePassword: async () => ({ success: false }),
  requestAdminRole: async () => ({ success: false })
})

export function useAuth() {
  return useContext(AuthContext)
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include'
      })

      if (!res.ok) {
        setIsAuthenticated(false)
        setUser(null)
        return
      }

      const data = await res.json()
      setUser({
        id: data.id,
        username: data.username,
        role: data.role,
        createdAt: data.created_at
      })
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Failed to refresh user:', error)
      setUser(null)
      setIsAuthenticated(false)
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
      const error = await res.json()
      return { success: false, error: error.detail || 'Ошибка входа' }
    }

    await refreshUser()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Ошибка входа' }
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
        const error = await res.json()
        return { success: false, error: error.detail || 'Ошибка регистрации' }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Ошибка регистрации' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      })
    } finally {
      setUser(null)
    }
  }

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
      })

      if (!res.ok) {
        const error = await res.json()
        return { success: false, error: error.detail || 'Ошибка изменения пароля' }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Ошибка изменения пароля' }
    }
  }

  const requestAdminRole = async () => {
    try {
      const res = await fetch('/api/admin-request', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!res.ok) {
        const error = await res.json()
        return { success: false, error: error.detail || 'Ошибка подачи заявки' }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Ошибка подачи заявки' }
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
      refreshUser,
      changePassword,
      requestAdminRole
    }}>
      {children}
    </AuthContext.Provider>
  )
}
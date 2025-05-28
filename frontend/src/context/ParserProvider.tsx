'use client'

import React, { createContext, useContext } from 'react'
import { useNotification } from '@/libs/NotificationProvider'
import { FilterValue, ParseResponse, TableValue } from '@/types/tender'

interface ParserContextType {
  startParsing: (filters: FilterValue) => Promise<{ success: boolean; error?: string }>
  fetchTenders: (filters: FilterValue) => Promise<{ success: boolean; data?: TableValue[]; error?: string }>
}

const ParserContext = createContext<ParserContextType | undefined>(undefined)

export const useParser = () => {
  const context = useContext(ParserContext)
  if (!context) {
    throw new Error('useParser must be used within a ParserProvider')
  }
  return context
}

export const ParserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notify } = useNotification()

  const startParsing = async (filters: FilterValue) => {
    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(filters),
        credentials: 'include'
      })
      
      if (res.status === 401) {
        notify({
          title: 'Ошибка авторизации',
          message: 'Необходимо войти в систему',
          type: 'error'
        })
        return { success: false, error: 'Необходима авторизация' }
      }

      if (res.status === 403) {
        notify({
          title: 'Ошибка доступа',
          message: 'Недостаточно прав для запуска парсинга',
          type: 'error'
        })
        return { success: false, error: 'Недостаточно прав' }
      }
      
      let data;
      try {
        data = await res.json()
      } catch (e) {
        const text = await res.text()
        data = { detail: text || 'Пустой или невалидный ответ от сервера' }
      }
      
      if (!res.ok) {
        const error = data.detail || 'Ошибка запуска парсинга'
        notify({
          title: 'Ошибка',
          message: error,
          type: 'error'
        })
        return { success: false, error }
      }
      
      notify({
        title: 'Успешно',
        message: 'Парсинг запущен',
        type: 'success'
      })
      return { success: true }
    } catch (error) {
      console.error('Network error in startParsing:', error)
      const errorMessage = error instanceof Error ? error.message : 'Ошибка сети при запуске парсинга'
      notify({
        title: 'Ошибка сети',
        message: errorMessage,
        type: 'error'
      })
      return { success: false, error: errorMessage }
    }
  }

  const fetchTenders = async (filters: FilterValue) => {
    try {
      const searchParams = new URLSearchParams()
      
      // Преобразуем значения в строки в нужном формате
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            searchParams.append(key, value.join(','))
          }
        } else if (value !== undefined && value !== '' && value !== null) {
          searchParams.append(key, value.toString())
        }
      })

      const url = `/api/tenders?${searchParams.toString()}`
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      
      if (res.status === 401) {
        notify({
          title: 'Ошибка авторизации',
          message: 'Необходимо войти в систему',
          type: 'error'
        })
        return { success: false, error: 'Необходима авторизация' }
      }

      let data;
      try {
        data = await res.json()
      } catch (e) {
        const text = await res.text()
        data = { detail: text || 'Пустой или невалидный ответ от сервера' }
      }

      if (!res.ok) {
        const error = data.detail || 'Ошибка получения данных'
        notify({
          title: 'Ошибка',
          message: error,
          type: 'error'
        })
        return { success: false, error }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Network error in fetchTenders:', error)
      const errorMessage = error instanceof Error ? error.message : 'Ошибка сети при получении данных'
      notify({
        title: 'Ошибка сети',
        message: errorMessage,
        type: 'error'
      })
      return { success: false, error: errorMessage }
    }
  }

  return (
    <ParserContext.Provider value={{
      startParsing,
      fetchTenders
    }}>
      {children}
    </ParserContext.Provider>
  )
}
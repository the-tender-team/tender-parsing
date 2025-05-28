'use client'

import React, { createContext, useContext, useState } from 'react'
import { useNotification } from '@/libs/NotificationProvider'
import { FilterValue, TableValue, ParseResponse, TenderContextType } from '@/types/tender'

const TenderContext = createContext<TenderContextType>({
  startParsing: async () => ({ success: false }),
  fetchTenders: async () => ({ success: false })
})

export function useTenders() {
  return useContext(TenderContext)
}

export const TenderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notify } = useNotification()
  const [loading, setLoading] = useState(false)

  const startParsing = async (filters: FilterValue): Promise<ParseResponse> => {
    try {
      setLoading(true)
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters),
        credentials: 'include'
      })

      if (!res.ok) {
        const error = await res.json()
        notify({
          title: 'Ошибка',
          message: error.detail || 'Ошибка запуска парсинга',
          type: 'error'
        })
        return { success: false, error: error.detail || 'Ошибка запуска парсинга' }
      }

      notify({
        title: 'Успешно',
        message: 'Парсинг запущен',
        type: 'success'
      })
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка запуска парсинга'
      notify({
        title: 'Ошибка',
        message: errorMessage,
        type: 'error'
      })
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const fetchTenders = async (filters: FilterValue) => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      
      // Convert filters to query parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key + '[]', v.toString()))
          } else {
            queryParams.append(key, value.toString())
          }
        }
      })

      const res = await fetch(`/api/tenders?${queryParams.toString()}`, {
        credentials: 'include'
      })
      
      if (!res.ok) {
        const error = await res.json()
        notify({
          title: 'Ошибка',
          message: error.detail || 'Ошибка получения тендеров',
          type: 'error'
        })
        return { success: false, error: error.detail || 'Ошибка получения тендеров' }
      }
      
      const data = await res.json()
      return { success: true, data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка получения тендеров'
      notify({
        title: 'Ошибка',
        message: errorMessage,
        type: 'error'
      })
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return (
    <TenderContext.Provider value={{
      startParsing,
      fetchTenders
    }}>
      {children}
    </TenderContext.Provider>
  )
} 
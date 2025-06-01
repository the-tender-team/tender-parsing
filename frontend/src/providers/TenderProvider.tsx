'use client'

import React, { createContext, useContext } from 'react'
import { useNotification } from '@/providers/NotificationProvider'
import { FilterValue, ParseResponse, TenderContextType } from '@/types/tender'

const TenderContext = createContext<TenderContextType>({
  startParsing: async () => ({ success: false }),
  fetchTenders: async () => ({ success: false }),
  analyzeTender: async () => ({ success: false })
})

export function useTenders() {
  return useContext(TenderContext)
}

export const TenderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notify } = useNotification()

  const startParsing = async (filters: FilterValue): Promise<ParseResponse> => {
    try {
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
    }
  }

  const fetchTenders = async (filters: FilterValue) => {
    try {
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
    }
  }

  const analyzeTender = async (tenderId: string, signal?: AbortSignal) => {
    try {
      const res = await fetch(`/api/tenders/${tenderId}/analyze`, {
        method: 'POST',
        credentials: 'include',
        signal
      });
      
      if (!res.ok) {
        const error = await res.json();
        notify({
          title: 'Ошибка',
          message: error.detail || 'Ошибка анализа тендера',
          type: 'error'
        });
        return { success: false, error: error.detail || 'Ошибка анализа тендера' };
      }
      
      const data = await res.json();
      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка анализа тендера';
      notify({
        title: 'Ошибка',
        message: errorMessage,
        type: 'error'
      });
      return { success: false, error: errorMessage };
    }
  };

  return (
    <TenderContext.Provider value={{
      startParsing,
      fetchTenders,
      analyzeTender
    }}>
      {children}
    </TenderContext.Provider>
  )
} 
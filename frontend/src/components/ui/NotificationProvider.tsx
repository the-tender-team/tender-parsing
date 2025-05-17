'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import Notification from './Notification'

type NotificationType = 'success' | 'error' | 'info'

interface NotificationData {
  show: boolean
  title: string
  message: string
  type: NotificationType
  duration?: number
}

interface NotificationContextType {
  notify: (data: Omit<NotificationData, 'show'>) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<NotificationData>({
    show: false,
    title: '',
    message: '',
    type: 'info'
  })

  const notify = (data: Omit<NotificationData, 'show'>) => {
    setNotification({ show: true, ...data })
  }

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <Notification
        {...notification}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />
    </NotificationContext.Provider>
  )
}

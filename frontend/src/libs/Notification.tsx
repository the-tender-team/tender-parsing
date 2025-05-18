'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons'

export default function Notification({
  show,
  title,
  message,
  type,
  duration = 5000,
  onClose
}: {
  show: boolean
  title: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
  onClose: () => void
}) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!show) return

    setProgress(100)

    const start = Date.now()

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - start
      const percent = 100 - (elapsed / duration) * 100
      setProgress(Math.max(percent, 0))
    }, 100)

    const hideTimeout = setTimeout(() => {
      onClose()
    }, duration)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(hideTimeout)
    }
  }, [show, duration, onClose])

  if (!show) return null

  const icon =
    type === 'error' ? faExclamationCircle :
    type === 'info' ? faInfoCircle :
    faCheckCircle

  const iconColor =
    type === 'error' ? 'text-red-500' :
    type === 'info' ? 'text-blue-500' :
    'text-green-500'

  const progressColor =
    type === 'error' ? 'bg-red-500' :
    type === 'info' ? 'bg-blue-500' :
    'bg-green-500'

  return (
    <div className="fixed bottom-5 left-5 bg-white rounded-lg shadow-lg p-4 max-w-sm z-50 animate-fade-in">
      <div className="grid grid-cols-[auto_1fr] gap-x-2 items-start">
        <FontAwesomeIcon icon={icon} className={`text-lg mt-1 ${iconColor}`} />
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>

        <div />
        <p className="text-sm text-gray-500 col-span-1 mt-1">{message}</p>
      </div>

      <div className="mt-4 h-1 w-full bg-gray-200 rounded overflow-hidden">
        <div
          className={`${progressColor} h-full transition-all duration-100 linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

'use client'

import { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

interface ModalWindowProps {
  isOpen: boolean
  onClose: () => void
  title: string
  iconButtons?: ReactNode
  children: ReactNode
  disableClose?: boolean
}

export default function ModalWindow({
  isOpen,
  onClose,
  title,
  iconButtons,
  children,
  disableClose = false
}: ModalWindowProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            <div className="flex items-center gap-4">
              {iconButtons}
              <button
                onClick={onClose}
                className={`transition-colors ${
                  disableClose 
                    ? 'text-indigo-300 cursor-not-allowed' 
                    : 'text-white hover:text-indigo-200'
                }`}
                disabled={disableClose}
                aria-label="Close modal"
                title={disableClose ? 'Дождитесь завершения анализа' : 'Закрыть'}
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-grow max-h-[80vh] p-6 space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
} 
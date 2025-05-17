'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { ReactNode } from 'react'

interface ModalTemplateProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  iconButtons?: ReactNode
}

export default function ModalTemplate({
  isOpen,
  onClose,
  title,
  children,
  iconButtons
}: ModalTemplateProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            <div className="flex items-center gap-4">
              {iconButtons}
              <button
                onClick={onClose}
                className="text-white hover:text-indigo-200 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto flex-grow">
          {children}
        </div>
      </div>
    </div>
  )
}
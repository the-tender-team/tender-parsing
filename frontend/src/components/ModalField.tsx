import { ReactNode } from 'react'

interface InfoFieldProps {
  label: string
  value?: string | number | ReactNode
  className?: string
}

export default function InfoField({ label, value, className = '' }: InfoFieldProps) {
  return (
    <div className={className}>
      <p className="text-gray-500 mb-1">{label}</p>
      <p className="font-medium text-black">
        {value !== undefined && value !== null ? value : (
          <span className="text-gray-400 italic">Нет данных</span>
        )}
      </p>
    </div>
  )
}

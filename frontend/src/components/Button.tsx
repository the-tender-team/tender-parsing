'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

interface ButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  type: 'button' | 'submit' | 'reset'
  variant: 'primary' | 'disabled' | 'danger' | 'auth'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  icon?: IconDefinition
  iconPosition?: 'left' | 'right'
  className?: string
}

const variantClasses = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  disabled: 'bg-gray-600 text-white',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  auth: 'bg-white text-indigo-600 hover:bg-gray-100 '
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

export default function Button({
  children,
  onClick,
  type,
  variant,
  size = 'md',
  disabled = false,
  icon,
  iconPosition = 'left',
  className = ''
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-md font-medium transition-colors
        flex items-center justify-center gap-2
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {icon && iconPosition === 'left' && (
        <FontAwesomeIcon icon={icon} />
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <FontAwesomeIcon icon={icon} />
      )}
    </button>
  )
}
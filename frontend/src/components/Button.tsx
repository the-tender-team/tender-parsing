'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

interface ButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  type: 'button' | 'submit' | 'reset'
  variant: 'primary' | 'subprimary' | 'disabled' | 'danger' | 'auth'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  icon?: IconDefinition
  iconPosition?: 'left' | 'right'
  className?: string
  title?: string
}

const variantClasses = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  subprimary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100',
  disabled: 'bg-gray-600 text-white',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  auth: 'bg-white text-indigo-600 hover:bg-gray-100 '
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm min-w-[32px] h-8',
  md: 'px-4 py-2 text-base min-w-[40px] h-10',
  lg: 'px-6 py-3 text-lg min-w-[48px] h-12'
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
  className = '',
  title
}: ButtonProps) {
  const hasContent = Boolean(children)

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        rounded-md font-medium transition-colors
        flex items-center justify-center gap-2
        ${hasContent ? 'w-auto min-w-[48px]' : 'w-12'}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {icon && iconPosition === 'left' && (
        <FontAwesomeIcon 
          icon={icon}
          className={`${!hasContent ? 'w-5 h-5' : ''}`}
        />
      )}
      {hasContent && (
        <span className="hidden sm:inline">
          {children}
        </span>
      )}
      {icon && iconPosition === 'right' && (
        <FontAwesomeIcon 
          icon={icon}
          className={`${!hasContent ? 'w-5 h-5' : ''}`}
        />
      )}
    </button>
  )
}
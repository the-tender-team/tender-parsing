export interface AuthData {
  username?: string
  password?: string
  confirmPassword?: string
}

export interface SettingsData {
  newEmail?: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

export type ValidationResult = {
  valid?: boolean
  errors?: string[]
}

export function validateAuthData(data: AuthData): ValidationResult {
  const errors: string[] = []

  if (data.username !== undefined && (!data.username.trim())) {
    errors.push('Электронная почта не введена.')
  }

  if (!data.password) {
    errors.push('Необходимо ввести пароль.')
  } else if (data.password.length < 8) {
    errors.push('Пароль должен содержать минимум 8 символов.')
  }

  if ('confirmPassword' in data) {
    if (data.password !== data.confirmPassword) {
      errors.push('Пароль и его повтор не совпадают.')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export function validateSettingsData(data: SettingsData): ValidationResult {
  const errors: string[] = []

  if (data.newEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.newEmail)) {
      errors.push('Новая электронная почта имеет некорректный формат.')
    }
  }

  const changingPassword = data.currentPassword || data.newPassword || data.confirmPassword

  if (changingPassword) {
    if (!data.currentPassword) {
      errors.push('Текущий пароль не введён.')
    }
    if (!data.newPassword) {
      errors.push('Новый пароль не введён.')
    }
    if (data.newPassword && data.newPassword.length < 8) {
      errors.push('Новый пароль должен содержать минимум 8 символов.')
    }
    if (data.newPassword !== data.confirmPassword) {
      errors.push('Новый пароль и его повтор не совпадают.')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

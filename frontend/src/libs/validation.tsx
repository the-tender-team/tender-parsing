export interface AuthData {
  username?: string
  password?: string
  confirmPassword?: string
}

export interface SettingsData {
  newUsername?: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

export type ValidationResult = {
  valid: boolean
  errors: string[]
}

export function validateAuthData(data: AuthData): ValidationResult {
  const errors: string[] = []

  const { username, password, confirmPassword } = data

  if (username === undefined || !username.trim()) {
    errors.push('Электронная почта не введена.')
  } else {
    const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!usernameRegex.test(username.trim())) {
      errors.push('Некорректный формат электронной почты.')
    }
  }

  if (!password?.trim()) {
    errors.push('Необходимо ввести пароль.')
  } else {
    if (password.length < 8) {
      errors.push('Пароль должен содержать минимум 8 символов.')
    }

    if (username && password === username) {
      errors.push('Пароль не должен совпадать с электронной почтой.')
    }
  }

  if (confirmPassword !== undefined) {
    if (!confirmPassword?.trim()) {
      errors.push('Необходимо подтвердить пароль.')
    } else if (password !== confirmPassword) {
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

  if (data.newUsername) {
    const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!usernameRegex.test(data.newUsername)) {
      errors.push('Новая электронная почта имеет некорректный формат.')
    }
  }

  const { currentPassword, newPassword, confirmPassword } = data
  const isChangingPassword = currentPassword || newPassword || confirmPassword

  if (isChangingPassword) {
    if (!currentPassword?.trim()) {
      errors.push('Текущий пароль не введён.')
    }

    if (!newPassword?.trim()) {
      errors.push('Новый пароль не введён.')
    } else {
      if (newPassword.length < 8) {
        errors.push('Новый пароль должен содержать минимум 8 символов.')
      }

      if (currentPassword && newPassword === currentPassword) {
        errors.push('Новый пароль не должен совпадать с текущим.')
      }
    }

    if (!confirmPassword?.trim()) {
      errors.push('Не введено подтверждение нового пароля.')
    } else if (newPassword !== confirmPassword) {
      errors.push('Новый пароль и его подтверждение не совпадают.')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

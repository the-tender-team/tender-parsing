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

export interface ChangePasswordData {
  currentPassword?: string
  newPassword?: string
  confirmNewPassword?: string
  newUsername?: string
}

export type ValidationResult = {
  valid: boolean
  errors: string[]
}

export function validateAuthData(data: AuthData): { isValid: boolean; error?: string } {
  try {
    const { username, password, confirmPassword } = data

    // Проверка наличия имени пользователя
    if (username === undefined || !username.trim()) {
      return { isValid: false, error: 'Введите имя пользователя' }
    }

    // Проверка формата имени пользователя
    if (username.trim().length < 3) {
      return { isValid: false, error: 'Имя пользователя должно быть не короче 3 символов' }
    }

    // Проверка наличия пароля
    if (!password) {
      return { isValid: false, error: 'Введите пароль' }
    }

    // Проверка длины пароля
    if (password.length < 6) {
      return { isValid: false, error: 'Пароль должен быть не короче 6 символов' }
    }

    // Проверка совпадения пароля с именем пользователя
    if (username && password === username) {
      return { isValid: false, error: 'Пароль не должен совпадать с именем пользователя' }
    }

    // Проверка подтверждения пароля
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return { isValid: false, error: 'Пароли не совпадают' }
    }

    return { isValid: true }
  } catch (error) {
    console.error('Error in validateAuthData:', error)
    return { isValid: false, error: 'Ошибка валидации данных' }
  }
}

export function validateSettingsData(data: SettingsData): ValidationResult {
  const errors: string[] = []

  if (data.newUsername) {
    if (data.newUsername.trim().length < 3) {
      errors.push('Имя пользователя должно быть не короче 3 символов')
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
      if (newPassword.length < 6) {
        errors.push('Новый пароль должен содержать минимум 6 символов.')
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

export function validateChangePasswordData(data: ChangePasswordData): { isValid: boolean; error?: string } {
  try {
    // Проверка нового имени пользователя
    if (data.newUsername) {
      if (data.newUsername.trim().length < 3) {
        return { isValid: false, error: 'Имя пользователя должно быть не короче 3 символов' }
      }
    }

    // Проверка текущего пароля
    if (!data.currentPassword) {
      return { isValid: false, error: 'Введите текущий пароль' }
    }

    // Проверка нового пароля
    if (!data.newPassword) {
      return { isValid: false, error: 'Введите новый пароль' }
    }

    if (data.newPassword.length < 6) {
      return { isValid: false, error: 'Новый пароль должен быть не короче 6 символов' }
    }

    // Проверка подтверждения нового пароля
    if (data.newPassword !== data.confirmNewPassword) {
      return { isValid: false, error: 'Пароли не совпадают' }
    }

    return { isValid: true }
  } catch (error) {
    console.error('Error in validateChangePasswordData:', error)
    return { isValid: false, error: 'Ошибка валидации данных' }
  }
}

export async function fetchWithNotify({
  url,
  method = 'POST',
  body,
  notify,
  onSuccess,
  onError
}: {
  url: string
  method?: string
  body?: any
  notify: (args: { title: string; message: string; type: 'success' | 'error' }) => void
  onSuccess: () => void
  onError?: (detail?: string) => void
}) {
  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    })
    const data = await res.json()

    if (res.ok) {
      onSuccess()
    } else {
      notify({ title: 'Ошибка', message: data.detail || 'Произошла ошибка', type: 'error' })
      onError?.(data.detail)
    }
  } catch (err: any) {
    notify({ title: 'Ошибка', message: err.message, type: 'error' })
  }
}

export function notifyIfInvalid(validation: { valid: boolean; errors?: string[] }, notify: Function): boolean {
  if (!validation.valid) {
    notify({
      title: 'Ошибка',
      message: validation.errors?.join('\n') || 'Неверные данные',
      type: 'error'
    })
    return true
  }
  return false
}

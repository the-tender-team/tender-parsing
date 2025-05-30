const API_BASE = 'http://backend:8000'


export async function apiFetch(path: string, options?: RequestInit) {
  const url = `${API_BASE}${path}`
  
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  const mergedOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options?.headers
    }
  }

  const res = await fetch(url, mergedOptions)
  return res
}

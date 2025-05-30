import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  // Проверяем существует ли токен
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')
  if (!token) {
    return NextResponse.json({ msg: 'Пользователь уже не авторизован' }, { status: 401 })
  }

  // Создаем ответ
  const response = NextResponse.json({ msg: 'Выход выполнен' })
  
  // Устанавливаем заголовок Set-Cookie для удаления cookie
  response.headers.set(
    'Set-Cookie',
    'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict'
  )
  
  return response
}

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const token = (await cookies()).get('token')?.value

  if (!token) {
    return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })
  }

  // Запрос данных о пользователе у backend с токеном
  const res = await fetch('http://localhost:8000/me', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  if (!res.ok) {
    return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })
  }

  const user = await res.json()
  return NextResponse.json(user)
}

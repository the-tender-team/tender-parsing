import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const res = await fetch('http://localhost:8000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const err = await res.json() as { detail?: string }
    return NextResponse.json({ detail: err.detail || 'Ошибка входа' }, { status: 401 })
  }

  const data = await res.json() as { access_token: string }

  (await cookies()).set('token', data.access_token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'  // !!!!!!!!! (secure: true)
  })

  return NextResponse.json({ success: true })
}

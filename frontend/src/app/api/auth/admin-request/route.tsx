import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const token = (await cookies()).get('token')?.value
  const res = await fetch('http://localhost:8000/admin-request', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

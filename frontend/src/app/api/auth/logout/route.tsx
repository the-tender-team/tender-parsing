import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  (await cookies()).delete('token')
  return NextResponse.json({ msg: 'Выход выполнен' })
}

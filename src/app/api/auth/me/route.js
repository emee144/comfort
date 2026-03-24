import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ user: { email: user.email, id: user._id } })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
    }

    await connectDB()

    // find user
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    // create JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // set HTTP only cookie
    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 })
    response.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response

  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
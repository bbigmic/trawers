import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import * as jose from 'jose'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    console.log('Próba logowania dla:', email)

    // Znajdź użytkownika
    const user = await prisma.user.findUnique({
      where: { email },
    })

    console.log('Znaleziony użytkownik:', user ? 'tak' : 'nie')
    if (user) {
      console.log('Rola użytkownika:', user.role)
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Nieprawidłowe dane logowania' },
        { status: 401 }
      )
    }

    // Sprawdź hasło
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log('Hasło poprawne:', isValidPassword)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Nieprawidłowe dane logowania' },
        { status: 401 }
      )
    }

    // Generuj token JWT
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    }
    console.log('Payload tokena:', tokenPayload)

    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
    const token = await new jose.SignJWT(tokenPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(secret)

    console.log('Token wygenerowany pomyślnie')
    console.log('Token:', token)

    // Ustaw cookie z tokenem
    const response = NextResponse.json(
      { 
        message: 'Zalogowano pomyślnie',
        role: user.role 
      },
      { status: 200 }
    )

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 dzień
      path: '/',
    })

    console.log('Cookie ustawione pomyślnie')
    return response
  } catch (error) {
    console.error('Błąd podczas logowania:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas logowania' },
      { status: 500 }
    )
  }
} 
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { name, email, password, dataProcessingConsent, marketingConsent } = await request.json()

    // Sprawdź czy użytkownik już istnieje
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Użytkownik o podanym adresie email już istnieje' },
        { status: 400 }
      )
    }

    // Sprawdź czy wyrażono zgodę na przetwarzanie danych
    if (!dataProcessingConsent) {
      return NextResponse.json(
        { error: 'Wymagana jest zgoda na przetwarzanie danych osobowych' },
        { status: 400 }
      )
    }

    // Hashuj hasło
    const hashedPassword = await bcrypt.hash(password, 10)

    // Utwórz nowego użytkownika
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        dataProcessingConsent,
        marketingConsent: marketingConsent || false,
        consentDate: new Date(),
      },
    })

    return NextResponse.json(
      { message: 'Użytkownik został zarejestrowany' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Błąd podczas rejestracji:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas rejestracji' },
      { status: 500 }
    )
  }
} 
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { verifyToken } from '../../../lib/auth'
import { cookies } from 'next/headers'

export async function PUT(request: Request) {
  try {
    // Sprawdź token
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Nieprawidłowy token' }, { status: 401 })
    }

    const {
      name,
      phone,
      address,
      city,
      postalCode,
      bio,
      marketingConsent,
      dataProcessingConsent
    } = await request.json()

    // Przygotuj dane do aktualizacji
    const updateData: any = {
      name,
      phone,
      address,
      city,
      postalCode,
      bio,
    }

    // Dodaj zgody tylko jeśli zostały przekazane
    if (marketingConsent !== undefined) {
      updateData.marketingConsent = marketingConsent
    }
    if (dataProcessingConsent !== undefined) {
      updateData.dataProcessingConsent = dataProcessingConsent
      // Jeśli użytkownik wyraża zgodę, ustaw datę zgody
      if (dataProcessingConsent) {
        updateData.consentDate = new Date()
      }
    }

    // Aktualizuj profil użytkownika
    const updatedUser = await prisma.user.update({
      where: {
        id: decoded.userId,
      },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        postalCode: true,
        bio: true,
        marketingConsent: true,
        dataProcessingConsent: true,
        consentDate: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Błąd podczas aktualizacji profilu:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas aktualizacji profilu' },
      { status: 500 }
    )
  }
} 
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { verifyToken } from '../../../lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Sprawdź token i uprawnienia administratora
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 })
    }

    const { role } = await request.json()

    // Aktualizuj rolę użytkownika
    const updatedUser = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: {
        role,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Błąd podczas aktualizacji użytkownika:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas aktualizacji użytkownika' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Sprawdź token i uprawnienia administratora
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 })
    }

    // Usuń użytkownika
    await prisma.user.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Użytkownik został usunięty' })
  } catch (error) {
    console.error('Błąd podczas usuwania użytkownika:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas usuwania użytkownika' },
      { status: 500 }
    )
  }
} 
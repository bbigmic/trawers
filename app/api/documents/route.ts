import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import { verifyToken } from '../../lib/auth'
import { cookies } from 'next/headers'
import { uploadDocument } from '@/lib/cloudinary'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Nieprawidłowy token' }, { status: 401 })
    }

    const documents = await prisma.document.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Błąd podczas pobierania dokumentów:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania dokumentów' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Nieprawidłowy token' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const name = formData.get('name') as string

    if (!file || !name) {
      return NextResponse.json(
        { error: 'Brak pliku lub nazwy dokumentu' },
        { status: 400 }
      )
    }

    // Upload dokumentu do Cloudinary
    let fileUrl: string;
    try {
      fileUrl = await uploadDocument(file);
    } catch (error) {
      console.error('Błąd podczas uploadu dokumentu:', error);
      return NextResponse.json(
        { error: 'Nie udało się przesłać dokumentu' },
        { status: 500 }
      )
    }

    // Utwórz dokument w bazie danych
    const document = await prisma.document.create({
      data: {
        name: name,
        url: fileUrl,
        userId: decoded.userId,
      },
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error('Błąd podczas przesyłania dokumentu:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas przesyłania dokumentu' },
      { status: 500 }
    )
  }
} 
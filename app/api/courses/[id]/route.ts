import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as jose from 'jose'
import { cookies } from 'next/headers'
import { uploadImage, uploadVideo } from '@/lib/cloudinary'
import { verifyToken } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Kurs nie został znaleziony' },
        { status: 404 }
      )
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Błąd podczas pobierania kursu:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania kursu' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Pobierz token z ciasteczek
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Brak autoryzacji' },
        { status: 401 }
      )
    }

    try {
      // Weryfikuj token
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-secret-key')
      const { payload } = await jose.jwtVerify(token, secret)
      const decoded = payload as { userId: string; role: string }

      if (decoded.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Brak uprawnień administratora' },
          { status: 403 }
        )
      }

      await prisma.course.delete({
        where: { id: params.id },
      })

      return NextResponse.json({ message: 'Kurs został usunięty' })
    } catch (jwtError) {
      console.error('Błąd weryfikacji tokena:', jwtError)
      return NextResponse.json(
        { error: 'Nieprawidłowy token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Błąd podczas usuwania kursu:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas usuwania kursu' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Pobierz token z ciasteczek
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Brak autoryzacji' },
        { status: 401 }
      )
    }

    try {
      // Weryfikuj token
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-secret-key')
      const { payload } = await jose.jwtVerify(token, secret)
      const decoded = payload as { userId: string; role: string }

      if (decoded.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Brak uprawnień administratora' },
          { status: 403 }
        )
      }

      const formData = await request.formData()
      const title = formData.get('title') as string
      const description = formData.get('description') as string
      const price = parseFloat(formData.get('price') as string)
      const image = formData.get('image') as File | null
      const video = formData.get('video') as File | null

      // Pobierz aktualny kurs
      const existingCourse = await prisma.course.findUnique({
        where: { id: params.id },
      })

      if (!existingCourse) {
        return NextResponse.json(
          { error: 'Kurs nie został znaleziony' },
          { status: 404 }
        )
      }

      // Przygotuj dane do aktualizacji
      const updateData: any = {
        title,
        description,
        price,
      }

      // Upload nowego obrazu jeśli został przesłany
      if (image) {
        try {
          updateData.imageUrl = await uploadImage(image)
        } catch (error) {
          console.error('Błąd podczas uploadu obrazu:', error)
          return NextResponse.json(
            { error: 'Nie udało się przesłać obrazu' },
            { status: 500 }
          )
        }
      }

      // Upload nowego wideo jeśli zostało przesłane
      if (video) {
        try {
          updateData.videoUrl = await uploadVideo(video)
        } catch (error) {
          console.error('Błąd podczas uploadu wideo:', error)
          return NextResponse.json(
            { error: 'Nie udało się przesłać wideo' },
            { status: 500 }
          )
        }
      }

      const course = await prisma.course.update({
        where: { id: params.id },
        data: updateData,
      })

      return NextResponse.json(course)
    } catch (jwtError) {
      console.error('Błąd weryfikacji tokena:', jwtError)
      return NextResponse.json(
        { error: 'Nieprawidłowy token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Błąd podczas aktualizacji kursu:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas aktualizacji kursu' },
      { status: 500 }
    )
  }
} 
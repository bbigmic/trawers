import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as jose from 'jose'
import { cookies } from 'next/headers'
import { uploadImage, uploadVideo } from '@/lib/cloudinary'
import { verifyToken } from '../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const courses = await prisma.course.findMany()
    return NextResponse.json(courses)
  } catch (error) {
    console.error('Błąd podczas pobierania kursów:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania kursów' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Pobierz token z ciasteczek
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    console.log('Znaleziony token:', token)

    if (!token) {
      console.log('Nie znaleziono tokena w ciasteczkach')
      return NextResponse.json(
        { error: 'Brak autoryzacji' },
        { status: 401 }
      )
    }

    try {
      // Weryfikuj token
      console.log('Próba weryfikacji tokena...')
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-secret-key')
      console.log('Używany sekret:', secret)
      
      const { payload } = await jose.jwtVerify(token, secret)
      const decoded = payload as { userId: string; role: string }
      console.log('Zdekodowany token:', decoded)

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
      const image = formData.get('image') as File
      const video = formData.get('video') as File

      if (!title || !description || !price || !image) {
        return NextResponse.json(
          { error: 'Brak wymaganych pól' },
          { status: 400 }
        )
      }

      // Upload obrazu do Cloudinary
      let imageUrl: string;
      try {
        imageUrl = await uploadImage(image);
      } catch (error) {
        console.error('Błąd podczas uploadu obrazu:', error);
        return NextResponse.json(
          { error: 'Nie udało się przesłać obrazu' },
          { status: 500 }
        )
      }

      // Upload wideo do Cloudinary (jeśli istnieje)
      let videoUrl = null;
      if (video) {
        try {
          videoUrl = await uploadVideo(video);
        } catch (error) {
          console.error('Błąd podczas uploadu wideo:', error);
          return NextResponse.json(
            { error: 'Nie udało się przesłać wideo' },
            { status: 500 }
          )
        }
      }

      // Utwórz kurs w bazie danych
      const course = await prisma.course.create({
        data: {
          title,
          description,
          price,
          imageUrl,
          videoUrl,
        },
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
    console.error('Błąd podczas tworzenia kursu:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas tworzenia kursu' },
      { status: 500 }
    )
  }
} 
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  console.log('Middleware - ścieżka:', request.nextUrl.pathname)
  console.log('Middleware - token:', token ? `${token.substring(0, 20)}...` : 'brak')

  if (!token) {
    console.log('Middleware - brak tokenu, przekierowanie do /login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    console.log('Middleware - zdekodowany token:', payload)

    if (!payload || !payload.userId) {
      console.log('Middleware - nieprawidłowy token, przekierowanie do /login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Sprawdź uprawnienia dla ścieżek /admin
    if (request.nextUrl.pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
      console.log('Middleware - brak uprawnień admina, przekierowanie do /')
      return NextResponse.redirect(new URL('/', request.url))
    }

    console.log('Middleware - autoryzacja pomyślna')
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware - błąd:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/profile', '/profile/:path*', '/orders'],
} 
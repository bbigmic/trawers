import * as jose from 'jose'

export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)
    const { payload } = await jose.jwtVerify(token, secret)
    return payload as { userId: string; role: string }
  } catch (error) {
    console.error('Błąd weryfikacji tokena:', error)
    return null
  }
} 
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function PaymentSuccessContent() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      setError('Brak identyfikatora sesji')
      setLoading(false)
      return
    }

    // Przekieruj do profilu po 3 sekundach
    const timer = setTimeout(() => {
      router.push('/profile?message=payment_success')
    }, 3000)

    setLoading(false)

    return () => clearTimeout(timer)
  }, [sessionId, router])

  if (loading) {
    return (
      <main className="flex-grow flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex-grow flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </main>
    )
  }

  return (
    <main className="flex-grow flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Płatność zakończona sukcesem!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Przekierowujemy Cię do swojego profilu, gdzie będziesz mógł dokończyć proces rejestracji.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="flex justify-center">
              <Link
                href="/profile"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF7A3D] hover:bg-[#FF5100] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7A3D]"
              >
                Przejdź do profilu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function LoadingFallback() {
  return (
    <main className="flex-grow flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </main>
  )
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <PaymentSuccessContent />
      </Suspense>
      <Footer />
    </div>
  )
} 
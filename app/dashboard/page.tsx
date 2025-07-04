'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  email: string
  role: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          throw new Error('Nie udało się pobrać danych użytkownika')
        }
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Błąd:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Ładowanie...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Panel użytkownika
              </h1>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Zalogowany jako: {user?.email}
                </p>
                <p className="text-sm text-gray-600">
                  Rola: {user?.role}
                </p>
              </div>
              {user?.role === 'ADMIN' && (
                <div className="mt-6">
                  <a
                    href="/admin"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF7A3D] hover:bg-[#FF5100] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7A3D]"
                  >
                    Przejdź do panelu administratora
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
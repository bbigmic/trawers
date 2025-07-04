'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const dataProcessingConsent = formData.get('dataProcessingConsent') === 'on'
    const marketingConsent = formData.get('marketingConsent') === 'on'

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne')
      setLoading(false)
      return
    }

    if (!dataProcessingConsent) {
      setError('Musisz wyrazić zgodę na przetwarzanie danych osobowych')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          dataProcessingConsent, 
          marketingConsent 
        }),
      })

      if (!res.ok) {
        throw new Error('Błąd podczas rejestracji')
      }

      router.push('/login')
    } catch (err) {
      setError('Błąd podczas rejestracji')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Zarejestruj nowe konto
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="input-label"
              >
                Imię i nazwisko
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="input-label"
              >
                Adres email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="input-label"
              >
                Hasło
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="input-label"
              >
                Potwierdź hasło
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="input-field"
                />
              </div>
            </div>

            {/* Sekcja zgód na przetwarzanie danych */}
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="dataProcessingConsent"
                    name="dataProcessingConsent"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-[#FF7A3D] focus:ring-[#FF7A3D] border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="dataProcessingConsent" className="font-medium text-gray-700">
                    Zgoda na przetwarzanie danych osobowych *
                  </label>
                  <p className="text-gray-500">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych przez firmę Trawers-ADR w celu realizacji usług szkoleniowych, 
                    zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="marketingConsent"
                    name="marketingConsent"
                    type="checkbox"
                    className="h-4 w-4 text-[#FF7A3D] focus:ring-[#FF7A3D] border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="marketingConsent" className="font-medium text-gray-700">
                    Zgoda na marketing
                  </label>
                  <p className="text-gray-500">
                    Wyrażam zgodę na otrzymywanie informacji handlowych i marketingowych dotyczących naszych usług 
                    drogą elektroniczną (e-mail, SMS) oraz telefonicznie.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF7A3D] hover:bg-[#FF5100] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7A3D]"
              >
                {loading ? 'Rejestracja...' : 'Zarejestruj się'}
              </button>
            </div>
          </form>

          <div className="text-sm text-center mt-4">
            <Link href="/login" className="font-medium text-[#FF7A3D] hover:text-[#FF5100]">
              Masz już konto? Zaloguj się
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 
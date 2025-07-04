'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface User {
  id: string
  email: string
  name: string | null
  phone: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  bio: string | null
  avatarUrl: string | null
  marketingConsent: boolean
  dataProcessingConsent: boolean
  consentDate: string | null
}

interface Document {
  id: string
  name: string
  url: string
  createdAt: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user: authUser, loading: authLoading } = useAuth()

  useEffect(() => {
    const message = searchParams.get('message')
    if (message === 'payment_success') {
      setSuccessMessage('Płatność zakończona sukcesem! Proszę uzupełnić wymagane dokumenty.')
    }
  }, [searchParams])

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/login')
      return
    }

    if (authUser) {
      fetchProfile()
      fetchDocuments()
    }
  }, [authUser, authLoading, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania danych użytkownika')
      }
      const data = await response.json()
      setUser(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setLoading(false)
    }
  }

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents')
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania dokumentów')
      }
      const data = await response.json()
      setDocuments(data)
    } catch (err) {
      console.error('Błąd podczas pobierania dokumentów:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const userData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      postalCode: formData.get('postalCode') as string,
      bio: formData.get('bio') as string,
      marketingConsent: formData.get('marketingConsent') === 'on',
      dataProcessingConsent: formData.get('dataProcessingConsent') === 'on',
    }

    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error('Błąd podczas aktualizacji profilu')
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      setSuccessMessage('Profil został zaktualizowany')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError('Proszę wybrać plik')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('name', selectedFile.name)

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Błąd podczas przesyłania dokumentu')
      }

      setDocuments([...documents, data])
      setSuccessMessage('Dokument został przesłany')
      setSelectedFile(null)
    } catch (err) {
      console.error('Błąd podczas przesyłania dokumentu:', err)
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas przesyłania dokumentu')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Profil użytkownika</h1>

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700">{successMessage}</p>
              </div>
            )}

            {searchParams.get('message') === 'payment_success' && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Wymagane dokumenty
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Aby rozpocząć kurs, musisz przesłać wymagane dokumenty. Proszę uzupełnić wszystkie niezbędne dokumenty w sekcji "Dokumenty" poniżej.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Dane osobowe</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="input-label">
                    Imię i nazwisko
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={user.name || ''}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="input-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    disabled
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="input-label">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultValue={user.phone || ''}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="input-label">
                    Adres
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    defaultValue={user.address || ''}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="input-label">
                      Miasto
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      defaultValue={user.city || ''}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="input-label">
                      Kod pocztowy
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      defaultValue={user.postalCode || ''}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="input-label">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    defaultValue={user.bio || ''}
                    className="textarea-field"
                  />
                </div>

                {/* Sekcja zgód na przetwarzanie danych */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Zgody na przetwarzanie danych</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="dataProcessingConsent"
                          name="dataProcessingConsent"
                          type="checkbox"
                          defaultChecked={user.dataProcessingConsent}
                          className="h-4 w-4 text-[#FF7A3D] focus:ring-[#FF7A3D] border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="dataProcessingConsent" className="font-medium text-gray-700">
                          Zgoda na przetwarzanie danych osobowych
                        </label>
                        <p className="text-gray-500">
                          Wyrażam zgodę na przetwarzanie moich danych osobowych przez firmę Trawers-ADR w celu realizacji usług szkoleniowych, 
                          zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).
                        </p>
                        {user.consentDate && (
                          <p className="text-xs text-gray-400 mt-1">
                            Data wyrażenia zgody: {new Date(user.consentDate).toLocaleDateString('pl-PL')}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="marketingConsent"
                          name="marketingConsent"
                          type="checkbox"
                          defaultChecked={user.marketingConsent}
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
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#FF7A3D] text-white px-4 py-2 rounded-md hover:bg-[#FF5100] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7A3D]"
                  >
                    Zapisz zmiany
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Dokumenty</h2>
              
              <div className="mb-6">
                <label className="input-label">
                  Dodaj nowy dokument
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="file-input"
                  />
                  <button
                    onClick={handleFileUpload}
                    disabled={!selectedFile}
                    className={`px-4 py-2 rounded-md text-white font-medium
                      ${selectedFile 
                        ? 'bg-[#FF7A3D] hover:bg-[#FF5100]' 
                        : 'bg-gray-400 cursor-not-allowed'}`}
                  >
                    Wyślij
                  </button>
                </div>
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    Wybrany plik: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center">
                      <svg
                        className="w-6 h-6 text-gray-400 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-sm text-gray-900">{doc.name}</span>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF7A3D] hover:text-[#FF5100]"
                    >
                      Pobierz
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 
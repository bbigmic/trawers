'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  phone: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  bio: string | null
  marketingConsent: boolean
  dataProcessingConsent: boolean
  consentDate: string | null
  createdAt: string
  updatedAt: string
}

interface Document {
  id: string
  name: string
  url: string
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [documents, setDocuments] = useState<{ [key: string]: Document[] }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania użytkowników')
      }
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDocuments = async (userId: string) => {
    try {
      const response = await fetch(`/api/documents/${userId}`)
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania dokumentów')
      }
      const data = await response.json()
      setDocuments(prev => ({ ...prev, [userId]: data }))
    } catch (err) {
      console.error('Błąd podczas pobierania dokumentów:', err)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        throw new Error('Błąd podczas aktualizacji roli')
      }

      // Odśwież listę użytkowników
      fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Błąd podczas usuwania użytkownika')
      }

      // Odśwież listę użytkowników
      fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    }
  }

  const toggleDocuments = (userId: string) => {
    if (selectedUserId === userId) {
      setSelectedUserId(null)
    } else {
      setSelectedUserId(userId)
      if (!documents[userId]) {
        fetchUserDocuments(userId)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7A3D]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Zarządzanie użytkownikami</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Użytkownik
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kontakt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rola
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zgody
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dokumenty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <>
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name || 'Brak imienia'}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-400">
                        Utworzono: {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {user.phone && <div>📞 {user.phone}</div>}
                      {user.address && <div>📍 {user.address}</div>}
                      {user.city && <div>🏙️ {user.city}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="USER">Użytkownik</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.dataProcessingConsent 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.dataProcessingConsent ? '✓' : '✗'} RODO
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.marketingConsent 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.marketingConsent ? '✓' : '✗'} Marketing
                        </span>
                      </div>
                      {user.consentDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Data zgody: {new Date(user.consentDate).toLocaleDateString('pl-PL')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleDocuments(user.id)}
                      className="text-[#FF7A3D] hover:text-[#FF5100] text-sm"
                    >
                      {selectedUserId === user.id ? 'Ukryj' : 'Pokaż'} dokumenty
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
                {selectedUserId === user.id && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Szczegóły użytkownika */}
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Szczegóły użytkownika</h3>
                            <div className="bg-white p-4 rounded-lg border">
                              <dl className="space-y-2 text-sm">
                                <div>
                                  <dt className="font-medium text-gray-700">Imię i nazwisko:</dt>
                                  <dd className="text-gray-900">{user.name || 'Nie podano'}</dd>
                                </div>
                                <div>
                                  <dt className="font-medium text-gray-700">Email:</dt>
                                  <dd className="text-gray-900">{user.email}</dd>
                                </div>
                                <div>
                                  <dt className="font-medium text-gray-700">Telefon:</dt>
                                  <dd className="text-gray-900">{user.phone || 'Nie podano'}</dd>
                                </div>
                                <div>
                                  <dt className="font-medium text-gray-700">Adres:</dt>
                                  <dd className="text-gray-900">
                                    {user.address ? (
                                      <>
                                        {user.address}<br/>
                                        {user.postalCode} {user.city}
                                      </>
                                    ) : 'Nie podano'}
                                  </dd>
                                </div>
                                {user.bio && (
                                  <div>
                                    <dt className="font-medium text-gray-700">Bio:</dt>
                                    <dd className="text-gray-900">{user.bio}</dd>
                                  </div>
                                )}
                              </dl>
                            </div>
                          </div>

                          {/* Dokumenty użytkownika */}
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Dokumenty użytkownika</h3>
                            {documents[user.id] ? (
                              documents[user.id].length > 0 ? (
                                <div className="bg-white p-4 rounded-lg border">
                                  <ul className="space-y-3">
                                    {documents[user.id].map((doc) => (
                                      <li key={doc.id} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                          <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                          </svg>
                                          <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                                        </div>
                                        <a
                                          href={doc.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="px-3 py-1 text-xs font-medium rounded-md text-[#FF7A3D] bg-[#FFF0E8] hover:bg-[#FFE1D1]"
                                        >
                                          Pobierz
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                <div className="bg-white p-4 rounded-lg border">
                                  <p className="text-sm text-gray-500">Brak przesłanych dokumentów</p>
                                </div>
                              )
                            ) : (
                              <div className="bg-white p-4 rounded-lg border flex justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#FF7A3D]"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 
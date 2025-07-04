'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [videoPreview, setVideoPreview] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData(e.currentTarget)
      
      const response = await fetch('/api/courses', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Wystąpił błąd podczas tworzenia kursu')
      }

      router.push('/admin/courses')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Wystąpił błąd podczas tworzenia kursu')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setVideoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold mb-6">Dodaj nowy kurs</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="input-label">
              Tytuł
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="description" className="input-label">
              Opis
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="textarea-field"
            />
          </div>

          <div>
            <label htmlFor="price" className="input-label">
              Cena
            </label>
            <input
              type="number"
              id="price"
              name="price"
              required
              min="0"
              step="0.01"
              className="input-field"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="input-label">
              Zdjęcie kursu
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Podgląd"
                className="mt-2 h-32 w-32 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="video" className="input-label">
              Film kursu (opcjonalnie)
            </label>
            <input
              type="file"
              id="video"
              name="video"
              accept="video/*"
              onChange={handleVideoChange}
              className="file-input"
            />
            {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="mt-2 w-full max-w-md rounded-lg"
              />
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Dodawanie...' : 'Dodaj kurs'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 
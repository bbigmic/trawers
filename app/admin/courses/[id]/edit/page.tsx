'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Course {
  id: string
  title: string
  description: string
  price: number
  imageUrl: string
  videoUrl: string | null
}

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newImage, setNewImage] = useState<File | null>(null)
  const [newVideo, setNewVideo] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewVideo, setPreviewVideo] = useState<string | null>(null)

  useEffect(() => {
    fetchCourse()
  }, [params.id])

  async function fetchCourse() {
    try {
      const res = await fetch(`/api/courses/${params.id}`)
      if (!res.ok) throw new Error('Błąd podczas pobierania kursu')
      const data = await res.json()
      setCourse(data)
      setPreviewImage(data.imageUrl)
      setPreviewVideo(data.videoUrl)
    } catch (err) {
      setError('Wystąpił błąd podczas pobierania kursu')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewVideo(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewVideo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!course) return

    const formData = new FormData()
    formData.append('title', course.title)
    formData.append('description', course.description)
    formData.append('price', course.price.toString())

    if (newImage) {
      formData.append('image', newImage)
    }
    if (newVideo) {
      formData.append('video', newVideo)
    }

    try {
      const res = await fetch(`/api/courses/${params.id}`, {
        method: 'PUT',
        body: formData,
      })

      if (!res.ok) throw new Error('Błąd podczas aktualizacji kursu')

      router.push('/admin')
    } catch (err) {
      setError('Wystąpił błąd podczas aktualizacji kursu')
    }
  }

  if (loading) return <div>Ładowanie...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!course) return <div>Kurs nie został znaleziony</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edytuj kurs</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="input-label">Tytuł</label>
          <input
            type="text"
            value={course.title}
            onChange={(e) => setCourse({ ...course, title: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="input-label">Opis</label>
          <textarea
            value={course.description}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
            rows={4}
            className="textarea-field"
            required
          />
        </div>

        <div>
          <label className="input-label">Cena (zł)</label>
          <input
            type="number"
            value={course.price}
            onChange={(e) => setCourse({ ...course, price: Number(e.target.value) })}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Aktualne zdjęcie</label>
          {previewImage && (
            <img
              src={previewImage}
              alt="Aktualne zdjęcie kursu"
              className="mt-2 h-48 w-full object-cover rounded-lg"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#FFF0E8] file:text-[#FF7A3D] hover:file:bg-[#FFE1D1]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Aktualne wideo</label>
          {previewVideo && (
            <video
              src={previewVideo}
              controls
              className="mt-2 w-full rounded-lg"
            />
          )}
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#FFF0E8] file:text-[#FF7A3D] hover:file:bg-[#FFE1D1]"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-[#FF7A3D] rounded-md hover:bg-[#FF5100]"
          >
            Zapisz zmiany
          </button>
        </div>
      </form>
    </div>
  )
} 
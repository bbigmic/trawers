import AdminNavbar from '../components/AdminNavbar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <AdminNavbar />
      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
} 
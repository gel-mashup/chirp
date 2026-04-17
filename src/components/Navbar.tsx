import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Chirp</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-primary">
              Home
            </Link>
            <Link href="/explore" className="text-gray-700 hover:text-primary">
              Explore
            </Link>
            <Link href="/profile" className="text-gray-700 hover:text-primary">
              Profile
            </Link>
            <Link
              href="/login"
              className="bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-600"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
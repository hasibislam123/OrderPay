import Link from 'next/link';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            OrderPay
          </Link>
          <nav className="flex space-x-4">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link href="/auth/login" className="text-gray-700 hover:text-gray-900">
              Login
            </Link>
            <Link href="/auth/register" className="text-gray-700 hover:text-gray-900">
              Register
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} OrderPay. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
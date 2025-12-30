import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "OrderPay - Manage Your Orders & Payments",
  description: "A platform to manage your orders and payments",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
      </body>
    </html>
  );
}
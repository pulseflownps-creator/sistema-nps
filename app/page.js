'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg text-center w-[320px]">
        
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Sistema
        </h1>

        <Link href="/login">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition">
            Entrar no Sistema
          </button>
        </Link>

      </div>
    </div>
  )
}
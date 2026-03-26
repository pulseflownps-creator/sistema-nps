'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ padding: 50 }}>
      <h1>Sistema</h1>

      <Link href="/login">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
          Entrar no Sistema
        </button>
      </Link>
    </div>
  )
}
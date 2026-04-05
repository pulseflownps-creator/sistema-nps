'use client'

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

export default function ClientLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  const [loading, setLoading] = useState(true)

  const isLoginPage = pathname === '/login'

  /* 🔐 CONTROLE DE SESSÃO */
  useEffect(() => {
    if (typeof window === 'undefined') return

    const local = localStorage.getItem('session')
    const sessionStore = sessionStorage.getItem('session')

    const session = JSON.parse(local || sessionStore)

    if (!session && !isLoginPage) {
      router.push('/login')
      return
    }

    if (session) {
      const hoje = new Date().toDateString()

      if (session.expira !== hoje) {
        localStorage.removeItem('session')
        sessionStorage.removeItem('session')
        router.push('/login')
        return
      }
    }

    if (session && isLoginPage) {
      router.push('/')
      return
    }

    setLoading(false)
  }, [pathname, router, isLoginPage])

  const logout = () => {
    localStorage.removeItem('session')
    sessionStorage.removeItem('session')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span>Carregando...</span>
      </div>
    )
  }

  return (
    <>
      {!isLoginPage && (
        <header className="relative flex items-center justify-between px-6 py-4 
        bg-white dark:bg-[#0B1F3A] shadow-sm border-b border-gray-200 dark:border-gray-800">

          <div className="flex items-center gap-3">
            <img
              src="/logo-empresa.png"
              alt="Logo empresa"
              className="w-9 h-9 object-contain rounded-md"
            />
            <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-300">
              Independente Academy
            </span>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-lg font-bold">PulseFlow</h1>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={logout} className="p-2 bg-red-500 text-white rounded-lg">
              <LogOut size={18} />
            </button>
          </div>

        </header>
      )}

      {/* 🔥 CORREÇÃO DO SCROLL */}
      <main className="p-4 md:p-6 min-h-[calc(100vh-80px)]">
        {children}
      </main>
    </>
  )
}
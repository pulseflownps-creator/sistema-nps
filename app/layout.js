'use client'

/* =========================
   IMPORTS
========================= */
import "./globals.css";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sun, Moon, LogOut } from "lucide-react";

/* =========================
   CONFIG FONT
========================= */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/* =========================
   COMPONENTE PRINCIPAL
========================= */
export default function RootLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  const [loading, setLoading] = useState(true)
  const [dark, setDark] = useState(false)

  const isLoginPage = pathname === '/login'

  /* =========================
     🔐 CONTROLE DE SESSÃO
  ========================= */
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session'))

    // 🚫 Não logado → login
    if (!session && !isLoginPage) {
      router.push('/login')
      return
    }

    // 📅 Verificar expiração
    if (session) {
      const hoje = new Date().toDateString()

      if (session.expira !== hoje) {
        localStorage.removeItem('session')
        router.push('/login')
        return
      }
    }

    // 🚫 Já logado → impedir voltar pro login
    if (session && isLoginPage) {
      router.push('/')
      return
    }

    setLoading(false)
  }, [pathname])

  /* =========================
     🌙 TEMA (INIT)
  ========================= */
  useEffect(() => {
    const saved = localStorage.getItem("theme")

    if (saved === "dark") {
      setDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  /* =========================
     🔄 TOGGLE TEMA
  ========================= */
  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setDark(false)
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setDark(true)
    }
  }

  /* =========================
     🔓 LOGOUT
  ========================= */
  const logout = () => {
    localStorage.removeItem('session')
    router.push('/login')
  }

  /* =========================
     ⏳ LOADING (evita bug visual)
  ========================= */
  if (loading) return null

  /* =========================
     RENDER
  ========================= */
  return (
    <html lang="pt-br">
      <body className={`${inter.variable} font-sans bg-[#F3F4F6] dark:bg-gray-900 text-gray-800 dark:text-white transition`}>

        {/* =========================
           🔝 HEADER GLOBAL
        ========================= */}
        {!isLoginPage && (
          <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#0B1F3A] shadow-sm">

            {/* 🏢 LOGO + NOME */}
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Logo empresa"
                className="w-9 h-9 object-contain"
              />
              <span className="font-bold text-lg tracking-wide">
                PulseFlow
              </span>
            </div>

            {/* ⚙️ AÇÕES */}
            <div className="flex items-center gap-3">

              {/* 🌙 TEMA */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:scale-105 transition"
                title="Alternar tema"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* 🔓 LOGOUT */}
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
                title="Sair"
              >
                <LogOut size={18} />
              </button>

            </div>

          </header>
        )}

        {/* =========================
           📄 CONTEÚDO
        ========================= */}
        <main>
          {children}
        </main>

      </body>
    </html>
  );
}
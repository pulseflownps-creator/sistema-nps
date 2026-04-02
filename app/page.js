'use client'

/* =========================
   IMPORTS
========================= */
import Link from 'next/link'
import { Activity, PlusCircle } from 'lucide-react'

/* =========================
   HOME (DASHBOARD)
========================= */
export default function Home() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition p-4">

      {/* CONTAINER */}
      <div className="w-full max-w-md">

        {/* TÍTULO */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Painel
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Bem-vindo ao PulseFlow
          </p>
        </div>

        {/* CARDS */}
        <div className="grid gap-4">

          {/* 🔵 NPS */}
          <Link href="/nps">
            <div className="flex items-center gap-4 p-5 rounded-2xl shadow-md 
              bg-white dark:bg-[#1E293B] 
              hover:scale-[1.02] hover:shadow-lg transition cursor-pointer">

              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl">
                <Activity className="text-blue-600 dark:text-blue-300" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-800 dark:text-white">
                  Controle NPS
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Gerencie seus atletas
                </p>
              </div>

            </div>
          </Link>

          {/* ⚪ EM BREVE */}
          <div className="flex items-center gap-4 p-5 rounded-2xl shadow-md 
            bg-gray-200 dark:bg-gray-700 opacity-70 cursor-not-allowed">

            <div className="bg-gray-300 dark:bg-gray-600 p-3 rounded-xl">
              <PlusCircle className="text-gray-500" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-700 dark:text-gray-200">
                Em breve
              </h2>
              <p className="text-sm text-gray-500">
                Novos módulos chegando
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}
'use client'

/* =========================
   IMPORTS
========================= */
import Link from 'next/link'
import { useEffect } from 'react'
import { Activity, Users } from 'lucide-react'

/* =========================
   HOME (DASHBOARD)
========================= */
export default function Home() {

  /* 🧠 TITLE (SEGURO) */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = 'Dashboard | PulseFlow'
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Visão geral do sistema
        </p>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl shadow-sm 
        hover:shadow-md hover:scale-[1.02] transition">
          <p className="text-sm text-gray-500">Total de atletas</p>
          <h2 className="text-3xl font-bold">--</h2>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl shadow-sm 
        hover:shadow-md hover:scale-[1.02] transition">
          <p className="text-sm text-gray-500">Respondidos</p>
          <h2 className="text-3xl font-bold">--</h2>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl shadow-sm 
        hover:shadow-md hover:scale-[1.02] transition">
          <p className="text-sm text-gray-500">Taxa NPS</p>
          <h2 className="text-3xl font-bold">--%</h2>
        </div>

      </div>

      {/* AÇÕES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* NPS */}
        <Link href="/nps">
          <div className="flex items-center gap-4 p-5 rounded-2xl shadow-sm 
            bg-white dark:bg-[#1E293B] 
            hover:shadow-md hover:scale-[1.02] transition cursor-pointer">

            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl">
              <Activity className="text-blue-600 dark:text-blue-300" />
            </div>

            <div>
              <h2 className="font-semibold">
                Controle NPS
              </h2>
              <p className="text-sm text-gray-500">
                Gerencie seus atletas
              </p>
            </div>

          </div>
        </Link>

        {/* EM BREVE */}
        <div className="flex items-center gap-4 p-5 rounded-2xl shadow-sm 
          bg-gray-200 dark:bg-gray-700 opacity-70 cursor-not-allowed">

          <div className="bg-gray-300 dark:bg-gray-600 p-3 rounded-xl">
            <Users className="text-gray-500" />
          </div>

          <div>
            <h2 className="font-semibold">
              Em breve
            </h2>
            <p className="text-sm text-gray-500">
              Novos módulos chegando
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}
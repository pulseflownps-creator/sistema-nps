'use client'
import Link from 'next/link'

export default function NPS() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-[350px]">
        
        {/* Botão voltar correto */}
        <Link href="/">
          <button className="mb-4 bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition">
            ← Voltar
          </button>
        </Link>

        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          Sistema NPS
        </h1>

        <div className="grid gap-4">
          
          <Link href="/nps/cadastro">
            <button className="w-full bg-green-600 text-white p-4 rounded-xl shadow hover:bg-green-700 transition">
              Cadastrar Atleta
            </button>
          </Link>

          <Link href="/nps/tabela">
            <button className="w-full bg-blue-600 text-white p-4 rounded-xl shadow hover:bg-blue-700 transition">
              Ver Tabela
            </button>
          </Link>

          <Link href="/nps/relatorio">
            <button className="w-full bg-purple-600 text-white p-4 rounded-xl shadow hover:bg-purple-700 transition">
              Relatório
            </button>
          </Link>

        </div>

      </div>
    </div>
  )
}
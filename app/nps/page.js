'use client'
import Link from 'next/link'

export default function NPS() {
  return (
    <div>
      <Link href="/nps">
        <button className="mb-4 bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">
          ← Voltar
        </button>
      </Link>
      <h1 className="text-2xl font-bold mb-6">Sistema NPS</h1>

      <div className="grid gap-4">
        <Link href="/nps/cadastro">
          <button className="bg-green-600 text-white p-4 rounded-xl shadow hover:bg-green-700">
            Cadastrar Atleta
          </button>
        </Link>

        <Link href="/nps/tabela">
          <button className="bg-blue-600 text-white p-4 rounded-xl shadow hover:bg-blue-700">
            Ver Tabela
          </button>
        </Link>

        <Link href="/nps/relatorio">
          <button className="bg-purple-600 text-white p-4 rounded-xl shadow hover:bg-purple-700">
            Relatório
          </button>
        </Link>
      </div>
    </div>
  )
}
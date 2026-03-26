'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
    const path = usePathname()

    const linkClass = (rota) =>
        `block p-3 rounded-lg mb-2 ${path === rota
            ? 'bg-red-600 text-white'
            : 'text-gray-300 hover:bg-red-500 hover:text-white'
        }`

    return (
        <div className="w-64 h-screen bg-[#0B1F3A] p-4">
            <h1 className="text-white text-xl font-bold mb-6">
                NPS Sistema
            </h1>

            <Link href="/nps" className={linkClass('/nps')}>
                🏠 Menu
            </Link>

            <Link href="/nps/cadastro" className={linkClass('/nps/cadastro')}>
                ➕ Cadastro
            </Link>

            <Link href="/nps/tabela" className={linkClass('/nps/tabela')}>
                📋 Tabela
            </Link>

            <Link href="/nps/relatorio" className={linkClass('/nps/relatorio')}>
                📊 Relatório
            </Link>
        </div>
    )
}
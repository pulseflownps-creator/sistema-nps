"use client";

/* =========================
   IMPORTS
========================= */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import {
  User,
  Table,
  BarChart3,
  Menu,
  X,
  Home
} from "lucide-react";

/* =========================
   LAYOUT NPS
========================= */
export default function NpsLayout({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname.includes('cadastro')) {
      document.title = 'Cadastro | PulseFlow'
    } else if (pathname.includes('tabela')) {
      document.title = 'Tabela | PulseFlow'
    } else if (pathname.includes('relatorio')) {
      document.title = 'Relatório | PulseFlow'
    } else {
      document.title = 'NPS | PulseFlow'
    }
  }, [pathname])

  const menu = [
    { name: "Cadastro", path: "/nps/cadastro", icon: User },
    { name: "Tabela", path: "/nps/tabela", icon: Table },
    { name: "Relatório", path: "/nps/relatorio", icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">

      {/* MOBILE BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 
        bg-[#C62828] text-white p-2 rounded-lg shadow
        hover:scale-110 transition"
      >
        <Menu size={20} />
      </button>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:relative z-40 h-screen w-64 p-6 flex flex-col
          bg-[#0B1F3A] text-white
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >

        <button
          onClick={() => setOpen(false)}
          className="md:hidden mb-6 self-end hover:scale-110 transition"
        >
          <X />
        </button>

        <Link href="/">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-6 
          bg-white/10 hover:bg-white/20 hover:scale-[1.02] 
          transition cursor-pointer">
            <Home size={18} />
            <span>Painel</span>
          </div>
        </Link>

        <nav className="flex flex-col gap-2">
          {menu.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive
                    ? "bg-[#C62828] text-white shadow-md scale-[1.02]"
                    : "hover:bg-white/10 hover:scale-[1.02]"
                  }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

      </aside>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* CONTEÚDO */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        <header className="bg-white dark:bg-[#0B1F3A] px-6 py-4 shadow-sm shrink-0">
          <h1 className="text-sm text-gray-500 dark:text-gray-300">
            Controle NPS
          </h1>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto animate-fadeIn">
          {children}
        </main>

      </div>

    </div>
  );
}
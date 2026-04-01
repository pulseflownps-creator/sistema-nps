"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  User,
  Table,
  BarChart3,
  Menu,
  X
} from "lucide-react";

export default function NpsLayout({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menu = [
    { name: "Cadastro", path: "/nps/cadastro", icon: User },
    { name: "Tabela", path: "/nps/tabela", icon: Table },
    { name: "Relatório", path: "/nps/relatorio", icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen">

      {/* MOBILE BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#C62828] text-white p-2 rounded-lg"
      >
        <Menu size={20} />
      </button>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:relative z-40 h-full w-64 p-6 flex flex-col
          bg-[#0B1F3A] text-white
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >

        {/* CLOSE MOBILE */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden mb-6 self-end"
        >
          <X />
        </button>

        <h1 className="text-2xl font-bold mb-10">
          NPS System
        </h1>

        <nav className="flex flex-col gap-2">
          {menu.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    isActive
                      ? "bg-[#C62828] text-white shadow-md"
                      : "hover:bg-white/10"
                  }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

      </aside>

      {/* CONTEÚDO */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-white dark:bg-[#0B1F3A] px-6 py-4 shadow-sm flex justify-end">
          <span className="text-sm text-gray-500 dark:text-gray-300">
            Sistema NPS
          </span>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
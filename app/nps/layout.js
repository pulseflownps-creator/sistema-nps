"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NpsLayout({ children }) {
  const pathname = usePathname();

  const menu = [
    { name: "Cadastro", path: "/nps/cadastro", icon: "👤" },
    { name: "Tabela", path: "/nps/tabela", icon: "📋" },
    { name: "Relatório", path: "/nps/relatorio", icon: "📊" },
  ];

  return (
    <div className="flex h-screen">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0B1F3A] text-white flex flex-col p-6">
        
        <h1 className="text-2xl font-bold mb-10">
          NPS System
        </h1>

        <nav className="flex flex-col gap-2">
          {menu.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    isActive
                      ? "bg-[#C62828] text-white shadow-md"
                      : "hover:bg-white/10"
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
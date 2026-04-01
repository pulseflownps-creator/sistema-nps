"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Sistema NPS",
};

export default function RootLayout({ children }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDark(true);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <html lang="pt-br">
      <body
        className={`${inter.variable} font-sans transition-colors
        ${dark ? "bg-[#0B1F3A] text-white" : "bg-[#F3F4F6] text-gray-800"}
      `}
      >
        {/* BOTÃO DE TEMA */}
        <button
          onClick={() => setDark(!dark)}
          className="fixed top-4 right-4 z-50 bg-[#C62828] text-white px-4 py-2 rounded-lg shadow"
        >
          {dark ? "☀️ Claro" : "🌙 Escuro"}
        </button>

        {children}
      </body>
    </html>
  );
}
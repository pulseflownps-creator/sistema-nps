'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [lembrar, setLembrar] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = 'Login | PulseFlow'
    }
  }, [])

  const entrar = async () => {
    if (!email || !senha) {
      toast.error('Preencha todos os campos')
      return
    }

    if (!supabase?.auth) {
      toast.error('Erro de configuração do sistema')
      console.error('Supabase inválido')
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    })

    setLoading(false)

    if (error) {
      toast.error('Email ou senha inválidos')
      return
    }

    const hoje = new Date()
    const expira = hoje.toDateString()

    const storage = lembrar ? localStorage : sessionStorage

    storage.setItem('session', JSON.stringify({
      logado: true,
      expira,
      lembrar,
      user: data?.user?.id || null
    }))

    router.push('/')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) entrar()
  }

  return (
    <div className="min-h-screen overflow-hidden flex items-center justify-center 
    bg-gradient-to-br from-[#0B1F3A] to-[#020617] px-4">

      <Toaster position="top-right" />

      <div className="bg-white dark:bg-[#1E293B] 
      p-8 rounded-2xl shadow-xl w-full max-w-[380px] 
      flex flex-col gap-5 animate-fadeIn">

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold tracking-wide hover:scale-105 transition">
            PulseFlow
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Acesse sua conta
          </p>
        </div>

        <input
          type="email"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border border-gray-300 dark:border-gray-600 
          bg-white dark:bg-[#0B1F3A]
          p-2 rounded-lg
          focus:ring-2 focus:ring-[#C62828]
          hover:border-[#C62828]"
        />

        <input
          type="password"
          placeholder="Senha"
          onChange={e => setSenha(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border border-gray-300 dark:border-gray-600 
          bg-white dark:bg-[#0B1F3A]
          p-2 rounded-lg
          focus:ring-2 focus:ring-[#C62828]
          hover:border-[#C62828]"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={lembrar}
            onChange={() => setLembrar(!lembrar)}
          />
          Lembrar de mim
        </label>

        <button
          onClick={entrar}
          disabled={loading}
          className="bg-[#C62828] hover:bg-red-700 hover:scale-105 
          active:scale-95
          disabled:bg-gray-400
          text-white py-2 rounded-lg transition-all"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

      </div>
    </div>
  )
}
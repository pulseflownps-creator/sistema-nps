'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [lembrar, setLembrar] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const entrar = async () => {
    if (!email || !senha) {
      alert('Preencha todos os campos')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    })

    setLoading(false)

    if (error) {
      alert('Erro no login')
      return
    }

    // 🧠 SALVAR SESSÃO
    const hoje = new Date()
    const expira = hoje.toDateString()

    localStorage.setItem('session', JSON.stringify({
      logado: true,
      expira,
      lembrar
    }))

    router.push('/')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0B1F3A] to-[#020617]">

      {/* CARD */}
      <div className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl shadow-lg w-[350px] flex flex-col gap-4">

        <h1 className="text-2xl font-bold text-center">
          PulseFlow
        </h1>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          className="border p-2 rounded-lg"
        />

        {/* SENHA */}
        <input
          type="password"
          placeholder="Senha"
          onChange={e => setSenha(e.target.value)}
          className="border p-2 rounded-lg"
        />

        {/* LEMBRAR */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={lembrar}
            onChange={() => setLembrar(!lembrar)}
          />
          Lembrar de mim
        </label>

        {/* BOTÃO */}
        <button
          onClick={entrar}
          disabled={loading}
          className="bg-[#C62828] hover:bg-red-700 text-white py-2 rounded-lg"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

      </div>
    </div>
  )
}
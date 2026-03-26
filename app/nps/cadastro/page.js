'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { Card, Button, Input } from '@/components/ui'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [periodo, setPeriodo] = useState('')

  const salvar = async () => {
    await supabase.from('atletas').insert([{ nome, periodo }])
    alert('Salvo!')
  }

  return (
    <Card>
      <h1 className="text-xl font-bold mb-4">Cadastro de Atleta</h1>

      <div className="space-y-4">
        <Input placeholder="Nome" onChange={e => setNome(e.target.value)} />
        <Input placeholder="Período" onChange={e => setPeriodo(e.target.value)} />

        <Button onClick={salvar}>Salvar</Button>
      </div>
    </Card>
  )
}
'use client'

import { useState } from 'react'
import { Radio, RadioGroup, Card, CardBody, CardHeader, Button } from '@nextui-org/react'
import { CheckIcon } from 'lucide-react'

const frequencias = [
  { valor: 'mensal', rotulo: 'Mensal', sufixoPreco: '/mês' },
  { valor: 'anual', rotulo: 'Anual', sufixoPreco: '/ano' },
]
const planos = [
  {
    nome: 'Freelancer',
    id: 'plano-freelancer',
    href: '#',
    preco: { mensal: 'R$75', anual: 'R$720' },
    descricao: 'O essencial para oferecer seu melhor trabalho aos clientes.',
    recursos: ['5 produtos', 'Até 1.000 assinantes', 'Análises básicas', 'Tempo de resposta de suporte de 48 horas'],
    maisPopular: false,
  },
  {
    nome: 'Startup',
    id: 'plano-startup',
    href: '#',
    preco: { mensal: 'R$150', anual: 'R$1.440' },
    descricao: 'Um plano que cresce com seu negócio em rápida expansão.',
    recursos: [
      '25 produtos',
      'Até 10.000 assinantes',
      'Análises avançadas',
      'Tempo de resposta de suporte de 24 horas',
      'Automações de marketing',
    ],
    maisPopular: true,
  },
  {
    nome: 'Empresarial',
    id: 'plano-empresarial',
    href: '#',
    preco: { mensal: 'R$300', anual: 'R$2.880' },
    descricao: 'Suporte dedicado e infraestrutura para sua empresa.',
    recursos: [
      'Produtos ilimitados',
      'Assinantes ilimitados',
      'Análises avançadas',
      'Tempo de resposta de suporte dedicado de 1 hora',
      'Automações de marketing',
      'Ferramentas de relatórios personalizados',
    ],
    maisPopular: false,
  },
]

export default function Precos() {
  const [frequencia, setFrequencia] = useState(frequencias[0])

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Preços</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Planos de preços para equipes de&nbsp;todos&nbsp;os&nbsp;tamanhos
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Escolha um plano acessível repleto dos melhores recursos para engajar seu público, criar fidelidade do cliente e impulsionar vendas.
        </p>
        <div className="mt-16 flex justify-center">
          <RadioGroup
            label="Frequência de pagamento"
            orientation="horizontal"
            value={frequencia.valor}
            onValueChange={(valor) => setFrequencia(frequencias.find((f) => f.valor === valor) || frequencias[0])}
          >
            {frequencias.map((opcao) => (
              <Radio key={opcao.valor} value={opcao.valor}>
                {opcao.rotulo}
              </Radio>
            ))}
          </RadioGroup>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {planos.map((plano) => (
            <Card
              key={plano.id}
              classNames={{
                base: plano.maisPopular ? 'border-2 border-primary p-6' : 'p-6',
              }}
              
              shadow="sm"
            >
              <CardHeader className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${plano.maisPopular ? 'text-primary' : 'text-gray-900'}`}>
                  {plano.nome}
                </h3>
                {plano.maisPopular && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    Mais popular
                  </span>
                )}
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-600">{plano.descricao}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold text-gray-900">{plano.preco[frequencia.valor as keyof typeof plano.preco]}</span>
                  <span className="text-sm font-semibold text-gray-600">{frequencia.sufixoPreco}</span>
                </p>
                <Button
                  href={plano.href}
                  color={plano.maisPopular ? 'primary' : 'default'}
                  variant={plano.maisPopular ? 'solid' : 'flat'}
                  className="mt-6 w-full"
                >
                  Comprar plano
                </Button>
                <ul className="mt-8 space-y-3 text-sm text-gray-600">
                  {plano.recursos.map((recurso) => (
                    <li key={recurso} className="flex items-center gap-x-3">
                      <CheckIcon className="h-5 w-5 flex-shrink-0 text-primary" />
                      {recurso}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Radio, RadioGroup, Card, CardBody, CardHeader, Button, Chip } from '@nextui-org/react'
import { CheckCircle, CheckIcon } from 'lucide-react'

const frequencies = [
  { value: 'monthly', label: 'Mensal', priceSuffix: '/mês' },
  { value: 'yearly', label: 'Anual', priceSuffix: '/ano' },
]

const plans = [
  {
    name: 'Freelancer',
    id: 'plan-freelancer',
    href: '#',
    price: { monthly: 'Grátis', yearly: 'Grátis' },
    description: 'Perfeito para começar seu blog.',
    features: [
      '1 blog',
      '200 artigos',
      '2.000 visualizações/mês',
      'Domínio padrão',
      'I.A. com sua chave de API',
      'Tópicos pré-definidos',
      'API básica (100 requisições/mês)',
    ],
    mostPopular: false,
  },
  {
    name: 'Startup',
    id: 'plan-startup',
    href: '#',
    price: { monthly: 'R$5', yearly: 'R$60' },
    description: 'Ideal para blogs em crescimento.',
    features: [
      '2 blogs',
      '1.200 artigos',
      '20.000 visualizações/mês',
      'Domínio personalizado',
      'I.A. com sua chave de API',
      'I.A. nativa (1.000 requisições/mês)',
      'Sistema de comentários e likes',
      'Login social',
      'Criação de tópicos personalizados',
      'API completa (1.000 requisições/mês)',
    ],
    mostPopular: true,
  },
  {
    name: 'Empresarial',
    id: 'plan-enterprise',
    href: '#',
    price: { monthly: 'R$35', yearly: 'R$420' },
    description: 'Recursos avançados para grandes operações de blog.',
    features: [
      'Blogs ilimitados',
      'Artigos ilimitados',
      'Visualizações ilimitadas',
      'Domínio personalizado',
      'I.A. com sua chave de API',
      'I.A. nativa ilimitada',
      'Sistema de comentários avançado',
      'Login social e SSO',
      'Gerenciamento avançado de tópicos',
      'API ilimitada com suporte prioritário',
      'Análise de engajamento',
      'Sistema de assinantes e newsletter',
      'Automações de marketing',
      'Integrações e Webhooks',
    ],
    mostPopular: false,
  },
]

export default function Pricing() {
  const [frequency, setFrequency] = useState(frequencies[0])

  return (
    <div className="dark:bg-gray-950 p-4">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Chip color='primary' variant='shadow' className="text-xs font-semibold leading-7">Preços</Chip>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Planos para todos os tipos de blogs
          </h1>
        </div>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-gray-300">
          Escolha o plano ideal para o seu blog, desde iniciantes até grandes operações.
        </p>
        <div className="mt-16 flex justify-center">
          <RadioGroup
            label="Frequência de pagamento"
            orientation="horizontal"
            value={frequency.value}
            onValueChange={(value) => setFrequency(frequencies.find((f) => f.value === value) || frequencies[0])}
          >
            {frequencies.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </RadioGroup>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              classNames={{
                base: plan.mostPopular
                  ? 'border-2 border-primary dark:border-primary dark:bg-gray-950 p-6'
                  : 'p-6 dark:bg-gray-950 border-2 dark:border-gray-900',
              }}
              shadow="sm"
            >
              <CardHeader className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${
                  plan.mostPopular ? 'text-primary' : 'text-gray-900 dark:text-white'
                }`}>
                  {plan.name}
                </h3>
                {plan.mostPopular && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    Mais popular
                  </span>
                )}
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price[frequency.value as keyof typeof plan.price]}
                  </span>
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{frequency.priceSuffix}</span>
                </p>
                <ul className="my-8 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-x-3">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  href={plan.href}
                  color={plan.mostPopular ? 'primary' : 'default'}
                  variant={plan.mostPopular ? 'solid' : 'flat'}
                  className="w-full mt-auto"
                >
                  Comprar plano
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

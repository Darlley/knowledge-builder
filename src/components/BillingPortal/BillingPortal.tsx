'use client';

import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react'; // Adicione esta importação

import { plans } from '@/constants/plans';
import { BillingPortalProps } from './BillingPortal.types';
export default function BillingPortal(props: BillingPortalProps) {
  const { subscription, user } = props;
  const [isRequestAction, setIsRequestAction] = useState(false); // Adicione este estado

  const plan = plans.find((item) => item.id === subscription.planId);

  const redirectToBillingPortal = async (userId: string) => {
    setIsRequestAction(true); // Inicie o loading
    try {
      const response = await fetch('/api/portal', {
        method: 'POST', // Use GET para a requisição

        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId, // Enviando userId no cabeçalho
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao criar sessão do portal de cobrança');
      }

      const data = await response.json();
      window.location.href = data.url; // Redireciona para a URL do portal de cobrança
    } catch (error) {
      console.error('Erro ao redirecionar para o portal de cobrança:', error);
    } finally {
      setIsRequestAction(false); // Finalize o loading
    }
  };

  return (
    <div className="dark:bg-gray-950 p-4">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-6">
          <div className="text-center lg:text-left flex flex-col">
            <h1 className="text-xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Seu plano atual
            </h1>
            <p className="mx-auto md:mt-4 max-w-2xl text-sm md:text-lg leading-8 text-gray-600 dark:text-gray-300">
              Clique no botão para mudar sua assinatura.
            </p>
          </div>
          <Card
            classNames={{
              base: 'border-2 border-primary dark:border-primary dark:bg-gray-950 p-6',
              header: 'flex flex-col justify-start text-left items-start',
            }}
            shadow="sm"
          >
            <CardHeader>
              <h3
                className={`text-lg font-semibold ${
                  plan?.mostPopular
                    ? 'text-primary'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {plan?.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {plan?.description}
              </p>
            </CardHeader>
            <CardBody>
              <h4 className="flex items-baseline gap-x-1">
                <span className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {plan?.price.monthly}
                </span>
              </h4>
              <p className="md:mt-4 text-sm md:text-lg font-semibold text-gray-900 dark:text-white">
                O que você pode fazer:
              </p>
              <ul className="my-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                {plan?.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                color="primary"
                variant="solid"
                className="mt-4 w-full"
                onClick={() => redirectToBillingPortal(user?.id ?? '')} // Chama a função ao clicar
                isLoading={isRequestAction} // Adicione esta propriedade
              >
                Editar Assinatura
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

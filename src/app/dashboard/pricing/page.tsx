import Pricing from '@/components/Pricing';
import { plans } from '@/constants/plans';
import prisma from '@/utils/db';
import { requireUser } from '@/utils/requireUser';
import { Button, Card, CardBody, CardHeader, Chip } from '@nextui-org/react';
import { CheckCircle } from 'lucide-react';

async function getSubscription(userId: string) {
  return await prisma.subscription.findUnique({
    where: { userId },
    select: {
      planId: true,
      status: true,
      User: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });
}

export default async function PricingPage() {
  const user = await requireUser();
  const subscription = await getSubscription(user?.id ?? '');

  if (subscription?.status == 'active') {
    const plan = plans.find((item) => {
      // Verifica se o item corresponde ao ID do plano e se o preço está definido
      if (
        (item.id === 'plan-enterprise' &&
          process.env.STRIPE_ENTERPRISE_PRICE_ID) ||
        (item.id === 'plan-startup' && process.env.STRIPE_STARTUP_PRICE_ID)
      ) {
        return item;
      }
    });

    return (
      <div className="dark:bg-gray-950 p-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="text-center lg:text-left flex flex-col">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                Seu plano atual
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
                Clique no botão para mudar sua assinatura.
              </p>
            </div>
              <Card
                classNames={{
                  base: 'border-2 border-primary dark:border-primary dark:bg-gray-950 p-6'
                }}
                shadow="sm"
              >
                <CardHeader className="flex items-center justify-between">
                  <h3
                    className={`text-lg font-semibold ${
                      plan?.mostPopular
                        ? 'text-primary'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {plan?.name}
                  </h3>
                </CardHeader>
                <CardBody>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {plan?.description}
                  </p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan?.price.monthly}
                    </span>
                  </p>
                  <h4 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    O que você pode fazer:
                  </h4>
                  <ul className="my-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    {plan?.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-x-3">
                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button color="primary" variant="solid" className="mt-4 w-full">
                    Editar Assinatura
                  </Button>
                </CardBody>
              </Card>
          </div>
        </div>
      </div>
    );
  }

  return <Pricing />;
}

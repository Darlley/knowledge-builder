import BillingPortal from '@/components/BillingPortal';
import Pricing from '@/components/Pricing';
import prisma from '@/utils/db';
import { requireUser } from '@/utils/requireUser';

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
    return <BillingPortal subscription={subscription} user={user} />;
  }

  return <Pricing />;
}

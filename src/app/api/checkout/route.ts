import prisma from '@/utils/db';
import { requireUser } from '@/utils/requireUser';
import { stripe } from '@/utils/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { userId, planId } = await request.json();
  console.log({ userId, planId });
  const user = await requireUser();

  if (userId && planId) {
    try {
      // Use o ID do usuário autenticado em vez do userId do corpo da requisição
      let stripeUserId = await prisma.user.findUnique({
        where: {
          id: userId, // Use o ID do usuário autenticado
        },
        select: {
          stripeCustomerId: true,
          email: true,
          firstName: true,
        },
      });

      if (!stripeUserId?.stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: stripeUserId?.email,
          name: stripeUserId?.firstName,
        });

        stripeUserId = await prisma.user.update({
          where: {
            id: userId, // Use o ID do usuário autenticado
          },
          data: {
            stripeCustomerId: customer?.id,
          },
        });
      }

      let priceId;
      switch (planId) {
        case 'plan-startup':
          priceId = process.env.STRIPE_STARTUP_PRICE_ID;
          break;
        case 'plan-enterprise':
          priceId = process.env.STRIPE_ENTERPRISE_PRICE_ID;
          break;
        default:
          throw new Error('Plano inválido');
      }

      const session = await stripe.checkout.sessions.create({
        customer: stripeUserId?.stripeCustomerId as string,
        mode: 'subscription',
        billing_address_collection: 'auto',
        payment_method_types: ['card'],
        customer_update: {
          address: 'auto',
          name: 'auto',
        },
        success_url: 'http://localhost:3000/dashboard/payment/success',
        cancel_url: 'http://localhost:3000/dashboard/payment/cancelled',
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
      });

      return NextResponse.json({ url: session.url });
    } catch (error) {
      console.error('Erro ao criar sessão de checkout:', error);
      return NextResponse.json(
        { error: 'Erro ao processar o checkout' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: 'Erro ao processar o checkout' },
    { status: 500 }
  );
}

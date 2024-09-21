import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from '@/utils/db';
import { requireUser } from '@/utils/requireUser';
import { stripe } from '@/utils/stripe';
import { redirect } from 'next/navigation';

export async function POST(request: NextRequest) {
  const { userId } = await request.json();
  const user = await requireUser();

  if (!user) {
    return NextResponse.redirect('/api/auth/login');
  }

  try {
    let stripeUserId = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        stripeCustomerId: true,
        email: true,
        firstName: true,
      },
    });

    if(!stripeUserId?.stripeCustomerId){
      const customer = await stripe.customers.create({
        email: stripeUserId?.email,
        name: stripeUserId?.firstName,
      });

      stripeUserId = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          stripeCustomerId: customer?.id,
        },
      });
    }

    // Criar uma sessão de checkout do Stripe
    const session = await stripe.checkout.sessions.create({
      customer: stripeUserId?.stripeCustomerId as string,
      mode: 'subscription', // Modo de assinatura
      billing_address_collection: 'auto',
      payment_method_types: ['card', 'pix'], // Aceita pagamentos com cartão
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
      success_url: 'http://localhost:3000/dashboard/payment/success', // URL de redirecionamento em caso de sucesso
      cancel_url: 'http://localhost:3000/dashboard/payment/cancelled', // URL de redirecionamento em caso de cancelamento
      line_items: [
        {
          price: process.env.STRIPE_STARTUP_PRICE_ID, // ID do preço do plano Pro
          quantity: 1, // Quantidade do item (assinatura)
        },
        {
          price: process.env.STRIPE_ENTERPRISE_PRICE_ID, // ID do preço do plano Pro
          quantity: 1, // Quantidade do item (assinatura)
        }
      ],
    });

    return redirect(session.url as string);
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    return NextResponse.json(
      { error: 'Erro ao processar o checkout' },
      { status: 500 }
    );
  }
}

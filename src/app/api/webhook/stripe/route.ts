import prisma from "@/utils/db";
import { stripe } from "@/utils/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import { Prisma } from '@prisma/client';

/**
 * Manipula webhooks do Stripe para processar eventos de assinatura.
 * @param req - O objeto de requisição recebido.
 * @returns Uma resposta indicando o sucesso ou falha do processamento do webhook.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    // Verifica a assinatura do webhook para garantir que veio do Stripe
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    console.error("Erro na verificação do webhook:", error);
    return new Response("Erro no webhook", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Processa o evento de conclusão de checkout
  if (event.type === "checkout.session.completed") {
    await handleCheckoutSessionCompleted(session);
  }

  // Processa o evento de pagamento de fatura bem-sucedido
  if (event.type === "invoice.payment_succeeded") {
    await handleInvoicePaymentSucceeded(session);
  }

  return new Response("Webhook recebido", { status: 200 });
}

/**
 * Manipula o evento de conclusão de checkout.
 * @param session - A sessão de checkout do Stripe.
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  const customerId = session.customer as string;
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!user) throw new Error("User not found.");

  
  // Cancela a assinatura anterior, se existir
  const existingSubscription = await prisma.subscription.findUnique({
    where: { userId: user.id }
  });
  
  // Apaga qualquer assinatura existente do usuário
  await prisma.subscription.deleteMany({
    where: { userId: user.id }
  });
  
  if (existingSubscription) {
    try {
      await stripe.subscriptions.cancel(existingSubscription.stripeSubscriptionId);
    } catch (error) {
      if (error instanceof Stripe.errors.StripeInvalidRequestError) {
        console.warn(`Assinatura não encontrada no Stripe: ${existingSubscription.stripeSubscriptionId}`);
      } else {
        throw error; // Lança outros erros
      }
    }
  }

  const subscriptionData = {
    stripeSubscriptionId: subscription.id,
    userId: user.id,
    currentPeriodStart: subscription.current_period_start,
    currentPeriodEnd: subscription.current_period_end,
    status: subscription.status,
    planId: subscription.items.data[0].price.id,
    interval: String(subscription.items.data[0].plan.interval),
  };

  // Atualiza ou cria uma nova assinatura no banco de dados
  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscriptionData?.stripeSubscriptionId },
    update: subscriptionData,
    create: subscriptionData,
  });
}

/**
 * Manipula o evento de pagamento de fatura bem-sucedido.
 * @param session - A sessão de checkout do Stripe.
 */
async function handleInvoicePaymentSucceeded(session: Stripe.Checkout.Session) {
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  const customerId = session.customer as string;

  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error("Usuário não encontrado para o customerId:", customerId);
    return;
  }

  const subscriptionData = {
    stripeSubscriptionId: subscription.id,
    userId: user.id,
    currentPeriodStart: subscription.current_period_start,
    currentPeriodEnd: subscription.current_period_end,
    status: subscription.status,
    planId: subscription.items.data[0].price.id,
    interval: String(subscription.items.data[0].plan.interval),
  };

  try {
    // Tenta atualizar a assinatura existente
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: subscriptionData,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      // Se a assinatura não existir, cria uma nova
      await prisma.subscription.create({
        data: subscriptionData,
      });
    } else {
      // Se for outro tipo de erro, lança novamente
      console.error('Erro ao atualizar/criar assinatura:', error);
      throw error;
    }
  }
}

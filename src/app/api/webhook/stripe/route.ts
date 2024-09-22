import prisma from "@/utils/db";
import { stripe } from "@/utils/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request, res: Response) {
  const body = await req.text();

  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    return new Response("Webhook Error", { status: 400 });
  }

  const session = event?.data.object as Stripe.Checkout.Session;

  if(event.type === "checkout.session.completed"){
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    const customerId = session.customer as string;
    const user = await prisma.user.findUnique({
      where: {
        stripeCustomerId: customerId
      },
    });

    if(!user) throw new Error("User not found");

    await prisma.subscription.create({
      data: {
        stripeSubscriptionId: subscription.id,
        userId: user.id,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        status: subscription.status,
        planId: subscription.items.data[0].plan.id,
        interval: String(subscription.items.data[0].plan.interval),
      }
    })
  }

  if(event.type === "invoice.payment_succeeded"){
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    await prisma.subscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        planId: subscription.items.data[0].plan.id,
        currentPeriodEnd: subscription.current_period_end,
        currentPeriodStart: subscription.current_period_start,
        status: subscription.status,
      }
    })
  }

  return new Response("Webhook received", { status: 200 });
}

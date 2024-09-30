import prisma from "@/utils/db";
import { stripe } from "@/utils/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET(){
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if(!user || user === null || !user?.id) throw new Error('Algo errado aconteceu...')

  let dbUser = await prisma.user.findUnique({
    where: {
      id: user.id
    }
  })

  if(!dbUser){
    // Criar o usuário no banco de dados
    dbUser = await prisma.user.create({
      data: {
        id: user?.id ?? '',
        firstName: user?.given_name ?? '',
        lastName: user?.family_name ?? '',
        name: `${user?.given_name ?? ''} ${user?.family_name ?? ''}`,
        email: user?.email ?? '',
        profileImage: user?.picture ?? `https://avatar.vercel.sh/${user?.given_name}`
      }
    });

    // Criar cliente no Stripe usando os dados do novo dbUser
    const customer = await stripe.customers.create({
      email: dbUser.email,
      name: `${dbUser.firstName} ${dbUser.lastName}`,
    });

    // Atualizar o dbUser com o ID do cliente Stripe
    dbUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: { stripeCustomerId: customer.id },
    });
  } else {
    // Se o usuário já existir, buscar o cliente no Stripe
    let customer = (await stripe.customers.list({
      email: dbUser.email
    })).data[0];

    if (!customer) {
      customer = await stripe.customers.create({
        email: dbUser.email,
        name: `${dbUser.firstName} ${dbUser.lastName}`,
      });
    }
  }

  return NextResponse.redirect(`${process.env.KINDE_SITE_URL!}/dashboard`)
}
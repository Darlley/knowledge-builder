import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

const KINDE_SITE_URL = process.env.KINDE_SITE_URL

export const requireUser = async () => {
  const { getUser } = getKindeServerSession(); // Substitua pela forma correta de obter o usuário
  const user = await getUser();

  if (!user) {
    return NextResponse.redirect(KINDE_SITE_URL + '/api/auth/login');
  }

  return user;
}
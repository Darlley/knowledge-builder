// src/app/api/create-site/route.ts
import { NextResponse } from 'next/server';
import { siteSchema } from '@/utils/zodSchemas';
import { z } from 'zod';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from '@/utils/db';

// Função para lidar com a rota POST
export async function POST(request: Request) {
  const { getUser } = getKindeServerSession(); // Substitua pela forma correta de obter o usuário
  const user = await getUser()

  if (!user) {
    return NextResponse.redirect('/api/auth/login');
  }

  try {
    const formData = await request.json();
    const submission = siteSchema.safeParse(formData);

    if (!submission.success) {
      return NextResponse.json({ errors: submission.error.errors }, { status: 400 });
    }

    const response = await prisma.site.create({
      data: {
        description: submission.data.description,
        name: submission.data.name,
        subdirectory: submission.data.subdirectory,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: 'Site criado com sucesso' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

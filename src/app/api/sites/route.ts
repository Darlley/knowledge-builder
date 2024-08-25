// src/app/api/create-site/route.ts
import prisma from '@/utils/db';
import { siteSchema } from '@/utils/zodSchemas';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextResponse } from 'next/server';

export async function GET() {
  const { getUser } = getKindeServerSession(); // Substitua pela forma correta de obter o usuário
  const user = await getUser();


  try {
    const sites = await prisma.site.findMany({
      where: {
        userId: user?.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(sites, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao listar os sites' },
      { status: 500 }
    );
  }
}

// Função para lidar com a rota POST
export async function POST(request: Request) {
  const { getUser } = getKindeServerSession(); // Substitua pela forma correta de obter o usuário
  const user = await getUser();

  if (!user) {
    return NextResponse.redirect('/api/auth/login');
  }

  try {
    const formData = await request.json();
    const parsed = siteSchema.safeParse(formData);

    if (!parsed.success) {
      // Retornar erros de validação Zod
      return NextResponse.json(
        {
          type: 'validation',
          message: 'Dados inválidos',
          status: 400,
        },
        { status: 400 }
      );
    }

    const { name, description, subdirectory } = parsed.data;

    // Tentar criar o site
    try {
      await prisma.site.create({
        data: {
          name,
          description,
          subdirectory,
          userId: user?.id
        },
      });

      // Retornar sucesso
      return NextResponse.json(
        { message: 'Site criado com sucesso' },
        { status: 200 }
      );
    } catch (prismaError) {
      // Verificar se o erro é uma instância de PrismaClientKnownRequestError
      if (prismaError instanceof PrismaClientKnownRequestError) {
        // Tratar erros específicos do Prisma
        if (prismaError.code === 'P2002') {
          // Violação de unicidade (subdirectory)
          return NextResponse.json(
            {
              type: 'directoryExists',
              message: 'Subdiretório já existe',
              status: 400,
            },
            { status: 400 }
          );
        }
      }

      // Outros erros do Prisma
      return NextResponse.json(
        {
          type: 'serverError',
          message: 'Erro ao criar o site',
          status: 500,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    // Erro inesperado
    return NextResponse.json(
      {
        type: 'serverError',
        message: 'Erro interno do servidor',
        status: 500,
      },
      { status: 500 }
    );
  }
}

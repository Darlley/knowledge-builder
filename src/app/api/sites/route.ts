// src/app/api/create-site/route.ts
import prisma from '@/utils/db';
import { siteSchema } from '@/utils/zodSchemas';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextRequest, NextResponse } from 'next/server';
import { SiteCreateSchema } from '@/utils/zodSchemas'; // Import the SiteCreateSchema

export async function GET(request: NextRequest) {
  const { getUser } = getKindeServerSession(); // Substitua pela forma correta de obter o usuário
  const user = await getUser();

  if (!user) {
    return NextResponse.redirect('/api/auth/login');
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    const sites = await prisma.site.findMany({
      where: {
        userId
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

export async function POST(request: Request) {
  const { getUser } = getKindeServerSession(); // Substitua pela forma correta de obter o usuário
  const user = await getUser();

  if (!user) {
    return NextResponse.redirect('/api/auth/login');
  }

  try {
    const { userId, ...formData } = await request.json();

    const isSubdirectoryUnique = async () => {
      const existingSite = await prisma.site.findUnique({
        where: { subdirectory: formData.subdirectory },
      });
      return !existingSite;
    };

    const createSiteSchema = SiteCreateSchema({ isSubdirectoryUnique });
    const parsed = await createSiteSchema.safeParseAsync(formData);

    if (!parsed.success) {
      const errors = parsed.error.errors.map(err => ({
        field: err.path[0],
        message: err.message
      }));

      return NextResponse.json(
        {
          type: 'validationError',
          message: 'Erro de validação',
          errors: errors
        },
        { status: 400 }
      );
    }

    const { name, description, subdirectory } = parsed.data;

    await prisma.site.create({
      data: {
        name,
        description,
        subdirectory,
        userId
      },
    });

    return NextResponse.json(
      { message: 'Site criado com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        type: 'serverError',
        message: 'Erro interno do servidor',
        error: 'Ocorreu um erro inesperado ao processar a solicitação.'
      },
      { status: 500 }
    );
  }
}

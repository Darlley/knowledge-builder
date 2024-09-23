// src/app/api/create-site/route.ts
import prisma from '@/utils/db';
import { SiteCreateSchema } from '@/utils/zodSchemas'; // Import the SiteCreateSchema
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * GET /api/sites
 * 
 * Retorna todos os sites associados a um usuário específico.
 * Requer autenticação.
 */
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
        userId,
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

/**
 * POST /api/sites
 * 
 * Cria um novo site para o usuário autenticado.
 * Verifica o plano de assinatura do usuário e limita a criação de sites de acordo.
 */
export async function POST(request: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.redirect('/api/auth/login');
  }

  const [subscription, sites] = await Promise.all([
    prisma.subscription.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        status: true,
        planId: true,
      },
    }),
    prisma.site.findMany({
      where: {
        userId: user.id,
      },
    }),
  ]);

  console.log("subscription.planId", subscription?.planId)
  const canCreateSite = () => {

    if (!subscription || subscription.status !== 'active') {
      return sites.length < 1;
    }


    switch (subscription.planId) {
      case 'plan-freelancer':
        return sites.length < 1;
      case process.env.STRIPE_STARTUP_PRICE_ID:
        return sites.length < 2;
      case process.env.STRIPE_ENTERPRISE_PRICE_ID:
        return true;
      default:
        return false;
    }
  };

  if (!canCreateSite()) {
    return NextResponse.json({
      type: 'subscriptionError',
      message: 'Você atingiu o limite de sites para o seu plano atual.',
      error: 'Limite de sites atingido',
    }, { status: 403 });
  }

  const { userId, ...formData } = await request.json();
  return createSite(userId, formData);
}

/**
 * Função auxiliar para criar um novo site
 * 
 * @param userId - ID do usuário que está criando o site
 * @param formData - Dados do formulário para criar o site
 * @returns NextResponse com o resultado da operação
 */
async function createSite(userId: string, formData: z.infer<ReturnType<typeof SiteCreateSchema>>) {
  try {
    const isSubdirectoryUnique = async () => {
      const existingSite = await prisma.site.findUnique({
        where: { subdirectory: formData.subdirectory },
      });
      return !existingSite;
    };

    const createSiteSchema = SiteCreateSchema({ isSubdirectoryUnique });
    const parsed = await createSiteSchema.safeParseAsync(formData);

    if (!parsed.success) {
      const errors = parsed.error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));

      return NextResponse.json(
        {
          type: 'validationError',
          message: 'Erro de validação',
          errors: errors,
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
        userId,
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
        error: 'Ocorreu um erro inesperado ao processar a solicitação.',
      },
      { status: 500 }
    );
  }
}

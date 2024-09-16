import prisma from '@/utils/db';
import { requireUser } from '@/utils/requireUser';
import { postSchema } from '@/utils/zodSchemas';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      siteId: string;
    };
  }
) {
  const siteId = params.siteId;
  const user = requireUser();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const isRecent = searchParams.get('recent') === 'true';

  try {
    let articles;

    if (isRecent) {
      // Buscar posts recentes de todos os sites
      articles = await prisma.post.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          thumbnail: true,
          title: true,
          description: true,
          status: true,
          createdAt: true,
          slug: true,
          audience: true,
          Site: {
            select: {
              id: true,
              name: true,
              subdirectory: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      });
    } else {
      // Buscar posts de um site específico
      articles = await prisma.post.findMany({
        where: {
          userId,
          siteId,
        },
        select: {
          id: true,
          thumbnail: true,
          title: true,
          status: true,
          createdAt: true,
          slug: true,
          audience: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao listar os artigos' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      siteId: string;
    };
  }
) {
  const siteId = params.siteId;

  console.log("siteId", siteId)

  const user = requireUser();

  try {
    const { userId, ...formData } = await request.json();
    const parsed = postSchema.safeParse(formData);
    console.log("parsed.data", parsed.data)

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

    const { title, content, description, slug, thumbnail, status, audience } =
      parsed.data;

    await prisma.post.create({
      data: {
        title,
        content: JSON.stringify(content), // Aqui está o ponto importante
        description,
        slug,
        thumbnail,
        status,
        audience,
        siteId,
        userId
      },
    });

    // Retornar sucesso
    return NextResponse.json(
      { message: 'Artigo criado com sucesso.' },
      { status: 200 }
    );
  } catch (prismaError) {
    // Outros erros do Prisma
    if (prismaError instanceof PrismaClientKnownRequestError) {

      if (prismaError.code === 'P2002') {
        // Violação de unicidade (subdirectory)
        return NextResponse.json(
          {
            type: 'slugExists',
            message: 'Slug já existe',
            status: 400,
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        type: 'serverError',
        message: 'Erro ao criar o artigo',
        status: 500,
      },
      { status: 500 }
    );
  }
}

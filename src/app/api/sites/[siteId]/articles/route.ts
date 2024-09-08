// src/app/api/create-site/route.ts
import prisma from '@/utils/db';
import { requireUser } from '@/utils/requireUser';
import { postSchema } from '@/utils/zodSchemas';
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

  try {
    const articles = await prisma.post.findMany({
      where: {
        userId,
        siteId,
      },
      select: {
        thumbnail: true,
        title: true,
        status: true,
        id: true,
        createdAt: true,
        slug: true,
        audience: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao listar os sites' },
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

    try {
      await prisma.post.create({
        data: {
          title,
          content: JSON.stringify(content),
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
      return NextResponse.json(
        {
          type: 'serverError',
          message: 'Erro ao criar o artigo',
          status: 500,
        },
        { status: 500 }
      );
    }
  } catch (error) {
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

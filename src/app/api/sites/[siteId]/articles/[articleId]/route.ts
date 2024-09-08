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
      articleId: string;
    };
  }
) {
  const siteId = params.siteId;
  const articleId = params.articleId;

  const user = requireUser();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    const article = await prisma.post.findUnique({
      where: {
        id: articleId,
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
        content: true,
        updatedAt: true,
        description: true,

      }
    });

    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro no artigo' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      siteId: string;
      articleId: string;
    };
  }
) {
  const siteId = params.siteId;
  const articleId = params.articleId;

  const user = requireUser();

  try {
    const { userId, ...formData } = await request.json();
    const parsed = postSchema.safeParse(formData);

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

    const article = await prisma.post.update({
      where: {
        id: articleId,
      },
      data: {
        title,
        content,
        description,
        slug,
        thumbnail,
        status,
        audience,
        views: 0
      },
    });

    console.log(article)

    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao listar os sites' },
      { status: 500 }
    );
  }
}

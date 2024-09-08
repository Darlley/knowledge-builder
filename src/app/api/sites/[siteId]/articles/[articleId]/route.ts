// src/app/api/create-site/route.ts
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
      },
    });

    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro no artigo' }, { status: 500 });
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
  console.log('User:', user);

  try {
    const { userId, ...formData } = await request.json();
    console.log('Form data:', formData);
    const parsed = postSchema.safeParse(formData);

    if (!parsed.success) {
      return NextResponse.json(
        {
          type: 'validation',
          message: 'Dados inválidos',
          status: 400,
        },
        { status: 400 }
      );
    }

    try {
      const article = await prisma.post.update({
        where: {
          id: articleId,
        },
        data: parsed.data,
      });
      
      return NextResponse.json(article, { status: 200 });
    } catch (prismaError) {
      // Verificar se o erro é uma instância de PrismaClientKnownRequestError
      if (prismaError instanceof PrismaClientKnownRequestError) {
        // Tratar erros específicos do Prisma
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

        
      return NextResponse.json(
        {
          type: 'serverError',
          message: 'Erro ao atualizar o artigo',
          status: 500,
        },
        { status: 500 }
      );
      }
    }

  } catch (error) {
    console.error('Erro no PATCH:', error);
    return NextResponse.json(
      { error: 'Houve um erro ao atualizar o artigo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    await prisma.post.delete({
      where: {
        id: articleId,
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro no artigo' }, { status: 500 });
  }
}

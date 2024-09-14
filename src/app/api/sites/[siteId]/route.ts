import prisma from '@/utils/db';
import { requireUser } from '@/utils/requireUser';
import { siteSchema } from '@/utils/zodSchemas';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const { siteId } = params;

  try {
    const site = await prisma.site.findUnique({
      where: {
        id: siteId,
      },
      select: {
        id: true,
        name: true,
        subdirectory: true,
        description: true,
        imageUrl: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!site) {
      return NextResponse.json(
        {
          type: 'notFound',
          message: 'Site não encontrado',
          status: 404,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(site, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        type: 'serverError',
        message: 'Erro ao buscar informações do site',
        status: 500,
      },
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
    };
  }
) {
  const siteId = params.siteId;

  const user = requireUser();

  try {
    const { userId, ...formData } = await request.json();
    const parsed = siteSchema.safeParse(formData);

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
      const site = await prisma.site.update({
        where: {
          id: siteId,
          userId,
        },
        data: parsed.data,
      });

      return NextResponse.json(site, { status: 200 });
    } catch (prismaError) {
      if (prismaError instanceof PrismaClientKnownRequestError) {
        if (prismaError.code === 'P2002') {
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

      return NextResponse.json(
        {
          type: 'serverError',
          message: 'Erro ao atualizar o site',
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const siteId = params.siteId;

  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        {
          type: 'unauthorized',
          message: 'Usuário não autenticado',
          status: 401,
        },
        { status: 401 }
      );
    }

    const site = await prisma.site.findUnique({
      where: {
        id: siteId,
        userId: userId,
      },
    });

    if (!site) {
      return NextResponse.json(
        {
          type: 'notFound',
          message: 'Site não encontrado ou não pertence ao usuário',
          status: 404,
        },
        { status: 404 }
      );
    }

    await prisma.site.delete({
      where: {
        id: siteId,
      },
    });

    return NextResponse.json(
      {
        message: 'Site excluído com sucesso',
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao excluir o site:', error);
    return NextResponse.json(
      {
        type: 'serverError',
        message: 'Erro ao excluir o site',
        status: 500,
      },
      { status: 500 }
    );
  }
}

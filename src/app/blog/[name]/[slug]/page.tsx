import RenderArticle from '@/components/RenderArticle';
import prisma from '@/utils/db';
import moment from 'moment';
import 'moment/locale/pt-br';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { JSONContent } from 'novel';

async function getData(partialSlug: string) {
  const data = await prisma.post.findFirst({
    where: {
      slug: {
        startsWith: partialSlug,
      },
    },
    select: {
      title: true,
      content: true,
      thumbnail: true,
      slug: true,
      description: true,
      createdAt: true,
      User: {
        select: {
          name: true,
          profileImage: true,
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function Page({
  params,
}: {
  params: { name: string; slug: string };
}) {
  moment.locale('pt-br');
  const post = await getData(params.slug);

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">{post.title}</h1>
      <p className="text-gray-600 mb-4 text-center">
        {moment(post.createdAt).format('D [de] MMMM [de] YYYY, HH:mm')}
      </p>
      <p className='text-center'>{post.description}</p>

      <Image
        src={post?.thumbnail || '/default.png'}
        alt={post.title}
        width={600}
        height={200}
        className="w-full h-auto mb-6 rounded-xl border dark:border-gray-900"
      />

      <RenderArticle
        json={JSON.parse(post?.content as string) as JSONContent}
      />
    </article>
  );
}

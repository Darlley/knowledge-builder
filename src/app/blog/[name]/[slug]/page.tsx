import RenderArticle from '@/components/RenderArticle';
import SocialShareButtons from '@/components/SocialShareButtons';
import prisma from '@/utils/db';
import { User } from '@nextui-org/react';
import moment from 'moment';
import 'moment/locale/pt-br';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JSONContent } from 'novel';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';

import 'moment/locale/pt-br';

import ThemeToggle from '@/components/ThemeToggle';
import LogotipoIcon from '@/icons/LogotipoIcon';

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
      Site: {
        select: {
          name: true,
          subdirectory: true,
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
    <>
      <nav className="grid grid-cols-3 my-10">
        <div className="col-span-1"></div>
        <div className="flex items-center gap-x-2 justify-center">
          <LogotipoIcon width="50" height="39" />
          <h1 className="text-3xl font-semibold tracking-tight">{post.Site?.name}</h1>
        </div>
        <div className="col-span-1 flex w-full justify-end">
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <Link
            href={`/blog/${params.name}`}
            className="text-gray-500 hover:text-gray-700"
          >
            {post.Site?.name || 'Blog'}
          </Link>
          <h1 className="text-4xl font-bold my-4">{post.title}</h1>
          <div className="text-gray-600">
            <User
              name={post.User?.name || 'Autor desconhecido'}
              description={
                '5 min de leitura · ' +
                new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(post.createdAt))
              }
              avatarProps={{
                src: post.User?.profileImage || '/default.png',
              }}
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-4">
                <SocialShareButtons
                  url={`/blog/${post.Site?.subdirectory}/${post.slug}`}
                  title={post.title}
                  description={post.description}
                />
              </div>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  0 comentários
                </span>
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  0 curtidas
                </span>
              </div>
            </div>
          </div>
        </header>

        {post.thumbnail && (
          <div className="flex justify-center mb-8">
            <Image
              src={post.thumbnail}
              alt={post.title}
              width={1200}
              height={600}
              className="rounded-lg"
            />
          </div>
        )}

        <RenderArticle
          json={JSON.parse(post?.content as string) as JSONContent}
        />

        <section className="mt-12 pt-8 border-t dark:border-gray-900">
          <h2 className="text-2xl font-bold mb-4">Comentários (3)</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <User
                name="Carlos Oliveira (Há 12 horas)"
                description="Ótimo artigo! Muito informativo e bem escrito."
                avatarProps={{
                  className: 'rounded-full',
                }}
              />
            </div>
            <div className="flex items-start space-x-4">
              <User
                name="Carlos Oliveira (Há 12 horas)"
                description="Adorei o conteúdo! Você poderia fazer um artigo sobre [tema
                  relacionado]?"
                avatarProps={{
                  className: 'rounded-full',
                }}
              />
            </div>
            <div className="flex items-start space-x-4">
              <User
                name="Carlos Oliveira (Há 12 horas)"
                description="Excelente explicação! Isso esclareceu muitas dúvidas que eu
                  tinha."
                avatarProps={{
                  className: 'rounded-full',
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

import RenderArticle from '@/components/RenderArticle';
import prisma from '@/utils/db';
import { User } from '@nextui-org/react';
import moment from 'moment';
import 'moment/locale/pt-br';
import Image from 'next/image';
import Link from 'next/link';
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <Link
          href={`/blog/${params.name}`}
          className="text-gray-500 hover:text-gray-700"
        >
          {post.Site?.name || 'Blog'}
        </Link>
        <h1 className="text-4xl font-bold mt-4 mb-2">{post.title}</h1>
        <div className="text-gray-600">
          <User
            name={post.User?.name || 'Autor desconhecido'}
            description={
              '5 min de leitura · ' +
              moment(post.createdAt).format('D [de] MMMM [de] YYYY')
            }
            avatarProps={{
              src: post.User?.profileImage || '/default.png',
            }}
          />
          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-4">
              <button className="text-gray-600 hover:text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>
              <button className="text-gray-600 hover:text-blue-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </button>
              <button className="text-gray-600 hover:text-pink-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </button>
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

      <section className="mt-12 pt-8 border-t border-gray-900">
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
  );
}

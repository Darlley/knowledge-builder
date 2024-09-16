import prisma from '@/utils/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/pt-br';

import ThemeToggle from '@/components/ThemeToggle';
import LogotipoIcon from '@/icons/LogotipoIcon';
import { Card, CardBody, CardFooter, CardHeader, Image as NextUIImage, User } from '@nextui-org/react';
import Link from 'next/link';

async function getPosts(name: string) {
  const data = await prisma.site.findUnique({
    where: {
      subdirectory: name,
    },
    include: {
      posts: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function BlogIndexPage({
  params,
}: {
  params: { name: string };
}) {
  const data = await getPosts(params.name);
  moment.locale('pt-br');

  return (
    <>
      <nav className="grid grid-cols-3 my-10">
        <div className="col-span-1"></div>
        <div className="flex items-center gap-x-2 justify-center">
          <LogotipoIcon width="50" height="39" />
          <h1 className="text-3xl font-semibold tracking-tight">{data.name}</h1>
        </div>
        <div className="col-span-1 flex w-full justify-end">
          <ThemeToggle />
        </div>
      </nav>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.posts.map((post) => (
            <Link key={post.id} href={`/blog/${params.name}/${post.slug}`}>
              <Card
                classNames={{
                  base: 'dark:bg-gray-950 border dark:border-gray-900 h-[400px]',
                  footer: 'flex w-full justify-between items-center',
                }}
              >
                <CardHeader>
                  <NextUIImage
                    src={post.thumbnail || '/default.png'}
                    fallbackSrc="/default.png"
                    alt={post.title}
                    className="object-cover h-full"
                  />
                </CardHeader>
                <CardBody>
                  <div className="mt-auto">
                    <h3 className="text-lg font-bold truncate">
                      {post.title}
                    </h3>
                    <p className="line-clamp-1">{post.description}</p>
                  </div>
                </CardBody>
                <CardFooter>
                  <div>
                    <User
                      name={data.name}
                      avatarProps={{
                        src: data.imageUrl || '/default.png',
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-xs">
                      {moment(post.createdAt).format('DD [de] MMMM [de] YYYY')}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

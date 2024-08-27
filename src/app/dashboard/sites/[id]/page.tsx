'use client';

import PostsStore from '@/stores/PostStore';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Button, Spinner } from '@nextui-org/react';
import { Book, Cog, File, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id: siteId } = params;

  const [isRequestAction, setIsRequestAction] = useState(true);
  const { posts, getPosts } = PostsStore();
  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  useEffect(() => {
    getPosts(user?.id!, siteId)
      .then(() => {
        setIsRequestAction(false);
      })
      .catch(() => {
        setIsRequestAction(false);
      });
  }, [user, siteId]);

  return (
    <>
      <div className="flex w-full justify-between items-center gap-4">
        <h1 className="text-xl">LeadsZapp</h1>

        <div className="gap-2 flex items-center">
          <Button
            endContent={<Book className="stroke-[1.5] size-5" />}
            as={Link}
            href="#"
          >
            Visualizar
          </Button>
          <Button
            endContent={<Cog className="stroke-[1.5] size-5" />}
            as={Link}
            href="#"
          >
            Configurar
          </Button>
          <Button
            endContent={<Plus />}
            color="primary"
            as={Link}
            href="#"
          >
            Criar artigo
          </Button>
        </div>
      </div>

      {isRequestAction ? (
        <Spinner label="Buscando seus posts..." />
      ) : !posts?.length ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed dark:border-gray-900 p-8 text-center animate-in fade-in-50">
          <div className="p-2 flex items-center justify-center rounded-full size-20 bg-primary-100 dark:bg-none">
            <File className="size-10 stroke-primary-500" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-primary-900">
            Você não criou nenhuma postagem para o seu site
          </h2>
          <p className="mt-2 mb-8 text-center text-sm leading-tight text-default-400 max-w-sm">
            You currently dont have any sites. Please create some so that you
            can see them right here!
          </p>

          <Button
            endContent={<Plus />}
            color="primary"
            as={Link}
            href="#"
          >
            Criar post
          </Button>
        </div>
      ) : (
        <pre>{JSON.stringify(posts, null, 2)}</pre>
      )}
    </>
  );
}

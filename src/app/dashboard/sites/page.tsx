'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Spinner,
  User,
} from '@nextui-org/react';
import { File, Plus } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/pt-br';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import SiteStore from '@/stores/SiteStore';

export default function page() {
  const { sites, getSites, isLoading } = SiteStore();
  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  useEffect(() => {
    if (user?.id) {
      getSites(user.id);
    }
  }, [user, getSites]);

  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 p-4 lg:p-6">
      <div className="flex w-full justify-end">
        <Button
          endContent={<Plus />}
          color="primary"
          as={Link}
          href="/dashboard/sites/new"
        >
          Criar site
        </Button>
      </div>

      {isLoading ? (
        <Spinner label="Buscando seus sites..." />
      ) : sites?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Link key={site?.id} href={`/dashboard/sites/${site?.id}`}>
              <Card
                classNames={{
                  base: 'dark:bg-gray-950 border dark:border-gray-900 h-[400px]',
                  footer: 'flex w-full justify-between items-center',
                }}
              >
                <CardHeader>
                  <Image
                    src={site.imageUrl || '/default.png'}
                    fallbackSrc="/default.png"
                    alt="NextUI Image with fallback"
                    className='object-cover h-full'
                  />
                </CardHeader>
                <CardBody>
                  <div className='mt-auto'>
                    <h3 className="text-lg font-bold truncate">{site.name}</h3>
                    <p className="line-clamp-1">{site.description}</p>
                  </div>
                </CardBody>
                <CardFooter>
                  <div>
                    <User
                      name={user?.given_name}
                      avatarProps={{
                        src: user?.picture!,
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-xs">
                      {moment(site.createdAt).format('DD [de] MMMM [de] YYYY')}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed dark:border-gray-900 p-8 text-center animate-in fade-in-50">
          <div className="p-2 flex items-center justify-center rounded-full size-20 bg-primary-100 dark:bg-none">
            <File className="size-10 stroke-primary-500" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-primary-900">
            Você não criou nenhum site ainda
          </h2>
          <p className="mt-2 mb-8 text-center text-sm leading-tight text-default-400 max-w-sm">
            You currently dont have any sites. Please create some so that you
            can see them right here!
          </p>

          <Button
            endContent={<Plus />}
            color="primary"
            as={Link}
            href="/dashboard/sites/new"
          >
            Criar site
          </Button>
        </div>
      )}
    </div>
  );
}

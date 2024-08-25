'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Button, Image, Spinner } from '@nextui-org/react';
import clsx from 'clsx';
import { File, Plus } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/pt-br';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import SiteStore from '@/stores/SiteStore';

export default function page() {
  const [isRequestAction, setIsRequestAction] = useState(true);
  const { sites, getSites } = SiteStore();
  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  useEffect(() => {
    getSites()
      .then(() => {
        setIsRequestAction(false);
      })
      .catch(() => {
        setIsRequestAction(false);
      });
  }, []);

  return (
    <>
      <div className="flex w-full justify-end ">
        <Button
          endContent={<Plus />}
          color="primary"
          as={Link}
          href="/dashboard/sites/new"
        >
          Criar site
        </Button>
      </div>

      {isRequestAction ? (
        <Spinner label="Buscando seus sites..." />
      ) : !sites?.length ? (
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
      ) : (
        sites.map((site) => (
          <div className="max-w-xs w-full group/card" key={site?.id}>
            <div
              className={clsx(
                'cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl  max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4 bg-cover bg-[url(https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80)]'
              )}
              // style={{
              //   backgroundImage: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80',
              // }}
            >
              <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
              <div className="flex flex-row items-center space-x-4 z-10">
                <Image
                  height="100"
                  width="100"
                  alt="Avatar"
                  src={user?.picture ?? ''}
                  className="h-10 w-10 rounded-full border-2 object-cover"
                />
                <div className="flex flex-col">
                  <p className="font-normal text-base text-gray-50 relative z-10">
                    {user?.given_name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {moment(site?.createdAt).format('DD [de] MMMM [de] YYYY')}
                  </p>
                </div>
              </div>
              <div className="text content">
                <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
                  {site?.name}
                </h1>
                <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
                  {site?.description}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
}

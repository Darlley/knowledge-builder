'use client';

import { Button } from '@nextui-org/react';
import { File, Plus } from 'lucide-react';
import Link from 'next/link';

export default function page() {
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

      <div className="flex flex-col items-center justify-center rounded-md border border-dashed dark:border-gray-900 p-8 text-center animate-in fade-in-50">
        <div className="p-2 flex items-center justify-center rounded-full size-20 bg-primary-100 dark:bg-none">
          <File className="size-10 stroke-primary-500" />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-primary-900">
          Você não criou nenhum site ainda
        </h2>
        <p className="mt-2 mb-8 text-center text-sm leading-tight text-default-400 max-w-sm">
          You currently dont have any sites. Please create some so that you can
          see them right here!
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
    </>
  );
}

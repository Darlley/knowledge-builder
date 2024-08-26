import { Button } from '@nextui-org/react'
import { Book, Cog, Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <>
    <div className="flex w-full justify-end gap-4">
      <Button
        endContent={<Book className='stroke-[1.5] size-5' />}
        as={Link}
        href="/dashboard/sites/new"
      >
        Visualizar
      </Button>
      <Button
        endContent={<Cog className='stroke-[1.5] size-5' />}
        as={Link}
        href="/dashboard/sites/new"
      >
        Configurar
      </Button>
      <Button
        endContent={<Plus />}
        color="primary"
        as={Link}
        href="/dashboard/sites/new"
      >
        Criar artigo
      </Button>
    </div>
    </>
  )
}

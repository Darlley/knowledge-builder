"use client"

import { Button } from '@nextui-org/react'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div className='flex w-full justify-end'>
      <Button endContent={<Plus />} color='primary' as={Link} href='/dashboard/sites/new'>Criar site</Button>
    </div>
  )
}

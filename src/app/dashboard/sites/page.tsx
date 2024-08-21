"use client"

import { Button } from '@nextui-org/react'
import { Plus } from 'lucide-react'
import React from 'react'

export default function page() {
  return (
    <div className='flex w-full justify-end'>
      <Button endContent={<Plus />} color='primary'>Criar site</Button>
    </div>
  )
}

'use client';

import { Button } from '@nextui-org/react';
import { useParams } from 'next/navigation';

export default function Component() {
  const params = useParams();
  const tenant = params.subdomain;
  console.log(tenant);

  return <Button>{tenant}</Button>;
}

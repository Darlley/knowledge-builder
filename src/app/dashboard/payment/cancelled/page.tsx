'use client';

import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import Link from 'next/link';

export default function PagamentoCancelado() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Card
        classNames={{
          base: 'p-6 max-w-md w-full',
        }}
      >
        <CardHeader>
          <h1 className="text-3xl font-bold text-danger">
            Pagamento Cancelado
          </h1>
        </CardHeader>
        <CardBody>
          <p className="text-lg mb-4 text-muted-foreground">
            Parece que você desistiu do processo de pagamento. Não se preocupe,
            isso acontece!
          </p>
          <p className="text-md mb-4 text-muted-foreground">
            Se você mudou de ideia ou teve algum problema, estamos aqui para
            ajudar.
          </p>
          <Button
            as={Link}
            href="/dashboard"
            color="primary"
            className="w-full"
          >
            Voltar para o Dashboard
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

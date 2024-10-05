'use client';

import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import Link from 'next/link';

export default function PagamentoCancelado() {
  return (
    <div className="flex flex-col items-center justify-center h-full dark:bg-gray-950">
      <Card
        classNames={{
          base: 'p-6 max-w-md w-full',
        }}
      >
        <CardHeader>
          <h1 className="text-2xl font-bold text-warning">
            Não perca essa oportunidade!
          </h1>
        </CardHeader>
        <CardBody>
          <p className="mb-4 text-muted-foreground">
            Você está a um passo de transformar sua empresa com um blog profissional. Não deixe a concorrência te ultrapassar!
          </p>
          <p className="mb-4 text-muted-foreground">
            Lembre-se: investir em conteúdo hoje é garantir clientes amanhã. Milhares de empresas já estão colhendo os frutos. E você?
          </p>
          <p className="mb-4 font-semibold text-warning">
            Oferta por tempo limitado: Assine agora e ganhe 30 dias grátis!
          </p>
          <Button
            as={Link}
            href="/dashboard/payment"
            color="success"
            className="w-full mb-2"
          >
            Aproveitar esta oferta exclusiva
          </Button>
          <Button
            as={Link}
            href="/dashboard"
            variant="flat"
            className="w-full"
          >
            Voltar para o Dashboard
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

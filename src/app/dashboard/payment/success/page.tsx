'use client';

import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import Confetti from 'react-confetti';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PagamentoSucesso() {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window;
    setWindowDimensions({ width, height });

    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-background">
      <Confetti
        width={windowDimensions.width}
        height={windowDimensions.height}
        recycle={false}
        numberOfPieces={200}
        colors={['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']}
      />
      <Card className="p-6 max-w-md w-full">
        <CardHeader>
          <h1 className="text-xl font-bold text-success">
            Pagamento Concluído com Sucesso!
          </h1>
        </CardHeader>
        <CardBody>
          <p className="mb-4 text-muted-foreground">
            Parabéns! Seu pagamento foi processado e sua assinatura está ativa.
          </p>
          <p className="text-sm mb-4 text-muted-foreground">
            Aproveite todos os recursos premium da nossa plataforma.
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

'use client';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@nextui-org/react';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

export default function PagamentoSucesso() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

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
    <>
      <Confetti
        width={windowDimensions.width}
        height={windowDimensions.height}
        recycle={false}
        numberOfPieces={200}
        colors={[
          '#26ccff',
          '#a25afd',
          '#ff5e7e',
          '#88ff5a',
          '#fcff42',
          '#ffa62d',
          '#ff36ff',
        ]}
      />
      <div className="flex justify-center dark:bg-gray-950 w-full max-w-full overflow-y-auto max-h-full p-4 sm:p-6">
        <div className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[40%] h-max">
          <Card
            classNames={{
              base: 'p-4 sm:p-6',
            }}
          >
            <CardHeader>
              <h1 className="text-xl sm:text-2xl font-bold text-success text-center">
                Parabéns! Você Acaba de Dar um Passo Gigante na Sua Jornada
                Digital!
              </h1>
            </CardHeader>
            <CardBody className="space-y-4 sm:space-y-4">
              <div className="flex items-center p-3 sm:p-4 bg-yellow-100 dark:bg-yellow-950 border border-yellow-300 dark:border-yellow-900 rounded-lg">
                <span className="text-xl sm:text-2xl mr-2">💡</span>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">
                  Sua decisão de investir em um criador de blogs profissional
                  para sua empresa não foi apenas inteligente - foi
                  revolucionária.
                </p>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Seja você um empreendedor visionário, uma empresa em
                crescimento, um influenciador apaixonado ou um estudioso
                dedicado, você acaba de desbloquear um mundo de possibilidades
                com nossa plataforma de criação de blogs!
              </p>
              <p className="text-sm sm:text-base text-muted-foreground">
                Com as ferramentas que agora estão à sua disposição, você está
                pronto para:
              </p>
              <ul className="flex flex-col gap-2">
                <li className="flex items-center gap-3">
                  <div className="bg-success rounded-md size-6 flex items-center justify-center">
                    <Check className="stroke-white size-4" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base">
                      Compartilhar suas ideias inovadoras e insights valiosos
                    </span>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-success rounded-md size-6 flex items-center justify-center">
                    <Check className="stroke-white size-4" />
                  </div>
                  <span className="text-sm sm:text-base">
                    Construir sua autoridade online e expandir sua influência
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-success rounded-md size-6 flex items-center justify-center">
                    <Check className="stroke-white size-4" />
                  </div>
                  <span className="text-sm sm:text-base">
                    Conectar-se com seu público de forma autêntica e impactante
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-success rounded-md size-6 flex items-center justify-center">
                    <Check className="stroke-white size-4" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base">
                      Transformar seu conhecimento em conteúdo envolvente e
                      acionável
                    </span>
                  </div>
                </li>
              </ul>
              <div className="flex items-center p-3 sm:p-4 bg-yellow-100 dark:bg-yellow-950 border border-yellow-300 dark:border-yellow-900 rounded-lg">
                <span className="text-xl sm:text-2xl mr-2">💡</span>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">
                  Cada post é uma oportunidade de inspirar, educar e
                  transformar. Sua voz única agora tem um palco digital para
                  brilhar!
                </p>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Comece agora mesmo a criar conteúdo que vai cativar mentes,
                impulsionar negócios e deixar sua marca no mundo digital.
              </p>
            </CardBody>
            <CardFooter>
              <Button
                as={Link}
                href="/dashboard"
                color="success"
                className="w-full text-sm sm:text-base"
                size="lg"
              >
                Iniciar Minha Jornada de Sucesso
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}

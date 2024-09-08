import { Button, Card, CardFooter, CardHeader, Input, Textarea } from '@nextui-org/react';
import { ChevronLeft, Cog, Plus, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id: siteId } = params;

  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 p-4 lg:p-6">
      <div className="flex flex-col md:flex-row w-full justify-between md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            as={Link}
            href={`/dashboard/sites/${siteId}`}
          >
            <ChevronLeft className="stroke-1 size-4" />
          </Button>
          <h1 className="text-xl">Configurações</h1>
        </div>

        <div className="gap-2 flex items-center">
          <Button endContent={<Cog className="stroke-[1.5] size-5" />}>
            <span>Configurar</span>
          </Button>
          <Button endContent={<Plus />} color="primary">
            <span>Criar artigo</span>
          </Button>
        </div>
      </div>
      <div className='w-full flex gap-4 flex-col md:flex-row'>
        <div className="w-full flex">
          <form className="w-full max-w-4xl mx-auto flex flex-col gap-6">
            <div>
              <Input
                type="text"
                autoFocus
                label="Nome do site"
                className="text-default-400"
                variant="bordered"
                isRequired
              />
            </div>

            <div>
              <Input
                type="text"
                label="Subdiretorio"
                variant="bordered"
                className="text-default-400"
                isRequired
              />
            </div>

            <div>
              <Textarea
                type="text"
                label="Descrição"
                variant="bordered"
                className="text-default-400"
                isRequired
              />
            </div>

            <Button
              type="submit"
              color="primary"
              endContent={<PlusCircle className="stroke-[1.5]" />}
            >
              Atualizar
            </Button>
          </form>
        </div>
        <div className='w-full'>
          <Card>
            <CardHeader>Deseja excluir?</CardHeader>
            <CardFooter><Button color='danger'>Excluir</Button></CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import UploadImageForm from '@/components/UploadImageForm';
import { siteSchema, SiteSchema } from '@/utils/zodSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Textarea,
} from '@nextui-org/react';
import { ChevronLeft, Cog, Plus, Save } from 'lucide-react';
import Link from 'next/link';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id: siteId } = params;

  // Adicione o hook useForm e a função onSubmit
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SiteSchema>({
    resolver: zodResolver(siteSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<SiteSchema> = async (data) => {
    // Implemente a lógica de atualização do site aqui
    console.log(data);
    toast.success('Site atualizado com sucesso');
  };

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
      </div>

      <div className="w-full flex gap-4 flex-col md:flex-row">
        <Card className="w-6/12 p-4 shadow-none dark:bg-gray-950 border dark:border-gray-900">
          <CardHeader>
            <h3 className="text-lg font-semibold">Editar informações</h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Nome do site"
                    isRequired
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                  />
                )}
              />
              <Controller
                name="subdirectory"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Subdiretório"
                    isRequired
                    isInvalid={!!errors.subdirectory}
                    errorMessage={errors.subdirectory?.message}
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label="Descrição"
                    isRequired
                    isInvalid={!!errors.description}
                    errorMessage={errors.description?.message}
                  />
                )}
              />
            </form>
          </CardBody>
          <CardFooter>
            <Button
              color="primary"
              type="submit"
              isLoading={isSubmitting}
              endContent={<Save className="stroke-[1.5] size-5" />}
            >
              Salvar alterações
            </Button>
          </CardFooter>
        </Card>

        <div className="w-6/12">
          <UploadImageForm onImageUpload={console.log} />
        </div>
      </div>

      <div className="w-full flex gap-4 flex-col">
        <Card
          classNames={{
            base: 'bg-danger-100 dark:bg-danger-500/10 border border-danger p-4',
          }}
        >
          <CardHeader>
            <h3 className="text-lg font-semibold">Ação perigosa</h3>
          </CardHeader>
          <CardBody>
            <p>
              Você deseja mesmo deletar o site? Esta ação é irreversível e todos
              os dados serão perdidos.
            </p>
          </CardBody>
          <CardFooter>
            <Button color="danger">Sim, Desejo Excluir o Site</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

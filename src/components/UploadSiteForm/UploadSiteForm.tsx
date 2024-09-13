'use client';

import SiteStore from '@/stores/SiteStore';
import { siteSchema, SiteSchema } from '@/utils/zodSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Textarea,
} from '@nextui-org/react';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { UploadSiteFormProps } from './UploadSiteForm.types';

export default function UploadSiteForm({ siteId }: UploadSiteFormProps) {
  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  const { getSite, updateSite } = SiteStore();
  const [isLoading, setIsLoading] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SiteSchema>({
    resolver: zodResolver(siteSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const site = await getSite(siteId);
        if (site) {
          reset({
            name: site?.name || '',
            subdirectory: site.subdirectory || '',
            description: site.description || '',
          });
        } else {
          throw new Error('Site não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar informações do site:', error);
        toast.error('Erro ao carregar informações do site');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSite();
  }, [siteId, getSite, reset]);

  const onSubmit: SubmitHandler<SiteSchema> = async (data) => {
    try {
      await updateSite(siteId, user?.id!, data);
      toast.success('Site atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar o site');
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card className="w-full p-4 shadow-none dark:bg-gray-950 border dark:border-gray-900">
      <CardHeader>
        <h3 className="text-lg font-semibold">Editar informações</h3>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Nome do site"
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Controller
            name="subdirectory"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Subdiretório"
                isInvalid={!!errors.subdirectory}
                errorMessage={errors.subdirectory?.message}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                label="Descrição"
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
          onClick={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
          endContent={<Save className="stroke-[1.5] size-5" />}
        >
          Salvar alterações
        </Button>
      </CardFooter>
    </Card>
  );
}

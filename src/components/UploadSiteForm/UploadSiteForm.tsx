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
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { UploadSiteFormProps } from './UploadSiteForm.types';

export default function UploadSiteForm({ site }: UploadSiteFormProps) {
  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  const { updateSite } = SiteStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SiteSchema>({
    resolver: zodResolver(siteSchema),
    mode: 'onBlur',
    defaultValues: {
      name: site.name || '',
      subdirectory: site.subdirectory || '',
      description: site.description || '',
    },
  });

  const onSubmit: SubmitHandler<SiteSchema> = async (data) => {
    try {
      if (!user?.id) throw new Error('Usuário não autenticado');
      await updateSite(site.id, user.id, data);
      toast.success('Site atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar o site:', error);
      toast.error('Erro ao atualizar o site');
    }
  };

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

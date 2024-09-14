'use client';

import SiteStore from '@/stores/SiteStore';
import { UploadDropzone } from '@/utils/uploadthing';
import { siteSchema, SiteSchema } from '@/utils/zodSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Input,
  Textarea,
} from '@nextui-org/react';
import { Save, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { UploadSiteFormProps } from './UploadSiteForm.types';

export default function UploadSiteForm({ site }: UploadSiteFormProps) {
  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  const { updateSite } = SiteStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SiteSchema>({
    resolver: zodResolver(siteSchema),
    mode: 'onBlur',
    defaultValues: {
      name: site.name || '',
      subdirectory: site.subdirectory || '',
      description: site.description || '',
      imageUrl: site.imageUrl || '',
    },
  });

  const onSubmit: SubmitHandler<SiteSchema> = async (data) => {
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }
    setIsLoading(true);
    try {
      await updateSite(site.id, user.id, data);
      toast.success('Site atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar o site:', error);
      toast.error('Erro ao atualizar o site');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full p-4 shadow-none dark:bg-gray-950 border dark:border-gray-900">
      <CardHeader>
        <h3 className="text-lg font-semibold">Editar informações do site</h3>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
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
          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="url"
                label="URL externa da imagem"
                placeholder="https://exemplo.com/imagem.jpg"
                isInvalid={!!errors.imageUrl}
                errorMessage={errors.imageUrl?.message}
              />
            )}
          />
          <div>
            {watch('imageUrl') ? (
              <div className="relative w-full max-h-[200px]">
                <Image
                  src={watch('imageUrl')}
                  alt="Imagem do site"
                  className="w-full h-[200px] object-cover rounded-lg"
                />
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => setValue('imageUrl', '')}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setValue('imageUrl', res[0].url);
                  toast.success('Imagem enviada com sucesso');
                }}
                onUploadError={() => {
                  toast.error('Erro ao enviar a imagem');
                }}
                appearance={{
                  button: 'bg-primary text-white',
                  container:
                    'border-2 border-dashed border-gray-300 dark:border-gray-700',
                  label: 'text-sm text-gray-500 dark:text-gray-400',
                }}
              />
            )}
          </div>
        </form>
      </CardBody>
      <CardFooter>
        <Button
          color="primary"
          onClick={handleSubmit(onSubmit)}
          isLoading={isLoading}
          endContent={<Save className="stroke-[1.5] size-5" />}
        >
          Salvar alterações
        </Button>
      </CardFooter>
    </Card>
  );
}

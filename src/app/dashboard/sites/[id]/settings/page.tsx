'use client';

import SiteStore from '@/stores/SiteStore';
import { UploadDropzone } from '@/utils/uploadthing';
import { siteSchema, SiteSchema } from '@/utils/zodSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import {
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
  useDisclosure,
} from '@nextui-org/react';
import { ChevronLeft, Save, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function SitePage({ params }: { params: { id: string } }) {
  const { id: siteId } = params;
  const { getUser } = useKindeBrowserClient();
  const user = getUser();
  const router = useRouter();

  const { getSite, updateSite, deleteSite } = SiteStore();
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SiteSchema>({
    resolver: zodResolver(siteSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const fetchedSite = await getSite(siteId);
        if (fetchedSite) {
          reset({
            name: fetchedSite.name || '',
            subdirectory: fetchedSite.subdirectory || '',
            description: fetchedSite.description || '',
            imageUrl: fetchedSite.imageUrl || '',
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
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }
    setIsLoading(true);
    try {
      await updateSite(siteId, user.id, data);
      toast.success('Site atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar o site:', error);
      toast.error('Erro ao atualizar o site');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }
    setIsLoading(true);
    try {
      await deleteSite(siteId, user.id);
      toast.success('Site excluído com sucesso');
      router.push('/dashboard/sites');
    } catch (error) {
      console.error('Erro ao excluir o site:', error);
      toast.error('Erro ao excluir o site');
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 lg:gap-6 p-4 lg:p-6">
        <div className="flex w-full justify-center items-center h-full">
          <Spinner content="Carregando..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 p-4 lg:p-6">
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
        <h1 className="text-xl">Editar informações do site</h1>
      </div>
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
            <div className="relative w-max max-h-[200px]">
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
      <div className="flex justify-between mt-6">
        <Button
          color="primary"
          onClick={handleSubmit(onSubmit)}
          isLoading={isLoading}
          endContent={<Save className="stroke-[1.5] size-5" />}
        >
          Salvar alterações
        </Button>
        <Button
          color="danger"
          variant="light"
          onClick={onOpen}
          endContent={<Trash2 className="stroke-[1.5] size-5" />}
        >
          Excluir site
        </Button>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Confirmar exclusão
          </ModalHeader>
          <ModalBody>
            <p>
              Tem certeza que deseja excluir este site? Esta ação não pode ser
              desfeita.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button color="danger" onPress={handleDelete} isLoading={isLoading}>
              Excluir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

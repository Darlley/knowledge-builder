'use client';

import SiteStore from '@/stores/SiteStore';
import { siteSchema, SiteSchema } from '@/utils/zodSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Button, Input, Textarea } from '@nextui-org/react';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function page() {
  const router = useRouter();
  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  const { createSite } = SiteStore()

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting, isLoading },
  } = useForm<SiteSchema>({
    resolver: zodResolver(siteSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<SiteSchema> = async (data) => {
    if (!user) {
      router.push('/api/auth/login');
      return;
    }

    try {
      await createSite(user?.id, data);
      toast.success('Site criado com sucesso 🎉');
      router.push('/dashboard/sites');
    } catch (error: any) {
      console.error('Erro ao criar site:', error); // Para depuração

      if (error.type === 'validationError') {
        if (Array.isArray(error.errors)) {
          error.errors.forEach((err: { field: string; message: string }) => {
            setError(err.field as keyof SiteSchema, {
              type: 'manual',
              message: err.message
            });
          });
        } else if (typeof error.error === 'object') {
          Object.entries(error.error).forEach(([field, message]) => {
            setError(field as keyof SiteSchema, {
              type: 'manual',
              message: message as string
            });
          });
        } else {
          // Se não conseguirmos extrair erros específicos, definimos um erro genérico
          setError('root', {
            type: 'manual',
            message: 'Ocorreu um erro de validação. Por favor, verifique os campos.'
          });
        }
        toast.error('Por favor, corrija os erros no formulário.');
      } else {
        toast.error(error.message || 'Houve um erro ao criar o site. Por favor, tente novamente.');
      }
    }
  };

  return (
    <div className="flex flex-1 lg:gap-6 max-w-xl w-full mx-auto flex-col gap-8 items-center justify-center mt-20 border dark:border-gray-900 p-8 rounded-xl shadow-xl">
      <div className="w-full">
        <h2 className="text-xl font-semibold">Criar site</h2>
        <p className="text-sm text-default-600">
          Preencha as informações do seu novo site e clique no botão para
          concluir.
        </p>
      </div>

      <div className="w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-6"
        >
          <div>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{
                required: 'Campo obrigatório.',
              }}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  type="text"
                  autoFocus
                  label="Nome do site"
                  className="text-default-400"
                  variant="bordered"
                  isRequired
                  value={value}
                  onChange={onChange}
                  isInvalid={!!errors[name]}
                  errorMessage={errors[name]?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="subdirectory"
              control={control}
              defaultValue=""
              rules={{
                required: 'Campo obrigatório.',
              }}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  type="text"
                  label="Subdiretório"
                  variant="bordered"
                  className="text-default-400"
                  isRequired
                  value={value}
                  onChange={(e) => onChange(e.target.value.toLowerCase())}
                  isInvalid={!!errors[name]}
                  errorMessage={errors[name]?.message}
                  description="Use apenas letras minúsculas, sem espaços ou caracteres especiais."
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{
                required: 'Campo obrigatório.',
              }}
              render={({ field: { onChange, value, name } }) => (
                <Textarea
                  type="text"
                  label="Descrição"
                  variant="bordered"
                  className="text-default-400"
                  isRequired
                  value={value}
                  onChange={onChange}
                  isInvalid={!!errors[name]}
                  errorMessage={errors[name]?.message}
                />
              )}
            />
          </div>

          <Button
            type="submit"
            color="primary"
            endContent={<PlusCircle className="stroke-[1.5]" />}
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Criar
          </Button>
        </form>
      </div>
    </div>
  );
}

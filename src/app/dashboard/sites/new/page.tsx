'use client';

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

  const {
    control,
    handleSubmit,
    watch,
    reset,
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
      const response = await fetch('/api/site/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Se a resposta for bem-sucedida, redirecione o usuário
        toast.success("Site criado com sucesso 🎉")
        router.push('/dashboard/sites');
      } else {
        // Lida com erros retornados pela API
        const result = await response.json();
        console.error('Erro ao criar o site:', result.errors || result.error);
        toast.error("Houve algum erro...")
        // Exibir mensagem de erro ao usuário
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto flex flex-col gap-8 items-center justify-center mt-20 border dark:border-gray-900 p-8 rounded-xl shadow-xl">
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
                  label="Subdiretorio"
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

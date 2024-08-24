'use client';

import { Button, Input, Textarea } from '@nextui-org/react';
import { PlusCircle } from 'lucide-react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

interface IFormInput {
  name: string;
  subdirectory: string;
  description: string;
}

export default function page() {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    defaultValues: {
      name: '',
      subdirectory: '',
      description: '',
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
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
              render={({ field }) => (
                <Input
                  type="text"
                  autoFocus
                  label="Nome do site"
                  className="text-default-400"
                  variant="bordered"
                  {...field}
                  isRequired
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
              render={({ field }) => (
                <Input
                  type="text"
                  autoFocus
                  label="Subdiretorio"
                  variant="bordered"
                  className="text-default-400"
                  {...field}
                  isRequired
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
              render={({ field }) => (
                <Textarea
                  type="text"
                  autoFocus
                  label="Descrição"
                  variant="bordered"
                  className="text-default-400"
                  {...field}
                  isRequired
                />
              )}
            />
          </div>

          <Button
            type="submit"
            color="primary"
            endContent={<PlusCircle className="stroke-[1.5]" />}
          >
            Criar
          </Button>
        </form>
      </div>
    </div>
  );
}

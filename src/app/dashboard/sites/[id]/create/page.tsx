'use client';

import NovelEditor from '@/components/editor/NovelEditor';
import PostsStore from '@/stores/PostStore';
import { UploadDropzone } from '@/utils/uploadthing';
import { postSchema, PostSchema } from '@/utils/zodSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import {
  Avatar,
  AvatarGroup,
  Button,
  Image,
  Input,
  Radio,
  RadioGroup,
  Textarea,
  User,
} from '@nextui-org/react';
import clsx from 'clsx';
import { Check, ChevronRight, Dot, Eye, House, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JSONContent } from 'novel';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const EDITOR_INITIAL_VALUE: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Comece a escrever aqui o seu artigo 🥳',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Para mais comando digite /',
        },
      ],
    },
  ],
};

export default function ArticleCleatePage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id: siteId } = params;
  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  const router = useRouter();

  const { createPost } = PostsStore();

  const [imageUrl, setImageUrl] = useState<null | string>(null);
  const [value, setValue] = useState<undefined | JSONContent>(
    EDITOR_INITIAL_VALUE
  );

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isLoading },
  } = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<PostSchema> = async (data) => {
    await createPost(user?.id!, siteId, data)
      .then(() => {
        toast.success('Site criado com sucesso 🎉');
        router.push('/dashboard/sites');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Houve algum erro...');
      });
  };

  return (
    <form className="overflow-hidden grid grid-cols-12 w-full h-full flex-grow flex-col md:flex-row md:justify-between">
      <div className="relative col-span-8 flex flex-col h-full max-h-full overflow-y-auto">
        <nav aria-label="Breadcrumb" className="p-4">
          <ol className="flex items-center gap-1 text-sm text-default-400">
            <li>
              <Link
                href="/dashboard"
                className="block transition hover:text-default-300"
              >
                <span className="sr-only"> Home </span>
                <House className="size-4 stroke-1" />
              </Link>
            </li>
            <li className="rtl:rotate-180">
              <ChevronRight className="size-3 stroke-1" />
            </li>
            <li>
              <Link
                href="sites"
                className="block transition hover:text-default-300"
              >
                Sites
              </Link>
            </li>
            <li className="rtl:rotate-180">
              <ChevronRight className="size-3 stroke-1" />
            </li>
            <li>
              <Link
                href="sites"
                className="block transition hover:text-default-300"
              >
                LeadsZapp
              </Link>
            </li>
            <li className="rtl:rotate-180">
              <ChevronRight className="size-3 stroke-1" />
            </li>
            <li>
              <span className="block transition text-default-500">
                Criando artigo
              </span>
            </li>
          </ol>
        </nav>
        <div className="w-full flex flex-col gap-1 border-b dark:border-gray-900 p-4">
          <Controller
            name="title"
            control={control}
            rules={{
              required: 'Campo obrigatório.',
            }}
            render={({ field: { onChange, value, name } }) => (
              <Input
                type="text"
                variant="bordered"
                label="Titulo do artigo"
                labelPlacement="outside"
                isRequired={true}
                placeholder="Escreva um titulo"
                value={value}
                onChange={onChange}
                isInvalid={!!errors[name]}
                errorMessage={errors[name]?.message}
              />
            )}
          />
          <div className="flex items-center text-sm text-default-400">
            <span>Última atualização 30 Ago, 2024</span>
            <Dot className="fill-primary stroke-primary" />
            <span>Por Darlley Brito</span>
          </div>
        </div>
        <div className="flex-grow p-6 max-h-full overflow-y-auto text-sm">
          <NovelEditor initialValue={value} onChange={setValue} />
        </div>
      </div>
      <div className="col-span-4 flex flex-col gap-4 lg:gap-6 p-4 border-l dark:border-gray-900 h-full max-h-full overflow-y-auto">
        <div className="flex justify-between w-full gap-2">
          <div>
            <User
              name="Publicado por"
              description="Darlley Brito"
              avatarProps={{
                src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button startContent={<Eye />}>Visualizar</Button>
            <Button type="submit" startContent={<Check />} color="primary">
              Salvar
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 ">
          <div className="flex flex-col gap-2">
            <h3>Atualizado por</h3>
            <AvatarGroup isBordered>
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
            </AvatarGroup>
          </div>
        </div>
        <h1>Configurações do artigo</h1>
        <div className="flex gap-2">
          <RadioGroup
            label="Público alvo"
            description="Selecione para quem o artigo ficará visivel."
            orientation="horizontal"
            classNames={{
              base: 'w-full',
              wrapper: 'grid w-full grid-cols-2 gap-2',
            }}
          >
            <Radio
              value="free"
              classNames={{
                base: clsx(
                  'flex m-0 bg-gray-900 hover:border-primary-300 items-center justify-between',
                  'flex-row-reverse cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent',
                  'data-[selected=true]:border-primary col-span-1 !max-w-full'
                ),
              }}
            >
              Clientes
            </Radio>
            <Radio
              value="interno"
              classNames={{
                base: clsx(
                  'flex m-0 bg-gray-900 hover:border-primary-300 items-center justify-between',
                  'flex-row-reverse cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent',
                  'data-[selected=true]:border-primary col-span-1 !max-w-full'
                ),
              }}
            >
              Interno
            </Radio>
          </RadioGroup>
        </div>
        <Controller
          name="slug"
          control={control}
          rules={{
            required: 'Campo obrigatório.',
          }}
          render={({ field: { onChange, value, name } }) => (
            <Input
              type="text"
              variant="bordered"
              label="Slug"
              labelPlacement="outside"
              isRequired={true}
              placeholder="Slug do artigo"
              description="exemplo: 'artigo-sobre-financas'"
              endContent={
                <Button size="sm" isIconOnly color="primary" radius="full">
                  <RotateCcw className="size-4 stroke-[1.5]" />
                </Button>
              }
              value={value}
              onChange={onChange}
              isInvalid={!!errors[name]}
              errorMessage={errors[name]?.message}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <Textarea
              label="Resumo"
              labelPlacement="outside"
              classNames={{
                inputWrapper: 'dark:bg-gray-900',
              }}
              rows={5}
              description="Escreve um pequeno resumo do seu artigo."
              value={value}
              onChange={onChange}
            />
          )}
        />

        <div className="flex flex-col gap-1">
          <h3>Escolha imagem de capa</h3>
          {imageUrl ? (
            <Image
              isBlurred
              className="w-full object-cover max-h-[400px]"
              src={imageUrl}
              alt="Preview da Thumbnail"
            />
          ) : (
            <UploadDropzone
              endpoint="imageUploader"
              appearance={{
                button: 'bg-primary rounded-lg text-sm',
                container:
                  'dark:border-default bg-default-100 dark:bg-gray-900 w-full cursor-pointer',
                label: 'text-primary hover:text-primary-600',
              }}
              onClientUploadComplete={(res) => {
                setImageUrl(res[0].url);
                toast.success('Imagem enviada 🎉');
              }}
              onUploadError={() => {
                toast.error('something went wrong...');
              }}
            />
          )}
        </div>
      </div>
    </form>
  );
}

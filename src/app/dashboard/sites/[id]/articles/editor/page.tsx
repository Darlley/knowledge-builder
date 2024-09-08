'use client';

import NovelEditor from '@/components/editor/NovelEditor';
import PostsStore from '@/stores/PostStore';
import { PostType } from '@/types/PostType';
import { UploadDropzone } from '@/utils/uploadthing';
import { postSchema, PostSchema } from '@/utils/zodSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import {
  Avatar,
  AvatarGroup,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Radio,
  RadioGroup,
  Switch,
  Textarea,
  Tooltip,
  User,
} from '@nextui-org/react';
import clsx from 'clsx';
import {
  ChevronDownIcon,
  ChevronRight,
  Dot,
  Eye,
  EyeOff,
  House,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { JSONContent } from 'novel';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import slugify from 'slugify';
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
          text: 'Para mais comandos digite /',
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

  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams.get('articleId');

  const [isRequestAction, setIsRequestAction] = useState(false);

  const { getPost, createPost } = PostsStore();
  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  const [content, setContent] = useState<undefined | JSONContent>(
    EDITOR_INITIAL_VALUE
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      content: '',
      thumbnail: '',
      audience: 'CLIENTS',
      status: 'ARCHIVED',
    },
  });

  const onSubmit: SubmitHandler<PostSchema> = async (data) => {
    setIsRequestAction(true);

    data.content = JSON.stringify(content);

    await createPost(siteId, {
      ...data,
      userId: user?.id,
    })
      .then(() => {
        toast.success('Artigo criado com sucesso 🎉');
        router.push(`/dashboard/sites/${siteId}/articles`);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Houve algum erro...');
        setIsRequestAction(false);
      });
  };

  const onErrors = async (errors: any) => {
    console.log('errors', errors);
  };

  useEffect(() => {
    if (articleId) {
      getPost({
        postId: articleId!,
        siteId: siteId!,
        userId: user?.id!,
      }).then((response: PostType) => {
        console.log("useEffect", response)
        reset(response);
      });
    }
  }, [articleId, user, siteId]);

  return (
    <div className="overflow-hidden flex w-full h-full flex-grow flex-col md:flex-row md:justify-between">
      <form
        className="flex h-full w-full"
        onSubmit={handleSubmit(onSubmit, onErrors)}
      >
        <div className="relative flex-1 flex flex-col h-full max-h-full overflow-y-auto ">
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
                  href="/dashboard/sites"
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
                  href={`/dashboard/sites/${siteId}`}
                  className="block transition hover:text-default-300"
                >
                  LeadsZapp
                </Link>
              </li>
              <li className="rtl:rotate-180">
                <ChevronRight className="size-3 stroke-1" />
              </li>
              <li>
                <Link
                  href={`/dashboard/sites/${siteId}/articles`}
                  className="block transition hover:text-default-300"
                >
                  Publicações
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
                  onValueChange={onChange}
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
            <NovelEditor initialValue={content} onChange={setContent} />
          </div>
        </div>
        <div className="w-[380px] flex flex-col gap-4 lg:gap-6 p-4 border-l dark:border-gray-900 h-full max-h-full overflow-y-auto">
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex gap-2">
              <ButtonGroup variant="flat">
                <Button
                  type="submit"
                  color="primary"
                  isLoading={isRequestAction}
                  isDisabled={isRequestAction}
                >
                  Salvar
                </Button>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button isIconOnly color="primary">
                      <ChevronDownIcon />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Merge options"
                    selectionMode="single"
                    className="max-w-[300px]"
                  >
                    <DropdownItem key="merge">Ver preview</DropdownItem>
                    <DropdownItem key="squash">Ver no site</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </ButtonGroup>
            </div>
            <Controller
              name="status"
              control={control}
              rules={{
                required: 'Campo obrigatório.',
              }}
              render={({ field: { onChange, value, name } }) => (
                <Switch
                  color="primary"
                  isSelected={value === 'PUBLISHED'}
                  onValueChange={(changeValue) =>
                    onChange(changeValue ? 'PUBLISHED' : 'ARCHIVED')
                  }
                  startContent={<Eye />}
                  endContent={<EyeOff />}
                >
                  {value == 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                </Switch>
              )}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3>Responsáveis</h3>
              <div className="flex justify-between gap-2">
                <User
                  name="Darlley Brito"
                  description="darlleybrito@gmail.com"
                  avatarProps={{
                    isBordered: true,
                    src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
                  }}
                />
                <AvatarGroup isBordered max={2}>
                  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                </AvatarGroup>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t dark:border-gray-900">
            <div className="pt-4">
              <h1>Configurações do artigo</h1>
            </div>

            <div className="flex gap-2">
              <Controller
                name="audience"
                control={control}
                rules={{
                  required: 'Campo obrigatório.',
                }}
                render={({ field: { onChange, value, name } }) => (
                  <RadioGroup
                    label="Público alvo"
                    description="Selecione para quem o artigo ficará visivel."
                    orientation="horizontal"
                    classNames={{
                      base: 'w-full',
                      wrapper: 'flex w-full flex-wrap gap-2',
                    }}
                    defaultValue="CLIENTS"
                    value={value}
                    onValueChange={onChange}
                    isInvalid={!!errors[name]}
                    errorMessage={errors[name]?.message}
                  >
                    <Radio
                      value="CLIENTS"
                      classNames={{
                        base: clsx(
                          'flex m-0 dark:bg-gray-900 dark:hover:border-primary-300 items-center justify-between',
                          'flex-row-reverse cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent',
                          'data-[selected=true]:border-primary col-span-1 !max-w-full'
                        ),
                      }}
                    >
                      Clientes
                    </Radio>
                    <Radio
                      value="EMPLOYEES"
                      classNames={{
                        base: clsx(
                          'flex m-0 dark:bg-gray-900 dark:hover:border-primary-300 items-center justify-between',
                          'flex-row-reverse cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent',
                          'data-[selected=true]:border-primary col-span-1 !max-w-full'
                        ),
                      }}
                    >
                      Interno
                    </Radio>
                  </RadioGroup>
                )}
              />
            </div>

            <div>
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
                    isRequired={true}
                    labelPlacement="outside"
                    placeholder="Slug do artigo"
                    description="exemplo: 'artigo-sobre-financas'"
                    endContent={
                      <Tooltip
                        content="Gerar slug automaticamente"
                        placement="left"
                        color="primary"
                      >
                        <Button
                          size="sm"
                          isIconOnly
                          color="primary"
                          radius="full"
                          onClick={() => {
                            const slug = slugify(watch('title') ?? '', {
                              lower: true, // Converte para minúsculas
                              remove: /[*+~.()'"!:@,]/g, // Remove caracteres especiais
                            });

                            setValue('slug', slug);

                            toast.info('Slug gerado ✨');
                          }}
                        >
                          <Sparkles className="size-4 stroke-[1.5]" />
                        </Button>
                      </Tooltip>
                    }
                    value={value}
                    onValueChange={onChange}
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
            </div>

            <div className="flex flex-col gap-1">
              <h3>Escolha imagem de capa</h3>
              {watch('thumbnail') ? (
                <Image
                  isBlurred
                  className="w-full object-cover max-h-[400px]"
                  src={watch('thumbnail') ?? ''}
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
                    setValue('thumbnail', res[0].url);
                    toast.success('Imagem enviada 🎉');
                  }}
                  onUploadError={() => {
                    toast.error('something went wrong...');
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

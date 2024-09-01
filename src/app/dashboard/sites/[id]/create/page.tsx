'use client';

import { UploadDropzone } from '@/utils/uploadthing';
import {
  Avatar,
  AvatarGroup,
  Button,
  Image,
  Input,
  Textarea,
  User,
} from '@nextui-org/react';
import { Check, ChevronRight, Dot, Eye, House, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ArticleCleatePage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id: siteId } = params;

  const [imageUrl, setImageUrl] = useState<null | string>(null);

  return (
    <div className="grid grid-cols-12 w-full h-full flex-grow flex-col md:flex-row md:justify-between gap-4">
      <div className="col-span-8 flex flex-col gap-4 lg:gap-6 p-4">
        <nav aria-label="Breadcrumb">
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
              <span className="block transition text-default-500">
                Criando artigo
              </span>
            </li>
          </ol>
        </nav>
        <div className="w-full flex flex-col gap-1">
          <Input
            type="text"
            variant="bordered"
            label="Titulo"
            labelPlacement="outside"
            isRequired={true}
            placeholder="Escreva um titulo"
          />
          <div className="flex items-center text-sm text-default-400">
            <span>Última atualização 30 Ago, 2024</span>
            <Dot className="fill-primary stroke-primary" />
            <span>Por Darlley Brito</span>
          </div>
        </div>
        <div>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni, unde
          iusto. Fuga neque impedit facilis veritatis quos excepturi nisi
          voluptatibus sapiente eligendi cupiditate magni deserunt ipsum
          consectetur, exercitationem facere tempore? Qui excepturi quibusdam ad
          sapiente asperiores maxime fuga harum natus sequi explicabo provident
          minus facere atque ratione laborum labore voluptatem, et repellat
          eius, exercitationem obcaecati nostrum! Nobis repellendus ea quasi?
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni, unde
          iusto. Fuga neque impedit facilis veritatis quos excepturi nisi
          voluptatibus sapiente eligendi cupiditate magni deserunt ipsum
          consectetur, exercitationem facere tempore? Qui excepturi quibusdam ad
          sapiente asperiores maxime fuga harum natus sequi explicabo provident
          minus facere atque ratione laborum labore voluptatem, et repellat
          eius, exercitationem obcaecati nostrum! Nobis repellendus ea quasi?
        </div>
      </div>

      <div className="col-span-4 flex flex-col gap-4 lg:gap-6 p-4 border-l border-gray-900 h-full">
        <div className="flex gap-2">
          <Button startContent={<Eye />}>Visualizar</Button>
          <Button startContent={<Check />} color="primary">
            Salvar
          </Button>
        </div>

        <div className="flex flex-col gap-4 ">
          <div className="flex flex-col gap-2">
            <h3>Publicado por</h3>
            <div>
              <User
                name="Jane Doe"
                description="Product Designer"
                avatarProps={{
                  src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3>Atualizado por</h3>
            <AvatarGroup isBordered>
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
            </AvatarGroup>
          </div>
        </div>

        <h1>Configurações do artigo</h1>

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
        />

        <Textarea
          label="Resumo / Tweet"
          labelPlacement="outside"
          classNames={{
            inputWrapper: 'bg-gray-900',
          }}
          description="Escreve um pequeno resumo do seu artigo."
        />

        <div className="flex flex-col gap-2">
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
                container: 'border-default bg-gray-900 w-full cursor-pointer',
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
    </div>
  );
}

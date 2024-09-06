'use client';

import PostsStore from '@/stores/PostStore';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import {
  Button,
  ButtonGroup,
  Image,
  Spinner,
  SwitchProps,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useSwitch,
  VisuallyHidden,
} from '@nextui-org/react';
import { Cog, Eye, EyeOff, File, Link2, Pen, Plus, Trash } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';

const columns = [
  {
    key: 'thumbnail',
    label: 'Capa',
  },
  {
    key: 'title',
    label: 'Titulo',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'views',
    label: 'Visualizações',
  },
  {
    key: 'created-at',
    label: 'Criado em',
  },
  {
    key: 'actions',
    label: 'AÇÕES',
  },
];

export default function page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id: siteId } = params;

  const [isRequestAction, setIsRequestAction] = useState(true);
  const { posts, getPosts } = PostsStore();
  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  useEffect(() => {
    getPosts(user?.id ?? '', siteId)
      .then(() => {
        setIsRequestAction(false);
      })
      .catch(() => {
        setIsRequestAction(false);
      });
  }, [user, siteId]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 p-4 lg:p-6">
      <div className="flex w-full justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl">LeadsZapp</h1>
          <ThemeSwitch />
        </div>

        <div className="gap-2 flex items-center">
          <Button
            endContent={<Eye className="stroke-[1.5] size-5" />}
            as={Link}
            href="#"
          >
            Ir para o site
          </Button>
          <Button
            endContent={<Cog className="stroke-[1.5] size-5" />}
            as={Link}
            href="#"
          >
            Configurar
          </Button>
          <Button
            endContent={<Plus />}
            color="primary"
            as={Link}
            href={`/dashboard/sites/${siteId}/create`}
          >
            Criar artigo
          </Button>
        </div>
      </div>

      {isClient && (
        <Table
          aria-label="Controlled table example with dynamic content"
          fullWidth
          selectionMode="multiple"
          disableAnimation
          // selectedKeys={selectedRows}
          // onSelectionChange={setSelectedRows}
          topContentPlacement="outside"
          bottomContentPlacement="outside"
          // bottomContent={
          //   <div className="flex items-center justify-end px-2 w-full">
          //     <span
          //       className={clsx(
          //         'text-small text-default-400',
          //         selectedRows === 'all' ? 'font-bold' : ''
          //       )}
          //     >
          //       {selectedRows === 'all'
          //         ? `Todos foram selecionados`
          //         : `${selectedRows.size} de ${contacts.length} selecionados`}
          //     </span>
          //   </div>
          // }
          classNames={{
            base: 'flex-grow h-full text-default-600 overflow-hidden ',
            wrapper:
              'flex-grow h-full shadow-none border dark:border-gray-900 rounded-xl overflow-auto dark:bg-gray-950 text-sm',
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key} className="pl-4">
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={posts}
            isLoading={isRequestAction}
            loadingContent={<Spinner label="Buscando seus posts..." />}
            emptyContent={
              <div className="flex flex-col items-center justify-center rounded-md border border-dashed dark:border-gray-900 p-8 text-center animate-in fade-in-50">
                <div className="p-2 flex items-center justify-center rounded-full size-20 bg-primary-100 dark:bg-none">
                  <File className="size-10 stroke-primary-500" />
                </div>
                <h2 className="mt-6 text-xl font-semibold text-primary-900">
                  Você não criou nenhuma postagem para o seu site
                </h2>
                <p className="mt-2 mb-8 text-center text-sm leading-tight text-default-400 max-w-sm">
                  You currently dont have any sites. Please create some so that
                  you can see them right here!
                </p>

                <Button
                  endContent={<Plus />}
                  color="primary"
                  as={Link}
                  href={`/dashboard/sites/${siteId}/create`}
                >
                  Criar post
                </Button>
              </div>
            }
          >
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="w-max">
                    <Image
                      width={60}
                      height={60}
                      alt="Thumbnail"
                      src={item?.thumbnail}
                      fallbackSrc={'/default.png'}
                      radius="sm"
                      className='object-cover'
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <h4>{item?.title}</h4>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    {item?.status == 'PUBLISHED' ? (
                      <p className="text-green-500 font-bold">Publicado</p>
                    ) : (
                      <p className="text-default-300 font-bold">Rascunho</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <p>{item?.views}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <p>{moment(item.createdAt).format('DD/MM/YY')}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 w-full justify-start">
                    <ButtonGroup>
                      <Tooltip content={`Ver artigo`} color="primary">
                        <Button size="sm" isIconOnly>
                          <Link2 className="size-4 stroke-1" />
                        </Button>
                      </Tooltip>

                      <Tooltip content={`Editar artigo`} color="primary">
                        <Button size="sm" isIconOnly>
                          <Pen className="size-4 stroke-1" />
                        </Button>
                      </Tooltip>

                      <Tooltip content={`Excluir artigo`} color="primary">
                        <Button size="sm" isIconOnly>
                          <Trash className="size-4 stroke-1" />
                        </Button>
                      </Tooltip>
                    </ButtonGroup>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* <pre>{JSON.stringify(posts, null, 2)}</pre> */}
    </div>
  );
}

function ThemeSwitch(props: SwitchProps) {
  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch(props);

  return (
    <Tooltip
      color="primary"
      size="sm"
      content={isSelected ? 'Arquivar site' : 'Publicar site'}
      placement="right"
    >
      <div className="flex flex-col gap-2 ">
        <Component {...getBaseProps()}>
          <VisuallyHidden>
            <input {...getInputProps()} />
          </VisuallyHidden>
          <div
            {...getWrapperProps()}
            className={slots.wrapper({
              class: [
                'w-8 h-8',
                'flex items-center justify-center',
                'rounded-lg bg-default-100 hover:bg-default-200 ',
                isSelected && 'shadow-xl shadow-primary',
              ],
            })}
          >
            {isSelected ? (
              <Eye className="size-4 stroke-1" />
            ) : (
              <EyeOff className="size-4 stroke-1" />
            )}
          </div>
        </Component>
      </div>
    </Tooltip>
  );
}

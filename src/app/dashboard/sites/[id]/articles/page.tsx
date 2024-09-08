'use client';

import PostsStore from '@/stores/PostStore';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import {
  Button,
  ButtonGroup,
  Chip,
  Image,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react';
import {
  CheckCircle,
  ChevronLeft,
  Cog,
  File,
  Link2,
  Pen,
  Plus,
  Trash,
} from 'lucide-react';
import 'moment/locale/pt-br';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
    key: 'audience',
    label: 'Publico',
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

  const [isOpen, setIsOpen] = useState(false);
  const [isRequestAction, setIsRequestAction] = useState(true);
  const [isDeleteAction, setIsDeleteAction] = useState(false);

  const { posts, getPosts, deletePost } = PostsStore();
  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  async function fetchPosts(userId: string, siteId: string) {
    await getPosts(userId, siteId)
      .then(() => {
        setIsRequestAction(false);
      })
      .catch(() => {
        setIsRequestAction(false);
      });
  }

  useEffect(() => {
    fetchPosts(user?.id!, siteId);
  }, [user, siteId]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 p-4 lg:p-6">
      <div className="flex flex-col md:flex-row w-full justify-between md:items-center gap-4">
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
          <h1 className="text-xl">LeadsZapp</h1>
        </div>

        <div className="gap-2 flex items-center">
          <Button
            endContent={<Cog className="stroke-[1.5] size-5" />}
            as={Link}
            href="#"
          >
            <span>Configurar</span>
          </Button>
          <Button
            endContent={<Plus />}
            color="primary"
            as={Link}
            href={`/dashboard/sites/${siteId}/articles/editor`}
          >
            <span>Criar artigo</span>
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
          }}
          removeWrapper
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
            loadingContent={<Spinner label="Buscando suas publicações..." />}
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
                  href={`/dashboard/sites/${siteId}/articles/editor`}
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
                      className="object-cover"
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
                      <Chip
                        startContent={
                          <CheckCircle className="size-4 stroke-[1.5]" />
                        }
                        variant="faded"
                        color="success"
                        className="dark:bg-green-950 bg-success text-green-100 border-green-500"
                      >
                        Publicado
                      </Chip>
                    ) : (
                      <Chip variant="dot">Rascunho</Chip>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    {item?.audience == 'CLIENTS' ? (
                      <Chip variant="dot" color="primary">
                        Clientes
                      </Chip>
                    ) : (
                      <Chip variant="dot">Colaborador</Chip>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    {new Intl.DateTimeFormat('pt-BR', {
                      dateStyle: 'medium',
                    }).format(new Date(item.createdAt))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 w-full justify-start">
                    <ButtonGroup fullWidth>
                      <Tooltip content={`Ver artigo`} color="primary">
                        <Button size="sm" isIconOnly>
                          <Link2 className="size-4 stroke-1" />
                        </Button>
                      </Tooltip>

                      <Tooltip content={`Editar artigo`} color="warning">
                        <Button
                          size="sm"
                          isIconOnly
                          as={Link}
                          href={`/dashboard/sites/${siteId}/articles/editor?articleId=${item.id}`}
                        >
                          <Pen className="size-4 stroke-1" />
                        </Button>
                      </Tooltip>

                      <Tooltip
                        content={
                          <div className="flex flex-col gap-2 p-4">
                            <div className="text-sm font-bold">
                              Tem certeza que deseja excluir?
                            </div>
                            <div className="flex">
                              <Button
                                color="danger"
                                size="sm"
                                isLoading={isDeleteAction}
                                isDisabled={isDeleteAction}
                                onClick={async () =>
                                  new Promise((resolve, reject) => {
                                    deletePost(siteId, item.id)
                                      .then(() => {
                                        fetchPosts(user?.id!, siteId);
                                        setIsDeleteAction(false);
                                        resolve();
                                      })
                                      .catch(() => {
                                        setIsDeleteAction(false);
                                        reject();
                                      });
                                  })
                                }
                              >
                                Sim, Excluir.
                              </Button>
                            </div>
                          </div>
                        }
                      >
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
    </div>
  );
}

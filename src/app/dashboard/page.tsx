'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Button, Card, CardBody, CardFooter, CardHeader, Image, Spinner, User } from '@nextui-org/react';
import { File, Plus } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/pt-br';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import SiteStore from '@/stores/SiteStore';
import PostsStore from '@/stores/PostStore';

export default function DashboardPage() {
  const { sites, getSites, isLoading: sitesLoading } = SiteStore();
  const { recentPosts, getRecentPosts, isLoading: postsLoading } = PostsStore();
  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  useEffect(() => {
    if (user?.id) {
      getSites(user.id);
      getRecentPosts(user.id, 5);
    }
  }, [user, getSites, getRecentPosts]);

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 lg:p-6">
      {/* Seção de Sites */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Ultimos Sites Criados</h2>
        </div>

        {sitesLoading ? (
          <Spinner label="Carregando sites..." />
        ) : sites?.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sites.slice(0, 3).map((site) => (
              <Link key={site?.id} href={`/dashboard/sites/${site?.id}`}>
                <Card
                  classNames={{
                    base: 'dark:bg-gray-950 border dark:border-gray-900 h-[400px]',
                    footer: 'flex w-full justify-between items-center',
                  }}
                >
                  <CardHeader>
                    <Image
                      src={site.imageUrl || '/default.png'}
                      fallbackSrc="/default.png"
                      alt="NextUI Image with fallback"
                      className="object-cover h-full"
                    />
                  </CardHeader>
                  <CardBody>
                    <div className="mt-auto">
                      <h3 className="text-lg font-bold truncate">
                        {site.name}
                      </h3>
                      <p className="line-clamp-1">{site.description}</p>
                    </div>
                  </CardBody>
                  <CardFooter>
                    <div>
                      <User
                        name={user?.given_name}
                        avatarProps={{
                          src: user?.picture!,
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-xs">
                        {moment(site.createdAt).format(
                          'DD [de] MMMM [de] YYYY'
                        )}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center p-4">
            <p>Você ainda não criou nenhum site.</p>
          </div>
        )}
        {sites?.length > 3 && (
          <div className="mt-4 text-center">
            <Button as={Link} href="/dashboard/sites" variant="light">
              Ver todos os sites
            </Button>
          </div>
        )}
      </section>

      {/* Seção de Artigos Recentes */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Artigos Recentes</h2>
        {postsLoading ? (
          <Spinner label="Carregando artigos..." />
        ) : recentPosts?.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.slice(0, 3).map((post) => (
              <Link key={post?.id} href={`/dashboard/sites/${post?.siteId}/${post?.id}`}>
                <Card
                  classNames={{
                    base: 'dark:bg-gray-950 border dark:border-gray-900 h-[400px]',
                    footer: 'flex w-full justify-between items-center',
                  }}
                >
                  <CardHeader>
                    <Image
                      src={post?.thumbnail || '/default.png'}
                      fallbackSrc="/default.png"
                      alt="NextUI Image with fallback"
                      className="object-cover h-full"
                    />
                  </CardHeader>
                  <CardBody>
                    <div className="mt-auto">
                      <h3 className="text-lg font-bold truncate">
                        {post?.title}
                      </h3>
                      <p className="line-clamp-1">{post?.description}</p>
                    </div>
                  </CardBody>
                  <CardFooter>
                    <div>
                      <User
                        name={user?.given_name}
                        avatarProps={{
                          src: user?.picture!,
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-xs">
                        {moment(post?.createdAt).format(
                          'DD [de] MMMM [de] YYYY'
                        )}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center p-4">
            <p>Nenhum artigo publicado ainda.</p>
          </div>
        )}
      </section>
    </div>
  );
}

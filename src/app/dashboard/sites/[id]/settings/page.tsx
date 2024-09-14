'use client';

import UploadSiteForm from '@/components/UploadSiteForm/UploadSiteForm';
import SiteStore, { ISite } from '@/stores/SiteStore';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Spinner,
} from '@nextui-org/react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function SitePage({ params }: { params: { id: string } }) {
  const { id: siteId } = params;
  const [site, setSite] = useState<ISite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getSite } = SiteStore();

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const fetchedSite = await getSite(siteId);
        if (fetchedSite) {
          setSite(fetchedSite);
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
  }, [siteId, getSite]);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 lg:gap-6 p-4 lg:p-6">
        <div className="flex w-full justify-center items-center h-full">
          <Spinner content="Carregando..." />
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="flex flex-1 flex-col gap-4 lg:gap-6 p-4 lg:p-6">
        <div className="flex w-full justify-center items-center h-full">
          Site não encontrado
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl">Configurações</h1>
        </div>
      </div>

      <div className="w-full flex gap-4 flex-col md:flex-row">
        <UploadSiteForm site={site} />
      </div>

      <div className="w-full flex gap-4 flex-col">
        <Card
          classNames={{
            base: 'bg-danger-100 dark:bg-danger-500/10 border border-danger p-4',
          }}
        >
          <CardHeader>
            <h3 className="text-lg font-semibold">Ação perigosa</h3>
          </CardHeader>
          <CardBody>
            <p>
              Você deseja mesmo deletar o site? Esta ação é irreversível e todos
              os dados serão perdidos.
            </p>
          </CardBody>
          <CardFooter>
            <Button color="danger">Sim, Desejo Excluir o Site</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

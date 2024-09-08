'use client';

import {
  Button,
  SwitchProps,
  Tooltip,
  useSwitch,
  VisuallyHidden,
} from '@nextui-org/react';
import { Cog, Eye, EyeOff, Plus } from 'lucide-react';
import 'moment/locale/pt-br';
import Link from 'next/link';

export default function page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id: siteId } = params;

  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 p-4 lg:p-6">
      <div className="flex flex-col md:flex-row w-full justify-between md:items-center gap-4">
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
            <span>Ir para o site</span>
          </Button>
          <Button
            endContent={<Cog className="stroke-[1.5] size-5" />}
            as={Link}
            href="#"
          >
            <span>Configurar</span>
          </Button>
          <Button
            color="primary"
            as={Link}
            href={`/dashboard/sites/${siteId}/articles`}
          >
            <span>Publicações</span>
          </Button>
        </div>
      </div>
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
      content={isSelected ? 'Site publicado' : 'Site arquivado'}
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

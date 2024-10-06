'use client';

import ThemeToggle from '@/components/ThemeToggle';
import LogotipoIcon from '@/icons/LogotipoIcon';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from '@kinde-oss/kinde-auth-nextjs/components';
import { Button, Card, Chip, Image } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Fragment } from 'react';

const features = [
  {
    name: 'Kinde ',
    description:
      'Usamos o Kinde para uma autenticação robusta na criação e llogin e sua conta, testada por milhões de usuários.',
    icon: '🔐',
  },
  {
    name: 'Stripe',
    description:
      'Processamento de pagamentos utilizando Stripe, testado por milhões de desenvolvedores.',
    icon: '💰',
  },
  {
    name: 'Supabase',
    description: 'Uso do Postgres Supabase para armazenamento de dados.',
    icon: '🎲',
  },
  {
    name: 'Prisma',
    description: 'Gerenciamento de dados com Prisma.',
    icon: '💨',
  },
  {
    name: 'Zod',
    description: 'Validação do servidor usando Zod para garantir integridade.',
    icon: '✅',
  },
  {
    name: 'Uploadthing',
    description: 'Facilidade de upload de arquivos com Uploadthing.',
    icon: '🗂️',
  },
  {
    name: 'NextUI',
    description:
      'Estilização com Tailwindcss e NextUI para uma interface atraente e moderna.',
    icon: '🎨',
  },
  {
    name: 'Tiptap',
    description:
      'Editor de artigos utilizando o Tiptap para uma experiência rica (like Notion).',
    icon: '✍️',
  },
  {
    name: 'Zustand',
    description:
      'Uso do Zustand para comunicação eficiente entre Back-end e Front-end.',
    icon: '💿',
  },
];

import { PageHomeProps } from './PageHome.types';
export default function PageHome(props: PageHomeProps) {
  const { getUser } = useKindeBrowserClient();
  const session = getUser();
  const { theme } = useTheme();

  return (
    <main className="w-full h-full dark:bg-gray-950 p-4">
      <section className="relative flex flex-col w-full mx-auto md:flex-row md:items-center md:justify-between">
        <div className="w-full flex flex-row items-center justify-between text-sm">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div>
              <LogotipoIcon width="50" height="39" />
            </div>
            <h3 className="text-2xl">
              Knowledge<span className="text-primary">+</span>
            </h3>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {session ? (
              <Button color="danger">
                <LogoutLink>Log out</LogoutLink>
              </Button>
            ) : (
              <Fragment>
                <Button color="primary">
                  <LoginLink>Sign in</LoginLink>
                </Button>
                <Button>
                  <RegisterLink>Sign up</RegisterLink>
                </Button>
              </Fragment>
            )}
          </div>
        </div>
      </section>

      <section className="relative flex items-center justify-center mx-auto container">
        <div className="relative items-center w-full py-12 lg:py-20 mx-auto">
          <div className="text-center">
            <Chip color="primary" size="lg" variant="shadow">
              Startup de blogging SaaS definitiva
            </Chip>
            <h1 className="mt-8 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-none">
              Configure seu blog{' '}
              <span className="text-primary block">em minutos!</span>
            </h1>
            <p className="max-w-xl mx-auto mt-4 font-light text-lg text-default-500 tracking-tighter">
              Configurar seu blog é difícil e consome tempo. Nós facilitamos
              para você criar um blog em minutos
            </p>

            <div className="flex gap-2 justify-center mt-4">
              {!session && (
                <Fragment>
                  <Button>
                    <LoginLink>Sign in</LoginLink>
                  </Button>
                  <Button color="primary">Experimente grátis</Button>
                </Fragment>
              )}
            </div>
          </div>

          <div className="relative flex items-center justify-center w-full mx-auto mt-12">
            <Image
              src={
                theme == 'dark' ? '/dark-preview.jpeg' : '/light-preview.jpeg'
              }
              alt="Hero image"
              className="relative object-cover w-full border dark:border-gray-800 rounded-2xl shadow-2xl dark:shadow-primary/10 mx-auto"
            />
          </div>
        </div>
      </section>

      <section className="py-10">
        <h2 className="text-center text-lg font-semibold leading-7">
          Criado com o melhor framework do mercado
        </h2>
        <div className="mx-auto w-max mt-6">
          <Image
            src="/nextjs.png"
            className="w-full invert-0 dark:invert max-h-20 rounded-none"
          />
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container mx-auto lg:text-center">
          <Chip size="lg" color="primary">
            Blog rápido ⚡
          </Chip>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Transforme ideias em minutos!
          </h1>
          <p className="mt-6 leading-snug text-default-500">
            Você pode criar um blog incrível de forma rápida e descomplicada.
            Junte-se a milhares de usuários satisfeitos que já estão
            compartilhando suas histórias e conquistando leitores.
          </p>
        </div>

        <div className="mx-auto mt-16 container sm:mt-20 lg:mt-24">
          <div className="grid max-w-xl grid-cols-2 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-4 lg:gap-y-16">
            {features.map((feature) => (
              <Card className="p-6 border border-default hover:border-primary transition-all duration-500">
                <span className="text-3xl mb-2">{feature.icon}</span>
                <h3 className="font-semibold text-2xl">{feature.name}</h3>
                <p className="text-lg text-default-500">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

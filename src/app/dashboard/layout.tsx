'use client';

import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import DashboardItems from '@/components/DashboardItems';
import ThemeToggle from '@/components/ThemeToggle';
import LogotipoIcon from '@/icons/LogotipoIcon';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
  Button,
} from '@nextui-org/react';
import { Menu, X } from 'lucide-react';

export default function layout({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <section className="grid h-svh w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] max-h-svh overflow-hidden">
      {/* Barra lateral para desktop */}
      <div className="hidden border-r dark:border-slate-900 md:block">
        <div className="flex h-full max-h-screen flex-col shadow-xl bg-gray-100 dark:bg-gray-950">
          <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6 border-b dark:border-slate-900">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div>
                <LogotipoIcon width="50" height="39" />
              </div>
              <h3 className="text-2xl">
                Knowledge<span className="text-primary">+</span>
              </h3>
            </Link>
          </div>
          <div className="flex-1 mt-4">
            <nav className="flex flex-col gap-1 w-full px-2 font-medium">
              <DashboardItems />
            </nav>
          </div>
        </div>
      </div>

      {/* Menu lateral para mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 z-50 h-full w-7/12 bg-gray-100 dark:bg-gray-950 shadow-xl md:hidden border-r dark:border-gray-900"
          >
            <div className="flex flex-col h-full">
              <div className="flex h-14 items-center justify-between px-4 border-b dark:border-slate-900">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <LogotipoIcon width="40" height="31" />
                  <h3 className="text-xl">
                    Knowledge<span className="text-primary">+</span>
                  </h3>
                </Link>
                <Button isIconOnly variant="light" onClick={toggleMenu}>
                  <X />
                </Button>
              </div>
              <div className="flex-1 mt-4">
                <nav className="flex flex-col gap-1 w-full px-2 font-medium">
                  <DashboardItems />
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteúdo principal */}
      <div className="flex flex-col h-full max-h-full overflow-hidden w-full">
        {/* Cabeçalho */}
        <header className="flex h-14 items-center gap-4 border-b dark:border-slate-900 dark:bg-gray-950 bg-gray-100 px-4 lg:h-[60px] lg:px-6 w-full">
          <div className="flex items-center justify-between w-full gap-x-5">
            {/* Menu hambúrguer para dispositivos móveis */}
            <Button className="md:hidden" isIconOnly variant="light" onClick={toggleMenu}>
              <Menu />
            </Button>

            <div className="flex items-center gap-4 w-full justify-between">
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <User
                    as="button"
                    avatarProps={{
                      isBordered: true,
                      src: 'https://github.com/darlley.png',
                    }}
                    className="transition-transform"
                    description="@darlleybbf"
                    name="Darlley Brito"
                  />
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="User Actions"
                  variant="flat"
                  onAction={(key) => console.log(key)}
                >
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-bold">Conectado como</p>
                    <p className="font-bold">@darlleybbf</p>
                  </DropdownItem>
                  <DropdownItem key="settings">Minhas Configurações</DropdownItem>
                  <DropdownItem key="team_settings">Configurações da Equipe</DropdownItem>
                  <DropdownItem key="analytics">Análises</DropdownItem>
                  <DropdownItem key="system">Sistema</DropdownItem>
                  <DropdownItem key="configurations">Configurações</DropdownItem>
                  <DropdownItem key="help_and_feedback">
                    Ajuda e Feedback
                  </DropdownItem>
                  <DropdownItem key="logout" color="danger">
                    <LogoutLink className="w-full flex">Sair</LogoutLink>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="flex-1 dark:bg-gray-950 h-full max-h-full overflow-y-auto flex-grow">
          {children}
        </main>
      </div>
    </section>
  );
}

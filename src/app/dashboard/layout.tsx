'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

import DashboardItems from '@/components/DashboardItems';
import LogotipoIcon from '@/icons/LogotipoIcon';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@nextui-org/react';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from 'next-themes';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs';

export default function layout({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();

  return (
    <section className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r dark:border-slate-900 bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col shadow-xl bg-gray-100 dark:bg-slate-950">
          <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6 border-b dark:border-slate-900">
            <Link href="/" className="flex items-center gap-2 font-semibold ">
              <div>
                <LogotipoIcon width="50" height="39" />
              </div>

              <h3 className="text-2xl">
                Content<span className="text-primary">Flow</span>
              </h3>
            </Link>
          </div>

          <div className="flex-1 mt-4">
            <nav className="grid items-start px-2  font-medium lg:px-4">
              <DashboardItems />
            </nav>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b dark:border-slate-900 dark:bg-slate-950 bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="flex items-center justify-between w-full gap-x-5">
            <Dropdown placement="bottom-start">
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
              <DropdownMenu aria-label="User Actions" variant="flat" onAction={(key) => console.log(key)}>
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-bold">Signed in as</p>
                  <p className="font-bold">@tonyreichert</p>
                </DropdownItem>
                <DropdownItem key="settings">My Settings</DropdownItem>
                <DropdownItem key="team_settings">Team Settings</DropdownItem>
                <DropdownItem key="analytics">Analytics</DropdownItem>
                <DropdownItem key="system">System</DropdownItem>
                <DropdownItem key="configurations">Configurations</DropdownItem>
                <DropdownItem key="help_and_feedback">
                  Help & Feedback
                </DropdownItem>
                <DropdownItem key="logout" color="danger">
                  <LogoutLink className='w-full flex'>Log out</LogoutLink>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <ThemeToggle theme={theme} onChange={(switchedTheme) => setTheme(switchedTheme)} />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 dark:bg-slate-950">
          {children}
        </main>
      </div>
    </section>
  );
}

'use client';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { Computer, Moon, Sun } from 'lucide-react';

import { useTheme } from 'next-themes';
import { ThemeToggleProps } from './ThemeToggle.types';
export default function ThemeToggle(props: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered" isIconOnly>
            {theme == 'dark' && <Moon className="stroke-[1.5]" />}
            {theme == 'light' && <Sun className="stroke-[1.5]" />}
            {theme == 'system' && <Computer className="stroke-[1.5]" />}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          variant="faded"
          aria-label="Dropdown menu with icons"
          onAction={(key) =>
            key != 'all' && setTheme(key as 'dark' | 'light' | 'system')
          }
        >
          <DropdownItem
            key="dark"
            startContent={<Moon className="stroke-[1.5]" />}
          >
            Escuro
          </DropdownItem>
          <DropdownItem
            key="light"
            startContent={<Sun className="stroke-[1.5]" />}
          >
            Light
          </DropdownItem>
          <DropdownItem
            key="system"
            startContent={<Computer className="stroke-[1.5]" />}
          >
            System
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

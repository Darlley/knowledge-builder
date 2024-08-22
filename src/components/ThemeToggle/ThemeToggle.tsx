import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { Computer, Moon, Sun } from 'lucide-react';

import { ThemeToggleProps } from './ThemeToggle.types';
export default function ThemeToggle(props: ThemeToggleProps) {
  const { theme, onChange } = props;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
        >
          Tema
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        variant="faded"
        aria-label="Dropdown menu with icons"
        selectionMode='single'
        onAction={(key) =>
          key != 'all' && onChange(key as 'dark' | 'light' | 'system')
        }
        selectedKeys={theme}
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
  );
}

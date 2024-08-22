import { SetStateAction } from "react"

export interface ThemeToggleProps {
  theme: string | undefined
  onChange: (value: SetStateAction<string>) => void
}
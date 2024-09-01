import type { Config } from "tailwindcss";
import { nextui } from '@nextui-org/react';
import { withUt } from "uploadthing/tw";

export default withUt({
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  plugins: [
    nextui({
      defaultTheme: 'light',
    }),
  ],
});
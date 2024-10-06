![thumbnail](https://github.com/Darlley/knowledge-builder/blob/main/assets/landingpage.png?raw=true)

# Create a SaaS using Next.js, Kinde-Auth, Supabase, Prisma, Stripe, and Tailwind CSS.

> [!NOTE] > **Vídeo:** Create a SaaS using Next.js, Kinde-Auth, Supabase, Prisma, Stripe, and Tailwind CSS.  
> **Link do vídeo:** [https://youtu.be/\_ypZyGeJox8](https://youtu.be/_ypZyGeJox8)  
> **Minuto atual:** 9:45:58  
> **Minutos totais:** 11:16:37  
> **Autor:** Jan Marshal  
> **Link do canal:** [https://www.youtube.com/@janmarshalcoding](https://www.youtube.com/@janmarshalcoding)

## DEMO

- [Criação de conta e assinatura](https://www.loom.com/share/abb0f2a7933941fabc04e77dcbd17283?sid=77a2ecf5-e6a1-47f7-ba06-f7c95bd7477c)
- [Criação de artigo e visualização](https://www.loom.com/share/00a1da96defd434aa0f4c726710103dd?sid=d72db895-8d81-469c-b498-b91d3425dbdb)

![editor](https://github.com/Darlley/knowledge-builder/blob/main/assets/editor.png?raw=true)
![plans](https://github.com/Darlley/knowledge-builder/blob/main/assets/plans.jpeg?raw=true)
![welcome](https://github.com/Darlley/knowledge-builder/blob/main/assets/welcome.jpeg?raw=true)

## Features

- 🌐 App Router Next.js
- 🔐 Autenticação Kinde com Linkedin, Google e GitHub
- 💰 Pagamentos utilizando Stripe
- 🪝 Implementação de Webhooks Stripe
- 🎊 React Confetti para pagamentos concluidos
- 🎲 Banco de Dados Postgres Supabase
- 💨 ORM Prisma
- ✅ Validação do Servidor usando Zod
- 🗂️ Upload de Arquivos com Uploadthing
- 🎨 Estilização com Tailwindcss e NextUI
- ✍️ Editor de artigos usando o Tiptap
- 💿 Zustand para fazer a comunição Back-end/Front-end

## Setup Instructions

- Setup [Kinde](https://docs.kinde.com/developer-tools/sdks/backend/nextjs-sdk/) (Authentication)
- Setup [Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs) (Database)
- Setup [Uploadthing](https://docs.uploadthing.com/getting-started/appdir) (File Upload)
- Setup [Stripe](https://stripe.com/br) (Payments)

## Running the Application

- Run `pnpm install`
- Run `pnpm dev`

## Stripe CLI

- Download [Stripe CLI](https://docs.stripe.com/stripe-cli) (Webhook)
- Run `stripe login`
- Run `stripe --forward-to http://localhost:3000/api/webhook/stripe`

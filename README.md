# Create a SaaS using Next.js, Kinde-Auth, Supabase, Prisma, Stripe, and Tailwind CSS. 

> [!NOTE]
> **Vídeo:** Create a SaaS using Next.js, Kinde-Auth, Supabase, Prisma, Stripe, and Tailwind CSS.  
> **Link do vídeo:** [https://youtu.be/_ypZyGeJox8](https://youtu.be/_ypZyGeJox8)  
> **Minuto atual:** 9:45:58  
> **Minutos totais:** 11:16:37  
> **Autor:** Jan Marshal  
> **Link do canal:** [https://www.youtube.com/@janmarshalcoding](https://www.youtube.com/@janmarshalcoding)

## Features

- 🌐 Implementação do roteador de aplicativos Next.js
- 🔐 Autenticação Kinde com Autenticação de Fator Único
- 📧 Autenticação sem Senha
- 🔑 Autenticação OAuth com Google e GitHub
- 💰 Pagamentos utilizando Stripe
- 🪝 Implementação de Webhooks Stripe
- 💿 Banco de Dados Postgres Supabase
- 💨 ORM Prisma
- ✅ Validação do Servidor usando Zod e Conform
- 😱 Validação de Subdiretório Único
- 🗂️ Upload de Arquivos com Uploadthing
- 🎨 Estilização com Tailwindcss e Shadcn UI
- 😶‍🌫️ Deploy para Vercel

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

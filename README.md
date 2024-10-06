# Create a SaaS using Next.js, Kinde-Auth, Supabase, Prisma, Stripe, and Tailwind CSS.

> [!NOTE] > **Vídeo:** Create a SaaS using Next.js, Kinde-Auth, Supabase, Prisma, Stripe, and Tailwind CSS.  
> **Link do vídeo:** [https://youtu.be/\_ypZyGeJox8](https://youtu.be/_ypZyGeJox8)  
> **Minuto atual:** 9:45:58  
> **Minutos totais:** 11:16:37  
> **Autor:** Jan Marshal  
> **Link do canal:** [https://www.youtube.com/@janmarshalcoding](https://www.youtube.com/@janmarshalcoding)

## DEMO

- [Criação de conta e assinatura](https://www.loom.com/share/abb0f2a7933941fabc04e77dcbd17283?sid=77a2ecf5-e6a1-47f7-ba06-f7c95bd7477c)

<div style="position: relative; padding-bottom: 53.125%; height: 0;"><iframe src="https://www.loom.com/embed/abb0f2a7933941fabc04e77dcbd17283?sid=bfef5ac7-3ab6-40f5-b8f1-56ef6fe6f894" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

- [Criação de artigo e visualização](https://www.loom.com/share/00a1da96defd434aa0f4c726710103dd?sid=d72db895-8d81-469c-b498-b91d3425dbdb)

<div style="position: relative; padding-bottom: 53.125%; height: 0;"><iframe src="https://www.loom.com/embed/00a1da96defd434aa0f4c726710103dd?sid=31719a75-d664-4f9b-9f89-aba2120f9f5f" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

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

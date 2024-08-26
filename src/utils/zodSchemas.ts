import { z } from "zod";

export const siteSchema = z.object({
  name: z.string().min(1, "O campo é obrigatório.").max(35, "O campo não pode exceder 35 caracteres.."),
  subdirectory: z.string().min(1, "O campo é obrigatório.").max(40, "O campo não pode exceder 40 caracteres."),
  description: z.string().min(1, "O campo é obrigatório.").max(150, "O campo não pode exceder 150 caracteres."),
})

export type SiteSchema = z.infer<typeof siteSchema>;
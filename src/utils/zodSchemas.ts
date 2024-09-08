import { z } from "zod";

/**
 * SITE
 */

export const siteSchema = z.object({
  name: z.string().min(1, "O campo é obrigatório.").max(35, "O campo não pode exceder 35 caracteres.."),
  subdirectory: z.string().min(1, "O campo é obrigatório.").max(40, "O campo não pode exceder 40 caracteres."),
  description: z.string().min(1, "O campo é obrigatório.").max(150, "O campo não pode exceder 150 caracteres."),
})

export type SiteSchema = z.infer<typeof siteSchema>;


/**
 * POST
 */

export const postSchema = z.object({
  title: z.string().min(1, "O campo é obrigatório.").max(100, "O campo não pode exceder 100 caracteres.."),
  slug: z.string().min(1, "O campo é obrigatório.").max(200, "O campo não pode exceder 200 caracteres."),
  thumbnail: z.string(),
  description: z.string().max(200, "O campo não pode exceder 200 caracteres."),
  content: z.string(),
  status: z.enum(["PUBLISHED", "ARCHIVED"]).default("ARCHIVED"),
  audience: z.enum(["CLIENTS", "EMPLOYEES"]).default("CLIENTS"),
})

export type PostSchema = z.infer<typeof postSchema>;
import { conformZodMessage } from '@conform-to/zod';
import { z } from 'zod';
/**
 * SITE
 */

/**
 * Define o esquema de validação para um site.
 *
 * @property {string} name - Nome do site (1-35 caracteres).
 * @property {string} subdirectory - Subdiretório do site (1-40 caracteres).
 * @property {string} description - Descrição do site (1-150 caracteres).
 * @property {string} [imageUrl] - URL da imagem do site (opcional).
 */
export const siteSchema = z.object({
  name: z
    .string()
    .min(1, 'O campo é obrigatório.')
    .max(35, 'O campo não pode exceder 35 caracteres.'),
  subdirectory: z
    .string()
    .min(1, 'O campo é obrigatório.')
    .max(40, 'O campo não pode exceder 40 caracteres.'),
  description: z
    .string()
    .min(1, 'O campo é obrigatório.')
    .max(150, 'O campo não pode exceder 150 caracteres.'),
  imageUrl: z.string().optional(),
});

/**
 * Tipo inferido do esquema de site.
 */
export type SiteSchema = z.infer<typeof siteSchema>;

/**
 * Cria um esquema de validação para a criação de um site.
 *
 * @param {Object} options - Opções de configuração.
 * @param {() => Promise<boolean>} [options.isSubdirectoryUnique] - Função para verificar se o subdiretório é único.
 * @returns {z.ZodObject} Esquema de validação Zod para criação de site.
 */
export function SiteCreateSchema(options?: {
  isSubdirectoryUnique: () => Promise<boolean>;
}) {
  return z.object({
    subdirectory: z
      .string()
      .min(1, 'O campo é obrigatório.')
      .max(40, 'O campo não pode exceder 40 caracteres.')
      .regex(/^[a-z]+$/, 'O campo deve conter apenas letras minúsculas.')
      .transform((value) => value.toLocaleLowerCase())
      .pipe(
        z.string().superRefine((email, ctx) => {
          if (typeof options?.isSubdirectoryUnique !== 'function') {
            ctx.addIssue({
              code: 'custom',
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }

          return options?.isSubdirectoryUnique().then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: 'custom',
                message: 'Subdiretório já existente.',
              });
            }
          });
        })
      ),
    name: z
      .string()
      .min(1, 'O campo é obrigatório.')
      .max(35, 'O campo não pode exceder 35 caracteres.'),
    description: z
      .string()
      .min(1, 'O campo é obrigatório.')
      .max(150, 'O campo não pode exceder 150 caracteres.'),
    imageUrl: z.string().optional(),
  });
}

/**
 * POST
 */

export const postSchema = z.object({
  title: z
    .string()
    .min(1, 'O campo é obrigatório.')
    .max(100, 'O campo não pode exceder 100 caracteres..'),
  slug: z
    .string()
    .min(1, 'O campo é obrigatório.')
    .max(200, 'O campo não pode exceder 200 caracteres.'),
  thumbnail: z.string(),
  description: z.string().max(200, 'O campo não pode exceder 200 caracteres.'),
  content: z.string(),
  status: z.enum(['PUBLISHED', 'ARCHIVED']).default('ARCHIVED'),
  audience: z.enum(['CLIENTS', 'EMPLOYEES']).default('CLIENTS'),
});

export type PostSchema = z.infer<typeof postSchema>;

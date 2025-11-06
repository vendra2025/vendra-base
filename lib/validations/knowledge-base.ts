import { z } from "zod"

export const columnSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome da coluna não pode ser vazio"),
  type: z.enum(['text', 'number', 'date', 'boolean']),
  order: z.number(),
})

export const knowledgeBaseSchema = z.object({
  name: z.string().min(1, "Nome não pode ser vazio"),
  columns: z.array(columnSchema),
  data: z.array(z.record(z.any())),
})

export const searchSchema = z.object({
  query: z.string().min(1, "Query não pode ser vazia"),
  filters: z.record(z.any()).optional(),
  limit: z.number().min(1).max(100).default(10),
})

export type ColumnInput = z.infer<typeof columnSchema>
export type KnowledgeBaseInput = z.infer<typeof knowledgeBaseSchema>
export type SearchInput = z.infer<typeof searchSchema>

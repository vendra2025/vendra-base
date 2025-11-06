import { z } from "zod"

export const createClienteSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string(),
  active: z.boolean().default(true),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
})

export const updateClienteSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").optional(),
  email: z.string().email("Email inválido").optional(),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional(),
  active: z.boolean().optional(),
})

export type CreateClienteInput = z.infer<typeof createClienteSchema>
export type UpdateClienteInput = z.infer<typeof updateClienteSchema>

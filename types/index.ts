export type UserRole = 'ADMIN' | 'CLIENTE'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  active: boolean
  apiToken?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Column {
  id: string
  name: string
  type: 'text' | 'number' | 'date' | 'boolean'
  order: number
}

export interface KnowledgeBase {
  id: string
  userId: string
  name: string
  columns: Column[]
  data: Record<string, any>[]
  createdAt: Date
  updatedAt: Date
}

export interface ApiLog {
  id: string
  userId: string
  endpoint: string
  method: string
  query?: string | null
  statusCode: number
  responseTime: number
  createdAt: Date
}

export interface SearchResult {
  id: string
  data: Record<string, any>
  relevance: number
}

export interface SearchResponse {
  success: boolean
  results?: SearchResult[]
  total?: number
  query?: string
  error?: string
}

// NextAuth types extension
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: UserRole
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
  }
}

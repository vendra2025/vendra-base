import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { searchSchema } from '@/lib/validations/knowledge-base';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Validar token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Token não fornecido' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    const user = await prisma.user.findUnique({
      where: { apiToken: token, active: true },
      include: { knowledgeBases: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Token inválido' },
        { status: 401 }
      );
    }

    // 2. Parse e validar body
    const body = await request.json();
    const validation = searchSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Query é obrigatória' },
        { status: 400 }
      );
    }

    const { query, filters = {}, limit = 10 } = validation.data;

    // 3. Buscar na knowledge base
    const knowledgeBase = user.knowledgeBases[0];
    if (!knowledgeBase) {
      return NextResponse.json(
        { success: false, error: 'Base de conhecimento não encontrada' },
        { status: 404 }
      );
    }

    const data = knowledgeBase.data as any[];
    const columns = knowledgeBase.columns as any[];

    // 4. Fazer busca com relevância
    const results = data
      .map((row, index) => {
        let relevance = 0;
        let matchCount = 0;
        const queryLower = query.toLowerCase();

        columns.forEach((col: any) => {
          const value = String(row[col.name] || '').toLowerCase();

          if (value === queryLower) {
            relevance = Math.max(relevance, 1.0);
            matchCount++;
          } else if (value.startsWith(queryLower)) {
            relevance = Math.max(relevance, 0.8);
            matchCount++;
          } else if (value.includes(queryLower)) {
            relevance = Math.max(relevance, 0.5);
            matchCount++;
          }
        });

        // Boost para múltiplas colunas
        if (matchCount > 1) {
          relevance = Math.min(relevance + (matchCount - 1) * 0.2, 1.0);
        }

        return { row, relevance, index };
      })
      .filter(item => item.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit)
      .map((item) => ({
        id: `result-${item.index}`,
        data: item.row,
        relevance: item.relevance
      }));

    // 5. Log da consulta
    const responseTime = Date.now() - startTime;
    await prisma.apiLog.create({
      data: {
        userId: user.id,
        endpoint: '/api/v1/knowledge-base/search',
        method: 'POST',
        query: query,
        statusCode: 200,
        responseTime
      }
    });

    // 6. Retornar
    return NextResponse.json({
      success: true,
      results,
      total: results.length,
      query
    });

  } catch (error) {
    console.error('Erro na busca:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

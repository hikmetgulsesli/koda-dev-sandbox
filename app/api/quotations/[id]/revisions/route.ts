import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { QuotationRevision } from '@prisma/client'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/quotations/[id]/revisions - Get revision history for a quotation
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    // Check if quotation exists
    const quotation = await prisma.quotation.findUnique({
      where: { id },
      select: { id: true }
    })

    if (!quotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      )
    }

    const revisions = await prisma.quotationRevision.findMany({
      where: { quotationId: id },
      orderBy: { revisionNumber: 'desc' }
    })

    // Parse the changes JSON for each revision
    const formattedRevisions = revisions.map((revision: QuotationRevision) => ({
      ...revision,
      changes: JSON.parse(revision.changes)
    }))

    return NextResponse.json(formattedRevisions)
  } catch (error) {
    console.error('Error fetching revisions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch revisions' },
      { status: 500 }
    )
  }
}

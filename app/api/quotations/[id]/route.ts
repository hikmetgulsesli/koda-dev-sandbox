import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { QuotationStatus } from '@prisma/client'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/quotations/[id] - Get a single quotation
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        revisions: {
          orderBy: { revisionNumber: 'desc' }
        }
      }
    })

    if (!quotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(quotation)
  } catch (error) {
    console.error('Error fetching quotation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotation' },
      { status: 500 }
    )
  }
}

// PUT /api/quotations/[id] - Update a quotation (full update)
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, amount, currency, status, validUntil } = body

    // Check if quotation exists
    const existingQuotation = await prisma.quotation.findUnique({
      where: { id },
      include: { revisions: true }
    })

    if (!existingQuotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      )
    }

    const nextRevisionNumber = existingQuotation.revisions.length + 1

    // Update quotation and create revision in a transaction
    const [quotation] = await prisma.$transaction([
      prisma.quotation.update({
        where: { id },
        data: {
          title,
          description,
          amount: amount !== undefined ? parseFloat(amount) : undefined,
          currency,
          status: status as QuotationStatus | undefined,
          validUntil: validUntil ? new Date(validUntil) : null
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.quotationRevision.create({
        data: {
          quotationId: id,
          revisionNumber: nextRevisionNumber,
          changes: JSON.stringify({
            action: 'UPDATED',
            changes: {
              title: title !== undefined ? { from: existingQuotation.title, to: title } : undefined,
              description: description !== undefined ? { from: existingQuotation.description, to: description } : undefined,
              amount: amount !== undefined ? { from: existingQuotation.amount.toString(), to: amount } : undefined,
              currency: currency !== undefined ? { from: existingQuotation.currency, to: currency } : undefined,
              status: status !== undefined ? { from: existingQuotation.status, to: status } : undefined,
              validUntil: validUntil !== undefined ? { from: existingQuotation.validUntil?.toISOString(), to: validUntil } : undefined
            }
          }),
          createdBy: 'system'
        }
      })
    ])

    return NextResponse.json(quotation)
  } catch (error) {
    console.error('Error updating quotation:', error)
    return NextResponse.json(
      { error: 'Failed to update quotation' },
      { status: 500 }
    )
  }
}

// PATCH /api/quotations/[id] - Update quotation status (partial update)
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status || !['PENDING', 'WON', 'LOST'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required (PENDING, WON, or LOST)' },
        { status: 400 }
      )
    }

    // Check if quotation exists
    const existingQuotation = await prisma.quotation.findUnique({
      where: { id },
      include: { revisions: true }
    })

    if (!existingQuotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      )
    }

    const nextRevisionNumber = existingQuotation.revisions.length + 1

    // Update status and create revision in a transaction
    const [quotation] = await prisma.$transaction([
      prisma.quotation.update({
        where: { id },
        data: { status: status as QuotationStatus },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.quotationRevision.create({
        data: {
          quotationId: id,
          revisionNumber: nextRevisionNumber,
          changes: JSON.stringify({
            action: 'STATUS_CHANGE',
            from: existingQuotation.status,
            to: status
          }),
          createdBy: 'system'
        }
      })
    ])

    return NextResponse.json(quotation)
  } catch (error) {
    console.error('Error updating quotation status:', error)
    return NextResponse.json(
      { error: 'Failed to update quotation status' },
      { status: 500 }
    )
  }
}

// DELETE /api/quotations/[id] - Delete a quotation
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    // Check if quotation exists
    const existingQuotation = await prisma.quotation.findUnique({
      where: { id }
    })

    if (!existingQuotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      )
    }

    await prisma.quotation.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Quotation deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting quotation:', error)
    return NextResponse.json(
      { error: 'Failed to delete quotation' },
      { status: 500 }
    )
  }
}

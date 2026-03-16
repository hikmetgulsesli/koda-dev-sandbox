import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateQuoteNumber } from '@/utils/quoteNumber'
import { QuotationStatus } from '@prisma/client'

// GET /api/quotations - List all quotations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as QuotationStatus | null
    const customerId = searchParams.get('customerId')

    const where: { status?: QuotationStatus; customerId?: string } = {}
    if (status) where.status = status
    if (customerId) where.customerId = customerId

    const quotations = await prisma.quotation.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: { revisions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(quotations)
  } catch (error) {
    console.error('Error fetching quotations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 }
    )
  }
}

// POST /api/quotations - Create a new quotation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, title, description, amount, currency, validUntil } = body

    if (!customerId || !title || amount === undefined) {
      return NextResponse.json(
        { error: 'Customer ID, title, and amount are required' },
        { status: 400 }
      )
    }

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Get the last quotation to determine the next sequence number
    const lastQuotation = await prisma.quotation.findFirst({
      orderBy: { createdAt: 'desc' },
      where: {
        quoteNumber: {
          startsWith: `TKF-${new Date().getFullYear()}-`
        }
      }
    })

    let nextSequence = 1
    if (lastQuotation) {
      const lastSequence = parseInt(lastQuotation.quoteNumber.split('-')[2], 10)
      nextSequence = lastSequence + 1
    }

    const quoteNumber = generateQuoteNumber(nextSequence)

    // Create the quotation and update customer's lastQuoteDate in a transaction
    const [quotation] = await prisma.$transaction([
      prisma.quotation.create({
        data: {
          quoteNumber,
          customerId,
          title,
          description,
          amount: parseFloat(amount),
          currency: currency || 'USD',
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
      prisma.customer.update({
        where: { id: customerId },
        data: { lastQuoteDate: new Date() }
      })
    ])

    // Create initial revision entry
    await prisma.quotationRevision.create({
      data: {
        quotationId: quotation.id,
        revisionNumber: 1,
        changes: JSON.stringify({
          action: 'CREATED',
          title,
          amount,
          status: 'PENDING'
        }),
        createdBy: 'system'
      }
    })

    return NextResponse.json(quotation, { status: 201 })
  } catch (error) {
    console.error('Error creating quotation:', error)
    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 }
    )
  }
}

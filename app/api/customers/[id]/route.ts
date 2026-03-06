import { NextRequest, NextResponse } from 'next/server';
import { getCustomerById, getActivitiesByCustomerId } from '@/lib/store';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const customer = getCustomerById(id);
  
  if (!customer) {
    return NextResponse.json(
      { error: 'Customer not found' },
      { status: 404 }
    );
  }
  
  const activities = getActivitiesByCustomerId(id);
  
  return NextResponse.json({
    customer,
    activities,
  });
}

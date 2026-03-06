import { NextRequest, NextResponse } from 'next/server';
import { getCustomers, getCustomerById, getActivitiesByCustomerId } from '@/lib/store';

export async function GET() {
  const customers = getCustomers();
  return NextResponse.json(customers);
}

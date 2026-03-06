import { NextRequest, NextResponse } from 'next/server';
import { getActivities, createActivity } from '@/lib/store';
import { CreateActivityInput, ActivityType, ActivityOutcome } from '@/lib/types/activity';

const validActivityTypes: ActivityType[] = ['phone', 'email', 'meeting', 'video'];
const validOutcomes: ActivityOutcome[] = ['positive', 'neutral', 'negative', 'quote_requested'];

export async function GET() {
  const activities = getActivities();
  return NextResponse.json(activities);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.customer_id || typeof body.customer_id !== 'string') {
      return NextResponse.json(
        { error: 'customer_id is required and must be a string' },
        { status: 400 }
      );
    }
    
    if (!body.type || !validActivityTypes.includes(body.type)) {
      return NextResponse.json(
        { error: `type is required and must be one of: ${validActivityTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    if (!body.date || typeof body.date !== 'string') {
      return NextResponse.json(
        { error: 'date is required and must be a string' },
        { status: 400 }
      );
    }
    
    if (!body.outcome || !validOutcomes.includes(body.outcome)) {
      return NextResponse.json(
        { error: `outcome is required and must be one of: ${validOutcomes.join(', ')}` },
        { status: 400 }
      );
    }
    
    const input: CreateActivityInput = {
      customer_id: body.customer_id,
      type: body.type,
      date: body.date,
      duration: body.duration ? Number(body.duration) : undefined,
      notes: body.notes,
      outcome: body.outcome,
      next_action_date: body.next_action_date,
    };
    
    const activity = createActivity(input);
    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

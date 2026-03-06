import { NextRequest, NextResponse } from 'next/server';
import { getActivityById, updateActivity, deleteActivity } from '@/lib/store';
import { ActivityType, ActivityOutcome } from '@/lib/types/activity';

const validActivityTypes: ActivityType[] = ['phone', 'email', 'meeting', 'video'];
const validOutcomes: ActivityOutcome[] = ['positive', 'neutral', 'negative', 'quote_requested'];

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const activity = getActivityById(id);
  
  if (!activity) {
    return NextResponse.json(
      { error: 'Activity not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(activity);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate optional fields if provided
    if (body.type && !validActivityTypes.includes(body.type)) {
      return NextResponse.json(
        { error: `type must be one of: ${validActivityTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    if (body.outcome && !validOutcomes.includes(body.outcome)) {
      return NextResponse.json(
        { error: `outcome must be one of: ${validOutcomes.join(', ')}` },
        { status: 400 }
      );
    }
    
    const updated = updateActivity(id, body);
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const deleted = deleteActivity(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

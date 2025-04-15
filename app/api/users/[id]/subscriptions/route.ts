import { STATUS } from '@/lib/constants/status';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, vehicle:vehicle_id(*)')
    .eq('user_id', id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: STATUS.SERVER_ERROR });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { vehicle_id, status, plan, start_date } = body;

  const { data, error } = await supabase
    .from('subscriptions')
    .insert([
      {
        vehicle_id,
        status,
        plan,
        start_date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Failed to create subscription' }, { status: STATUS.BAD_REQUEST });
  }

  return NextResponse.json(data);
}

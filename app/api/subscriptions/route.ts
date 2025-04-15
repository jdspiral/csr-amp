import { STATUS } from '@/lib/constants/status';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('subscriptions')
      .update(body)
      .eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: STATUS.SERVER_ERROR });
    }
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: STATUS.SERVER_ERROR });
    }
  }
}


export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const { user_id, vehicle_id, plan, start_date, status } = body;
      if (!user_id || !vehicle_id || !plan || !start_date || !status) {
        return NextResponse.json({ error: 'Missing fields' }, { status: STATUS.BAD_REQUEST });
      }
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([{ user_id, vehicle_id, plan, start_date, status }]);
      if (error) {
      return NextResponse.json({ error: error.message }, { status: STATUS.SERVER_ERROR });
      }
      return NextResponse.json(data, { status: STATUS.CREATED });
    } catch (err) {
      if (err instanceof Error) {
        return NextResponse.json({ error: err.message }, { status: STATUS.SERVER_ERROR });
      }
    }
  }

  

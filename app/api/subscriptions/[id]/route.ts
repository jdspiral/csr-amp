// app/api/subscriptions/[id]/route.ts
import { STATUS } from '@/lib/constants/status';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('subscriptions')
      .update(body)
      .eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: STATUS.SERVER_ERROR });
    }
    return NextResponse.json(data, { status: STATUS.OK });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: STATUS.SERVER_ERROR });
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Creating subscription with payload:', body);

    const { user_id, vehicle_id, plan, start_date, status } = body;

    if (!user_id || !vehicle_id || !plan || !start_date || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, vehicle_id, plan, start_date, and status are required.' },
        { status: STATUS.BAD_REQUEST }
      );
    }

    if (isNaN(Date.parse(start_date))) {
      return NextResponse.json(
        { error: 'Invalid start_date format. Use a valid ISO date string.' },
        { status: STATUS.BAD_REQUEST }
      );
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{ user_id, vehicle_id, plan, start_date, status }]);

    if (error) {
      console.error('Supabase Insert Error:', error);
      return NextResponse.json({ error: error.message }, { status: STATUS.SERVER_ERROR });
    }

    console.log('Subscription created successfully:', data);
    return NextResponse.json(data, { status: STATUS.CREATED });
  } catch (err) {
    if (err instanceof Error) {
      console.error('Server Error in POST /api/subscriptions:', err);
      return NextResponse.json({ error: err.message }, { status: STATUS.SERVER_ERROR });
    }
  }
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;

    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        id,
        user_id,
        vehicle_id,
        plan,
        start_date,
        status,
        vehicle:vehicle_id (
          id,
          user_id,
          license_plate,
          make,
          model,
          year
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error:', error.message);
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: STATUS.SERVER_ERROR }
      );
    }

    return NextResponse.json(data, { status: STATUS.OK });
  } catch (err) {
    if (err instanceof Error) {
      console.error('Server error:', err.message);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: STATUS.SERVER_ERROR }
      );
    }
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: STATUS.SERVER_ERROR });
    }
    return NextResponse.json({ message: `Subscription ${id} deleted`, data }, { status: STATUS.OK });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: STATUS.SERVER_ERROR });
    }
  }
}

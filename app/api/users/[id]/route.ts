// app/api/users/[id]/route.ts
import { STATUS } from '@/lib/constants/status';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = await context;
  const { id } = await params;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'User not found' }, { status: STATUS.NOT_FOUND });
  }

  return NextResponse.json(data);
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = await context;
  const { id } = await params;

  const body = await req.json();

  const { data, error } = await supabase
    .from('users')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Failed to update user' }, { status: STATUS.BAD_REQUEST });
  }

  return NextResponse.json(data);
}

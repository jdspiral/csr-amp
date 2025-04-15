import { STATUS } from '@/lib/constants/status';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('user_id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: STATUS.SERVER_ERROR });
  }

  return NextResponse.json(data);
}
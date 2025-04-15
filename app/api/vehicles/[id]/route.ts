import { STATUS } from '@/lib/constants/status';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
    req: NextRequest,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { params }: { params: any } 
  ) {
    const { id } = params;
    const body = await req.json();
  
    const { data, error } = await supabase
      .from('vehicles')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  
    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Failed to update vehicle' }, { status: STATUS.BAD_REQUEST });
    }
  
    return NextResponse.json(data);
  }

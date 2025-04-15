import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { STATUS } from '@/lib/constants/status';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
    const searchQuery = url.searchParams.get('search') || '';

    let query = supabase.from('users').select('*').order('created_at', { ascending: false });

    if (searchQuery.trim() !== '') {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: STATUS.SERVER_ERROR });
    }

    return NextResponse.json({ data });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: STATUS.SERVER_ERROR });
    }
  }
}
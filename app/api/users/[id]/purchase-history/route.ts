import { STATUS } from '@/lib/constants/status';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  const { data, error } = await supabase
    .from('purchase_history')
    .select(`
       id,
       purchase_date,
       amount,
       description,
       vehicle:vehicle_id (
         id, make, model, license_plate
       ),
       subscription:subscription_id (
         id, plan, status
       )
    `)
    .eq('user_id', id)
    .order('purchase_date', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: STATUS.SERVER_ERROR });
  }
  return NextResponse.json(data);
}

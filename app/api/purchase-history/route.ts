import { NextRequest, NextResponse } from 'next/server';
import type { PurchaseHistory } from '@/interfaces';
import { STATUS } from '@/lib/constants/status';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, purchase_date, amount, description, plan } = body;
    
    if (!user_id || !purchase_date || !amount || !description) {
      return NextResponse.json({ error: 'Missing fields' }, { status: STATUS.BAD_REQUEST });
    }
    
    const newRecord: PurchaseHistory = {
      id: crypto.randomUUID(),
      user_id,
      purchase_date,
      amount,
      description,
      subscription: plan || '',
      vehicle: undefined,
    };

    return NextResponse.json(newRecord, { status: STATUS.CREATED });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create purchase history record' }, { status: STATUS.SERVER_ERROR });
  }
}

import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('insider_transactions')
      .select('executive, title, type, symbol, shares, transaction, date, price')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    const formattedData = data.map(item => ({
      name: item.executive,
      title: item.title,
      type: item.type,
      company: item.symbol,
      shares: item.shares,
      transactionType: item.transaction,
      date: item.date,
      price: item.price,
      value: `$${(item.price * item.shares).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`
    }));
    
    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error('Supabase query error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insider trades' },
      { status: 500 }
    );
  }
}
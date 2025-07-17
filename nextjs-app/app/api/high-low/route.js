import {NextResponse} from 'next/server';
import supabase from '../../../lib/supabase';

export async function GET() {
    try {
        // Query 1: Get last updated from stock_metadata
        const { data: metadataData, error: metadataError } = await supabase
            .from('stock_metadata')
            .select('last_updated')
            .limit(1);

        if (metadataError) {
            throw metadataError;
        }

        // Query 2: Get data from stock_movers table
        const { data: otherData, error: otherError } = await supabase
            .from('stock_movers')
            .select('ticker, price, change_amount, change_percentage, volume, category, last_updated')
            .order('last_updated', { ascending: false });

        if (otherError) {
            throw otherError;
        }

        // Format and combine the data
        const formattedMetadata = metadataData.map(item => ({
            lastUpdated: item.last_updated
        }));

        const formattedOtherData = otherData.map(item => ({
            stockName: item.ticker,
            price: item.price,
            changeAmount: item.change_amount,
            changePercent: item.change_percentage, 
            volume: item.volume,
            category: item.category,
            date: item.last_updated
        }));
        
        // Return both datasets
        return NextResponse.json({
            metadata: formattedMetadata,
            otherData: formattedOtherData
        });
    }
    catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
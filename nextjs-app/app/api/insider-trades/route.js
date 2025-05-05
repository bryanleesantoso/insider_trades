import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Using direct connection approach instead of importing from lib/db
export async function GET() {
  let connection;
  
  try {
    // Create connection directly in the route handler
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      database: process.env.DB_NAME || 'insider_trades',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });
    
    // Based on your ETL pipeline schema
    const [rows] = await connection.execute(`
      SELECT 
        executive as name,
        title,
        type, 
        symbol as company, 
        shares, 
        transaction as transactionType, 
        DATE_FORMAT(date, '%b %d, %Y') as date,
        CONCAT('$', FORMAT(price * shares, 2)) as value 
      FROM insider_transactions 
      ORDER BY date DESC 
      LIMIT 200
    `);
    
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insider trades' },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}
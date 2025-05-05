"use client";

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InsiderTransaction {
  title: string;
  name: string;
  company: string;
  shares: number;
  type: string;
  transactionType: string;
  date: string;
  value: string;
}

const InsiderTable = () => {
  const [insiderData, setInsiderData] = useState<InsiderTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsiderData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/insider-trades');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const result = await response.json();
        setInsiderData(result.data);
      } catch (err) {
        console.error('Failed to fetch insider trades:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsiderData();
  }, []);

  const tableStyles = {
    fontFamily: 'Helvetica, Arial, sans-serif', 
    width: '100%', 
    margin: '0 auto',
    borderCollapse: 'collapse' as const,
    border: '1px solid #e0e0e0'
  };

  const cellStyles = {
    fontFamily: 'Helvetica, Arial, sans-serif',
    border: '1px solid #e0e0e0',
    padding: '12px'
  };

  const headerCellStyles = {
    ...cellStyles,
    fontSize: '1rem',
    backgroundColor: '#f8f8f8',
    fontWeight: '600'
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '0 2rem',
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        fontFamily: 'Helvetica, Arial, sans-serif',
        margin: '0 0 1.5rem 0',
        textAlign: 'center',
      }}>
        Recent Insider Transactions
      </h2>
        <h3 style={{
            fontSize: '1rem',
            fontWeight: 'normal',
            fontFamily: 'Helvetica, Arial, sans-serif',
            margin: '0 0 1.5rem 0',
            textAlign: 'center',
        }}>
            This table shows the latest transactions made by insiders at Fortune 500 companies in the last two years. You can specific more dates and certain company trades using the options below.
        </h3>
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading insider trade data...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#d32f2f' }}>{error}</div>
      ) : (
        <Table style={tableStyles}>
          <TableHeader>
            <TableRow>
              <TableHead style={headerCellStyles}>Executive</TableHead>
              <TableHead style={headerCellStyles}>Title</TableHead>
              <TableHead style={headerCellStyles}>Company</TableHead>
              <TableHead style={headerCellStyles}>Shares</TableHead>
              <TableHead style={headerCellStyles}>Type</TableHead>
              <TableHead style={headerCellStyles}>Transaction</TableHead>
              <TableHead style={headerCellStyles}>Date</TableHead>
              <TableHead style={{...headerCellStyles, textAlign: 'right'}}>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {insiderData.map((transaction, index) => (
              <TableRow key={index} style={{backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9'}}>
                <TableCell style={{...cellStyles, fontWeight: '500'}}>
                  {transaction.name}
                </TableCell>
                <TableCell style={{...cellStyles, fontWeight: '500'}}>
                  {transaction.title}
                </TableCell>
                <TableCell style={cellStyles}>
                  {transaction.company}
                </TableCell>
                <TableCell style={cellStyles}>
                  {typeof transaction.shares === 'number' 
                    ? transaction.shares.toLocaleString() 
                    : transaction.shares}
                </TableCell>
                <TableCell style={cellStyles}>
                  {transaction.type}
                </TableCell>
                <TableCell style={cellStyles}>
                  <span style={{ 
                    color: transaction.transactionType === "A" ? '#2e7d32' : '#d32f2f',
                    fontWeight: '500'
                  }}>
                    {transaction.transactionType}
                  </span>
                </TableCell>
                <TableCell style={cellStyles}>
                    {new Date(transaction.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                    })}
                </TableCell>
                <TableCell style={{...cellStyles, textAlign: 'right'}}>
                  {transaction.value === '$0.00' ? 'Valued Unspecificed': transaction.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default InsiderTable;
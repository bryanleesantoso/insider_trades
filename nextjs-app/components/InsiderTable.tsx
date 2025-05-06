"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { DataTable } from "@/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

// Updated interface to match the Supabase response structure
interface InsiderTransaction {
  title: string;
  name: string;
  company: string;
  shares: number;
  type: string;
  transactionType: string;
  date: string;
  value: string;
  price?: number; // Add price as optional in case we need it later
}

// Custom header component with hover effect
const SortableHeader = ({ column, children }: { column: any, children: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="cursor-pointer select-none"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        fontWeight: '600',
        padding: '4px 0',
        transition: 'color 0.2s ease',
        color: isHovered ? 'grey' : 'inherit',
        cursor: 'pointer',
        userSelect: 'none', 
      }}
    >
      {children}
      {column.getIsSorted() && (
        <span style={{ marginLeft: '4px' }}>
          {column.getIsSorted() === "asc" ? "▲" : "▼"}
        </span>
      )}
    </div>
  );
};

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
        // Make sure we handle the data format from Supabase
        setInsiderData(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        console.error('Failed to fetch insider trades:', err);
        setError('Failed to load insider trade data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsiderData();
  }, []);

  const columns = useMemo<ColumnDef<InsiderTransaction>[]>(() => [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SortableHeader column={column}>
          Executive
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <SortableHeader column={column}>
          Title
        </SortableHeader>
      ),
    },
    {
      accessorKey: "company",
      header: ({ column }) => (
        <SortableHeader column={column}>
          Company
        </SortableHeader>
      ),
    },
    {
      accessorKey: "shares",
      header: ({ column }) => (
        <SortableHeader column={column}>
          Shares
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const shares = row.getValue<number>("shares");
        return <div>{typeof shares === 'number' ? shares.toLocaleString() : shares}</div>;
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <SortableHeader column={column}>
          Type
        </SortableHeader>
      ),
    },
    {
      accessorKey: "transactionType",
      header: ({ column }) => (
        <SortableHeader column={column}>
          Transaction
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const transactionType = row.getValue<string>("transactionType");
        return (
          <span
            className={
              transactionType === "A" ? "text-green-600 font-medium" : "text-red-600 font-medium"
            }
          >
            {transactionType}
          </span>
        );
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <SortableHeader column={column}>
          Date
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const date = row.getValue<string>("date");
        return new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
      },
      sortingFn: (rowA, rowB, columnId) => {
        const dateA = new Date(rowA.getValue(columnId)).getTime();
        const dateB = new Date(rowB.getValue(columnId)).getTime();
        return dateA > dateB ? 1 : dateA < dateB ? -1 : 0;
      },
    },
    {
      accessorKey: "value",
      header: ({ column }) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <SortableHeader column={column}>
            Value
          </SortableHeader>
        </div>
      ),
      cell: ({ row }) => {
        const value = row.getValue<string>("value");
        return (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {value === '$0.00' ? 'Value Unspecified' : value}
          </div>
        );
      },
    },
  ], []);

  // Add useEffect for smooth scrolling when hash changes
  useEffect(() => {
    // Check if there's a hash in the URL when component mounts
    if (window.location.hash === '#trades-table') {
      setTimeout(() => {
        const element = document.getElementById('trades-table');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small timeout to ensure the component is fully rendered
    }
  }, []);

  return (
      <DataTable
      columns={columns}
      data={insiderData}
      isLoading={isLoading}
      error={error}
      pageSize={10}
      tableTitle="Recent Insider Transactions"
      tableDescription="This table shows the latest transactions made by insiders at Fortune 500 companies in the last two years. You can specify more dates and certain company trades using the options below."
      showSearch={true}
      />
  );
};

export default InsiderTable;
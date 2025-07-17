"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { DataTable } from "@/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

// Interface to match the route2.js response structure
interface StockMover {
  stockName: string;
  price: number;
  changeAmount: number;
  changePercent: number;
  volume: number;
  category: string;
  date: string;
}

// Custom header component with hover effect (same as InsiderTable)
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

const HighLowTable = () => {
  const [stockData, setStockData] = useState<StockMover[]>([]);
  const [filteredData, setFilteredData] = useState<StockMover[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/high-low');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Handle the data format from the API
        const stockDataArray = Array.isArray(result.otherData) ? result.otherData : [];
        setStockData(stockDataArray);
        
        // Set last updated date if available
        if (result.metadata && result.metadata.length > 0) {
          setLastUpdated(result.metadata[0].lastUpdated);
        }
      } catch (err) {
        const error = err as Error;
        console.error('Failed to fetch stock data:', error);
        setError(`Failed to load stock data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockData();
  }, []);

  // Filter data based on selected category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredData(stockData);
    } else {
      const filtered = stockData.filter(stock => stock.category.toLowerCase() === selectedCategory.toLowerCase());
      setFilteredData(filtered);
    }
  }, [stockData, selectedCategory]);

  const columns = useMemo<ColumnDef<StockMover>[]>(() => [
    {
      accessorKey: "stockName",
      header: ({ column }) => (
        <SortableHeader column={column}>
          Stock Symbol
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("stockName")}</div>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <SortableHeader column={column}>
          Price
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const price = row.getValue<number>("price");
        return <div>${typeof price === 'number' ? price.toFixed(2) : price}</div>;
      },
    },
    {
      accessorKey: "changeAmount",
      header: ({ column }) => (
        <SortableHeader column={column}>
          Change ($)
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const changeAmount = row.getValue<number>("changeAmount");
        return (
          <span
            className={
              changeAmount >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"
            }
          >
            {changeAmount >= 0 ? '+' : ''}${typeof changeAmount === 'number' ? changeAmount.toFixed(2) : changeAmount}
          </span>
        );
      },
    },
    {
      accessorKey: "changePercent",
      header: ({ column }) => (
        <SortableHeader column={column}>
          Change (%)
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const changePercent = row.getValue<number>("changePercent");
        return (
          <span
            className={
              changePercent >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"
            }
          >
            {changePercent >= 0 ? '+' : ''}{typeof changePercent === 'number' ? changePercent.toFixed(2) : changePercent}%
          </span>
        );
      },
    },
    {
      accessorKey: "volume",
      header: ({ column }) => (
        <SortableHeader column={column}>
          Volume
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const volume = row.getValue<number>("volume");
        return <div>{typeof volume === 'number' ? volume.toLocaleString() : volume}</div>;
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <SortableHeader column={column}>
          Category
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const category = row.getValue<string>("category");
        return (
          <span
            className={
              category.toLowerCase() === "gainer" ? "text-green-600 font-medium" : 
              category.toLowerCase() === "loser" ? "text-red-600 font-medium" : 
              "text-blue-600 font-medium"
            }
          >
            {category}
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
  ], []);

  // Add useEffect for smooth scrolling when hash changes
  useEffect(() => {
    // Check if there's a hash in the URL when component mounts
    if (window.location.hash === '#stock-movers-table') {
      setTimeout(() => {
        const element = document.getElementById('stock-movers-table');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small timeout to ensure the component is fully rendered
    }
  }, []);

  return (
    <div id="stock-movers-table">
      {/* Category Filter Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {['all', 'gainer', 'loser', 'active'].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '2px solid #e0e0e0',
              backgroundColor: selectedCategory === category ? '#3b82f6' : 'white',
              color: selectedCategory === category ? 'white' : '#333',
              fontWeight: selectedCategory === category ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textTransform: 'capitalize',
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== category) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== category) {
                e.currentTarget.style.backgroundColor = 'white';
              }
            }}
          >
            {category === 'all' ? 'Show All' : `${category}s Only`}
          </button>
        ))}
      </div>

      {/* Last Updated Info */}
      {lastUpdated && (
        <div style={{
          textAlign: 'center',
          marginBottom: '1rem',
          fontSize: '0.875rem',
          color: '#666',
          fontStyle: 'italic'
        }}>
          Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        error={error}
        pageSize={15}
        tableTitle="Stock Market Movers"
        tableDescription={`Showing ${selectedCategory === 'all' ? 'all stock movers' : `${selectedCategory}s only`}. Click the buttons above to filter by category.`}
        showSearch={true}
      />
    </div>
  );
};

export default HighLowTable;

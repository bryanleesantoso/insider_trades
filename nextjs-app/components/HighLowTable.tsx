"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { DataTable } from "@/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

interface StockMover {
  stockName: string;
  price: number;
  changeAmount: number;
  changePercent: number;
  volume: number;
  category: string;
  date: string;
}
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
        console.log(result)
        const stockDataArray = Array.isArray(result.otherData) ? result.otherData : [];
        setStockData(stockDataArray);
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
  useEffect(() => {
    console.log('🔍 Filtering Debug:', {
      selectedCategory,
      totalData: stockData.length,
      availableCategories: [...new Set(stockData.map(s => s.category))],
      sampleData: stockData.slice(0, 3).map(s => ({ stockName: s.stockName, category: s.category }))
    });
    
    if (selectedCategory === 'all') {
      setFilteredData(stockData);
      console.log('✅ Showing all data:', stockData.length);
    } else {
      const filtered = stockData.filter(stock => {
        const stockCategory = stock.category.toLowerCase();
        const selectedCat = selectedCategory.toLowerCase();
        let match = false;
        
        if (selectedCat === 'gainer') {
          match = stockCategory.includes('gainer') || stockCategory.includes('gain');
        } else if (selectedCat === 'loser') {
          match = stockCategory.includes('loser') || stockCategory.includes('lose');
        } else if (selectedCat === 'active') {
          match = stockCategory.includes('active') || stockCategory.includes('most_active');
          match = stockCategory === selectedCat;
        }
        
        console.log(`Comparing: "${stockCategory}" with "${selectedCat}" = ${match}`);
        return match;
      });
      setFilteredData(filtered);
      console.log('✅ Filtered results:', {
        category: selectedCategory,
        filteredCount: filtered.length,
        originalCount: stockData.length
      });
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
        
        // Helper function for title case
        const toTitleCase = (str: string): string => {
          return str.toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase());
        };
        
        return (
          <span
            className={
              category.toLowerCase().includes("gainer") || category.toLowerCase().includes("gain") ? "text-green-600 font-medium" : 
              category.toLowerCase().includes("loser") || category.toLowerCase().includes("lose") ? "text-red-600 font-medium" : 
              "text-blue-600 font-medium"
            }
          >
            {toTitleCase(category)}
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

  useEffect(() => {
    if (window.location.hash === '#stock-movers-table') {
      setTimeout(() => {
        const element = document.getElementById('stock-movers-table');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <div id="stock-movers-table">
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        fontFamily: 'Helvetica, Arial, sans-serif',
        margin: '0 0 1rem 0',
        textAlign: 'center',
      }}>
        Stock Market Movers
      </h2>
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
        pageSize={10}
        tableDescription={'This table shows the latest stock market movers. 3 main categories include, gainers, losers, and most active stocks. The following information can help in deducing the most profitable, active, and high risk trades. Click the buttons above to filter by category.'}
        showSearch={true}
      />

      
    </div>
  );
};

export default HighLowTable;

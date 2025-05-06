"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type Table as ReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  error?: string | null;
  pageSize?: number;
  tableTitle?: string;
  tableDescription?: string;
  showSearch?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  error = null,
  pageSize = 10,
  tableTitle,
  tableDescription,
  showSearch = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

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
      {tableTitle && (
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          fontFamily: 'Helvetica, Arial, sans-serif',
          margin: '0 0 1rem 0',
          textAlign: 'center',
        }}>
          {tableTitle}
        </h2>
      )}
      
      {tableDescription && (
        <h3 style={{
          fontSize: '1rem',
          fontWeight: 'normal',
          fontFamily: 'Helvetica, Arial, sans-serif',
          margin: '0 0 1.5rem 0',
          textAlign: 'left',
        }}>
          {tableDescription}
        </h3>
      )}
      
      {/* Search input */}
      {showSearch && (
        <div style={{ marginBottom: '1rem' }}>
          <Input
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            style={{
              padding: '0.5rem',
              fontFamily: 'Helvetica, Arial, sans-serif',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              maxWidth: '300px'
            }}
          />
        </div>
      )}
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading data...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#d32f2f' }}>{error}</div>
      ) : (
        <div>
          <Table style={tableStyles}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} style={headerCellStyles}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow 
                    key={row.id}
                    style={{backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9'}}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} style={cellStyles}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    style={{ ...cellStyles, textAlign: 'center', padding: '2rem' }}
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1rem',
            fontFamily: 'Helvetica, Arial, sans-serif'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  background: !table.getCanPreviousPage() ? '#f5f5f5' : 'white',
                  cursor: !table.getCanPreviousPage() ? 'not-allowed' : 'pointer',
                  color: !table.getCanPreviousPage() ? '#999' : 'inherit'
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  background: !table.getCanNextPage() ? '#f5f5f5' : 'white',
                  cursor: !table.getCanNextPage() ? 'not-allowed' : 'pointer',
                  color: !table.getCanNextPage() ? '#999' : 'inherit'
                }}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div>
              Page{" "}
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
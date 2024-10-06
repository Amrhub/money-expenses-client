'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  showColumnVisibility?: boolean;
  filterBy?: keyof TData;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  showColumnVisibility,
  filterBy,
}: DataTableProps<TData, TValue>) {
  const tableData = useMemo(
    () => (isLoading ? (Array(10).fill({}) as TData[]) : data),
    [isLoading, data]
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const tableColumns = useMemo(
    () =>
      isLoading
        ? columns.map((column) => ({
            ...column,

            cell: () => {
              const isID =
                (typeof column.header === 'string' && column.header.toLowerCase() === 'id') ||
                column?.id === 'actions';
              return (
                <Skeleton
                  className={cn(
                    'h-[20px] rounded-full',
                    isID ? 'w-[45px]' : 'w-[auto] sm:w-[200px]'
                  )}
                />
              );
            },
          }))
        : columns,
    [isLoading, columns]
  );

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
      columnFilters,
    },
  });

  return (
    <div>
      {(!!filterBy || !!showColumnVisibility) && (
        <div className='flex items-center pb-4 gap-4 sm:gap-0'>
          {!!filterBy && (
            <Input
              placeholder={`Filter by ${filterBy as string}`}
              value={(table.getColumn(filterBy as string)?.getFilterValue() as string) || ''}
              onChange={(event) =>
                table.getColumn(filterBy as string)?.setFilterValue(event.target.value)
              }
              className='max-w-sm'
            />
          )}
          {!!showColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='ml-auto'>
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className='capitalize'
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* 
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div> */}
      <div className='mt-4'>
        <DataTablePagination table={table} config={{ showRowsSelected: false }} />
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
import { Table as TanStackTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Skeleton } from './skeleton';

interface DataTablePaginationProps<TData> {
  table: TanStackTable<TData>;
  config?: {
    showPageSizeDropdown?: boolean;
    showRowsSelected?: boolean;
  };
}

export function DataTablePagination<TData>({
  table,
  config = {
    showPageSizeDropdown: true,
    showRowsSelected: true,
  },
}: DataTablePaginationProps<TData>) {
  config.showPageSizeDropdown ??= true;
  config.showRowsSelected ??= true;

  return (
    <div className='flex items-center justify-between px-2'>
      {config.showRowsSelected && (
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      )}
      <div className='flex flex-col sm:flex-row gap-4 sm:gap-0 items-center space-x-6 lg:space-x-8 ml-auto'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {!!table.getPageCount() && (
          <div className='hidden sm:flex w-[100px] items-center justify-center text-sm font-medium'>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
        )}

        <Pagination className='w-auto order-first sm:order-none'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                onClick={table.previousPage}
                className={
                  !table.getCanPreviousPage() ? 'pointer-events-none text-muted-foreground' : ''
                }
                tabIndex={-1}
                aria-disabled={!table.getCanPreviousPage()}
              />
            </PaginationItem>
            {Array.from({ length: table.getPageCount() }).map((_, index) => {
              return (
                table.getState().pagination.pageIndex + 2 >= index && (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href='#'
                      onClick={() => table.setPageIndex(index)}
                      className={
                        table.getState().pagination.pageIndex === index
                          ? 'outline-1 outline outline-secondary-foreground pointer-events-none'
                          : ''
                      }
                      tabIndex={-1}
                      aria-disabled={table.getState().pagination.pageIndex === index}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              );
            })}
            {table.getState().pagination.pageIndex + 2 < table.getPageCount() - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                href='#'
                onClick={table.nextPage}
                className={
                  !table.getCanNextPage() ? 'pointer-events-none text-muted-foreground' : ''
                }
                tabIndex={-1}
                aria-disabled={!table.getCanNextPage()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

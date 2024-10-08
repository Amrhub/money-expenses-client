'use client';

import request from '@/app/axios/interceptor';
import { CURRENCY, formatDate } from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../ui/data-table';
import { GetReceiptResponseDto } from '@/app/axios/openapi';

const columns: ColumnDef<GetReceiptResponseDto>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'totalPrice',
    // safe navigating is added here for skeleton loading
    accessorFn: (receipt) => {
      return new Intl.NumberFormat().format(receipt.totalPrice);
    },
    header: `Total Price (${CURRENCY})`,
  },
  {
    accessorKey: 'createdAt',
    accessorFn: (receipt) => formatDate(receipt.createdAt),
    header: 'Created At',
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => {
  //     const product = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant='ghost' className='h-8 w-8 p-0'>
  //             <span className='sr-only'>Open menu</span>
  //             <MoreHorizontal className='h-4 w-4' />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align='end'>
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => {
  //               setSelectedProduct(product);
  //             }}
  //           >
  //             <Edit className='mr-2 h-4 w-4' />
  //             Edit
  //           </DropdownMenuItem>
  //           <DropdownMenuItem
  //             onClick={() => {
  //               deleteProduct(product.id);
  //             }}
  //           >
  //             <Delete className='mr-2 h-4 w-4' />
  //             Delete
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

const ListReceipts = () => {
  const {
    data: receipts,
    isError,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['receipts'],
    queryFn: () => request<GetReceiptResponseDto[]>({ url: '/receipts' }),
  });

  if (isError) {
    console.error(error);
    return <></>;
  }

  return (
    <div className='my-4'>
      <DataTable
        columns={columns}
        data={receipts ?? []}
        isLoading={isLoading || isFetching}
      ></DataTable>
    </div>
  );
};

export default ListReceipts;

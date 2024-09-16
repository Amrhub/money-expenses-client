'use client';

import request from '@/axios';
import ProductModal from '@/components/modals/product/ProductModal';
import PageTitle from '@/components/pageTitle/PageTitle';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { Product } from '@/dto/product.dto';
import useProductsQuery from '@/queries/products.query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Delete, Edit, MoreHorizontal } from 'lucide-react';
import Head from 'next/head';
import { Suspense, useState } from 'react';

function ProductsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const {
    data: response,
    isLoading,
    isError,
    isFetching,
  } = useProductsQuery({
    retry: 0,
    onError: (e) => {
      if (typeof e === 'string' && e === 'Network Error') {
        toast({
          title: 'Error',
          description: 'Server is down, please try again later',
          variant: 'destructive',
        });
      }
    },
  });

  const { mutate: deleteProduct, isPending: isDeleteLoading } = useMutation({
    mutationFn: (id: number) =>
      request({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });
    },
  });

  if (isError) {
    // TODO: Add UI for error state
  }

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'price',
      // safe navigating is added here for skeleton loading
      accessorFn: (product) => product?.price?.toFixed(2),
      header: 'Price',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedProduct(product);
                }}
              >
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  deleteProduct(product.id);
                }}
              >
                <Delete className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Head>
        <title>Money Expenses | My Products</title>
        <meta name='description' content='A list of products I purchase regularly' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      <PageTitle text='Products' />

      <ProductModal
        handleClose={() => {
          setSelectedProduct(undefined);
        }}
        product={selectedProduct}
      />

      <div className='my-4'>
        <DataTable
          columns={columns}
          data={response?.products ?? []}
          isLoading={isLoading || isFetching || isDeleteLoading}
        />
      </div>
    </>
  );
}

export default ProductsPage;

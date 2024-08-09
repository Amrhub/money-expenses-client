import Head from 'next/head';
import { useState } from 'react';
import ProductModal from '@/components/modals/product/ProductModal';
import { Product } from '@/dto/product.dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import request from '@/axios';
import PageTitle from '@/components/pageTitle/PageTitle';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Delete, Edit, MoreHorizontal } from 'lucide-react';

function Products() {
  const queryClient = useQueryClient();
  // const [pagination, setPagination] = useState({
  //   page: 0,
  //   rowsPerPage: 5,
  // });
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const {
    data: response,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () =>
      request<{ products: Product[]; count: number }>({
        url: '/products',
        // ? pagination is currently implemented in the frontend only till further notice
        // params: { rowsPerPage: pagination.rowsPerPage, page: pagination.page },
      }).then((res) => res),
    cacheTime: 1 * 60 * 60 * 1000,
    staleTime: 1 * 60 * 60 * 1000,
  });

  const { mutate: deleteProduct, isLoading: isDeleteLoading } = useMutation(
    (id: number) =>
      request({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products']);
      },
    }
  );

  if (isError) return <h1>Error</h1>;
  if (!response && !isLoading) return <h1>Products not found</h1>;

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

export default Products;

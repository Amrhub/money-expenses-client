import { Button, Container, Divider, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Head from 'next/head';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import ProductModal from '@/components/modals/product/ProductModal';
import { Product } from '@/dto/product.dto';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getAccessToken } from '@auth0/nextjs-auth0';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import request from '@/axios';
import { useStore } from '@/store/store';

function Products() {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 5,
  });
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const {
    data: response,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ['products', pagination.page, pagination.rowsPerPage],
    queryFn: () =>
      request<{ products: Product[]; count: number }>({
        url: '/products',
        params: { rowsPerPage: pagination.rowsPerPage, page: pagination.page },
      }).then((res) => res),
    cacheTime: 1 * 60 * 60 * 1000,
    staleTime: 1 * 60 * 60 * 1000,
  });

  const { mutate, isLoading: isMutating } = useMutation(
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

  useStore.setState({ showLoader: isLoading || isFetching || isMutating });

  if (isError) return <h1>Error</h1>;
  if (!response && !isLoading) return <h1>Products not found</h1>;

  return (
    <>
      <Head>
        <title>My Products</title>
        <meta name='description' content='A list of products I purchase regularly' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Typography variant='h5'>My Products</Typography>
      <Divider
        sx={{
          width: 10,
          height: 0.5,
          backgroundColor: 'primary.main',
          mb: 4,
        }}
        classes={{ root: 'custom-hr' }}
      />
      <Button variant='contained' startIcon={<AddIcon />} onClick={() => setOpen(true)}>
        Add Product
      </Button>

      <ProductModal
        open={open}
        handleClose={() => {
          setOpen(false);
          setSelectedProduct(undefined);
        }}
        product={selectedProduct}
      />

      <TableContainer sx={{ mt: 4, maxHeight: '500px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox' sx={{ pl: 2 }}>
                #
              </TableCell>
              <TableCell sx={{ width: '500px' }}>Product Name</TableCell>
              <TableCell sx={{ width: '500px' }}>Price (EGP)</TableCell>
              <TableCell sx={{ width: '150px' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!!response?.products?.length &&
              response?.products?.map((product, index) => (
                <TableRow hover classes={{ root: 'table-row' }} key={product.id}>
                  <TableCell padding='checkbox' sx={{ pl: 2 }}>
                    {index + 1}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell classes={{ root: 'table-row_btns-container' }}>
                    <IconButton
                      color='primary'
                      sx={{ mr: 2, p: '3px', fontSize: '18px' }}
                      onClick={() => {
                        setSelectedProduct(product);
                        setOpen(true);
                      }}
                    >
                      <EditIcon fontSize='inherit' />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        mutate(product.id);
                      }}
                      color='error'
                      sx={{ p: '3px', fontSize: '18px' }}
                    >
                      <DeleteIcon fontSize='inherit' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={response?.count || 0}
        rowsPerPage={pagination.rowsPerPage}
        page={pagination.page}
        onPageChange={(event, page) => setPagination((prev) => ({ ...prev, page }))}
        onRowsPerPageChange={(event) => {
          const newRowsPerPage = +event.target.value;
          let newPage = pagination.page;
          while (response && newPage * newRowsPerPage > response.count) {
            newPage--;
          }

          setPagination((prev) => ({ ...prev, page: newPage, rowsPerPage: newRowsPerPage }));
        }}
      />
    </>
  );
}

export default Products;

export const getServerSideProps = withPageAuthRequired();

import { IconButton, Typography, Tooltip, Zoom } from '@mui/material';
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
import { useState, useEffect } from 'react';
import ProductModal from '@/components/modals/product/ProductModal';
import { Product } from '@/dto/product.dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import request from '@/axios';
import { useStore } from '@/store/store';
import PageTitle from '@/components/pageTitle/PageTitle';

function Products() {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 5,
  });
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

  useEffect(() => {
    useStore.setState({ showLoader: isLoading || isFetching || isMutating });
  }, [isLoading, isFetching, isMutating]);

  if (isError) return <h1>Error</h1>;
  if (!response && !isLoading) return <h1>Products not found</h1>;

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
                  <TableCell>
                    <Tooltip
                      title={product.name}
                      placement='bottom-start'
                      TransitionComponent={Zoom}
                      TransitionProps={{ timeout: 250 }}
                      enterTouchDelay={0}
                    >
                      <Typography
                        variant='body2'
                        noWrap
                        sx={{ display: 'block', maxWidth: { xs: '8ch', sm: '24ch', md: 'auto' } }}
                      >
                        {product.name}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell
                    classes={{ root: 'table-row_btns-container' }}
                    sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}
                  >
                    <IconButton
                      color='primary'
                      onClick={() => {
                        setSelectedProduct(product);
                      }}
                    >
                      <EditIcon fontSize='inherit' />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        mutate(product.id);
                      }}
                      color='error'
                    >
                      <DeleteIcon fontSize='inherit' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={response?.count || 0}
          rowsPerPage={pagination.rowsPerPage}
          page={response?.count ? pagination.page : 0}
          onPageChange={(_event, page) => setPagination((prev) => ({ ...prev, page }))}
          onRowsPerPageChange={(event) => {
            const newRowsPerPage = +event.target.value;
            let newPage = pagination.page;
            while (response && newPage * newRowsPerPage > response.count) {
              newPage--;
            }

            setPagination((prev) => ({ ...prev, page: newPage, rowsPerPage: newRowsPerPage }));
          }}
        />
      }
    </>
  );
}

export default Products;

// export const getServerSideProps = withPageAuthRequired();

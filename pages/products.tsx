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

const initialProducts = [
  {
    id: 1,
    name: 'Newspapers and magazines',
    price: 70,
  },
  {
    id: 2,
    name: 'Groceries and Food Items',
    price: 55,
  },
  {
    id: 3,
    name: 'Soft Drinks',
    price: 40,
  },
  {
    id: 4,
    name: 'Tissues, headache tablets',
    price: 15,
  },
];

export default function Home() {
  const [products, setProducts] = useState(initialProducts);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

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

      <TableContainer sx={{ mt: 4 }}>
        <Table>
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
            {products.length > 0 &&
              products.map((product, _index) => (
                <TableRow hover classes={{ root: 'table-row' }} key={product.id}>
                  <TableCell padding='checkbox' sx={{ pl: 2 }}>
                    {product.id}
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
                        setProducts(products.filter((p) => p.id !== product.id));
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
        count={products.length}
        rowsPerPage={5}
        page={0}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />
    </>
  );
}

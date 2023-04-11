import { TextField, Stack, Tooltip, Alert, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import request from '@/axios';
import { Product } from '@/dto/product.dto';
import { useStore } from '@/store/store';
import MyModal from '../myModal/MyModal';
import { Info } from '@mui/icons-material';

interface IProps {
  open: boolean;
  handleClose: () => void;
  product?: Product;
}

const ProductModal = ({ open, handleClose, product }: IProps) => {
  const [productInputs, setProductInputs] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (product?.name) setProductInputs({ name: product.name, price: product.price });
  }, [product?.name, product?.price]);

  const isEdit = product ? true : false;
  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries(['products']);
    resetThenClose();
  };
  const onError = (error: any) => {
    if (error?.data?.message) {
      setSnackbarMessage(error.data.message);
    } else {
      setSnackbarMessage('Something went wrong');
    }
    setOpenSnackbar(true);
  };

  const { mutate: editProduct } = useMutation(
    (product: Product) =>
      request({
        url: `/products/${product?.id}`,
        method: 'PATCH',
        data: {
          name: product.name,
          price: product.price,
        },
      }),
    {
      onSuccess,
      onMutate: () => {
        useStore.setState({ showLoader: true });
      },
      onSettled: () => {
        useStore.setState({ showLoader: false });
      },
      onError,
    }
  );

  const { mutate: addProduct } = useMutation(
    (product: Omit<Product, 'id'>) =>
      request({
        url: `/products`,
        method: 'POST',
        data: {
          name: product.name,
          price: product.price,
        },
      }),
    {
      onSuccess,
      onError,
    }
  );

  const handleAction = () => {
    if (isEdit) {
      editProduct({ ...productInputs, id: product!.id });
    } else {
      addProduct(productInputs);
    }
  };

  const resetThenClose = () => {
    setProductInputs({ name: '', price: 0 });
    handleClose();
  };

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity='error'
          sx={{ width: '100%' }}
          variant='filled'
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <MyModal
        open={open}
        handleClose={resetThenClose}
        title={isEdit ? 'Edit Product' : 'Add Product'}
        handleAction={handleAction}
        actionText={isEdit ? 'Save' : 'Add'}
        actionDisabled={
          productInputs.name === '' ||
          productInputs.price === 0 ||
          (productInputs.name === product?.name && productInputs.price === product?.price)
        }
      >
        <Stack spacing={1} marginBottom={4}>
          <Stack gap={0.5} direction='row' alignItems='center'>
            <label htmlFor='product-name'>Name</label>
            <Tooltip
              title='Product name is unique and will be used in receipts, reports, and any other feature so choose it carefully'
              placement='bottom-start'
              arrow
            >
              <Info fontSize='small' color='info' />
            </Tooltip>
          </Stack>
          <TextField
            id='product-name'
            variant='outlined'
            value={productInputs.name}
            onChange={(e) => {
              setProductInputs((prev) => {
                return { name: e.target.value, price: prev.price };
              });
            }}
          />
        </Stack>
        <Stack spacing={1} direction='column'>
          <label htmlFor='product-name'>Price</label>
          <TextField
            id='product-name'
            variant='outlined'
            value={productInputs?.price === 0 ? '' : productInputs?.price}
            onChange={(e) => {
              if (isNaN(+e.target.value) && e.target.value != '.') return;
              setProductInputs((prev) => ({ ...prev, price: +e.target.value }));
            }}
            inputProps={{ type: 'number', inputMode: 'numeric', pattern: '[0-9]*' }}
          />
        </Stack>
      </MyModal>
    </>
  );
};

export default ProductModal;

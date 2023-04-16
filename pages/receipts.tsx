import PageTitle from '@/components/pageTitle/PageTitle';
import React, { useEffect, useState, createRef, useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import MyModal from '@/components/modals/myModal/MyModal';
import Typography from '@mui/material/Typography';
import {
  Autocomplete,
  TextField,
  Stack,
  Tooltip,
  Divider,
  Zoom,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/dto/product.dto';
import request from '@/axios';
import { useStore } from '@/store/store';
import { motion } from 'framer-motion';
import { InfoOutlined } from '@mui/icons-material';
import ListReceipts from '@/components/receipts/ListReceipts';
import Head from 'next/head';

const itemsInitialState = [
  {
    name: '',
    price: 0,
    quantity: 0,
  },
];

const Receipts = () => {
  const [open, setOpen] = useState(false);
  const [receiptName, setReceiptName] = useState('');
  const [items, setItems] =
    useState<Array<{ id?: number; name: string; price: number; quantity: number }>>(
      itemsInitialState
    );
  const modalBodyRef = createRef<HTMLDivElement>();
  const shouldScroll = useRef(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const queryClient = useQueryClient();

  const addInput = () => {
    setItems([...items, { name: '', price: 0, quantity: 0 }]);
  };

  const handleModalClose = () => {
    setOpen(false);
    setItems(itemsInitialState);
    setReceiptName('');
  };

  const {
    data: products,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () =>
      request<{ products: Product[]; count: number }>({
        url: '/products',
      }).then((res) => res),
    cacheTime: 1 * 60 * 60 * 1000,
    staleTime: 1 * 60 * 60 * 1000,
  });

  const { mutate: addReceipt, isLoading: isAddingReceipt } = useMutation({
    mutationFn: () =>
      request({
        url: '/receipts',
        method: 'POST',
        data: {
          name: receiptName,
          items: items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      }).then((res) => res),
    onSuccess: () => {
      queryClient.invalidateQueries(['receipts']);
      handleModalClose();
    },
    onError: (error: any) => {
      if (error?.data?.message) {
        setSnackbarMessage(error.data.message);
      } else {
        setSnackbarMessage('Something went wrong');
      }
      setOpenSnackbar(true);
    },
  });

  useEffect(() => {
    useStore.setState({ showLoader: isLoading || isFetching || isAddingReceipt });
  }, [isLoading, isFetching, isAddingReceipt]);

  useEffect(() => {
    if (!shouldScroll.current) {
      shouldScroll.current = true;
      return;
    }

    modalBodyRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [items, modalBodyRef]);

  if (isError) return <h1>Error</h1>;

  const actionDisabled =
    receiptName.length === 0 ||
    items.some((item) => item.name === '' || !item.price || !item.quantity);

  return (
    <>
      <Head>
        <title>Money Expenses | Receipts</title>
      </Head>
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
      <PageTitle text='Receipts' />
      <Button
        variant='contained'
        startIcon={<AddIcon />}
        onClick={() => {
          setOpen(true);
        }}
      >
        Add Receipt
      </Button>
      <MyModal
        title='Add Receipts'
        handleClose={handleModalClose}
        handleAction={addReceipt}
        actionText='Add'
        actionDisabled={actionDisabled}
        open={open}
        desktopWidth={600}
      >
        <Stack>
          <TextField
            label='Receipt Name'
            variant='outlined'
            value={receiptName}
            onChange={(e) => setReceiptName(e.target.value)}
            size='small'
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='start'>
                  <Tooltip
                    title="Receipt's name should be unique & descriptive since it will be used to identify the receipt in reports or other places."
                    arrow
                    TransitionComponent={Zoom}
                    enterTouchDelay={0}
                    leaveTouchDelay={5000}
                    TransitionProps={{
                      timeout: 250,
                    }}
                  >
                    <IconButton
                      sx={{
                        p: 0,
                      }}
                      color='info'
                    >
                      <InfoOutlined />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant='body1' color='initial'>
            Items
          </Typography>
          <motion.div layout transition={{ type: 'spring' }}>
            {items.length &&
              items.map((item, index) => (
                <motion.div key={item.name + index} layout='position'>
                  <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} my={1}>
                    <Autocomplete
                      disablePortal
                      value={items[index].name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Name'
                          variant='outlined'
                          type='search'
                          value={items[index].name}
                          onBlur={(e) => {
                            setItems((prev) => {
                              const newItems = [...prev];
                              newItems[index] = {
                                ...newItems[index],
                                name: e.target.value,
                              };
                              return newItems;
                            });
                          }}
                        />
                      )}
                      options={products?.products?.map((product) => product.name) || []}
                      size='small'
                      disableClearable
                      fullWidth
                      freeSolo
                      renderOption={(params: any) => {
                        return (
                          <li {...params}>
                            <Tooltip
                              title={params.key}
                              enterTouchDelay={0}
                              arrow
                              TransitionComponent={Zoom}
                              TransitionProps={{ timeout: 250 }}
                            >
                              <Typography
                                variant='body2'
                                noWrap
                                sx={{ maxWidth: { xs: '290px', sm: '190px' } }}
                              >
                                {params.key}
                              </Typography>
                            </Tooltip>
                          </li>
                        );
                      }}
                      onInputChange={(_event, value) => {
                        const product = products?.products?.find(
                          (product) => product.name === value
                        );
                        if (product) {
                          setItems((prev) => {
                            const newItems = [...prev];
                            newItems[index] = {
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              quantity: items[index].quantity || 1,
                            };
                            return newItems;
                          });
                        }
                      }}
                    />
                    <TextField
                      label='Price'
                      variant='outlined'
                      size='small'
                      value={items[index].price === 0 ? '' : items[index].price}
                      onChange={(e) => {
                        setItems((prev) => {
                          const newItems = [...prev];
                          newItems[index] = {
                            ...newItems[index],
                            price:
                              isNaN(+e.target.value) || !isFinite(+e.target.value)
                                ? newItems[index].price
                                : +e.target.value,
                          };
                          return newItems;
                        });
                      }}
                    />
                    <TextField
                      label='Quantity'
                      variant='outlined'
                      size='small'
                      value={items[index].quantity === 0 ? '' : items[index].quantity}
                      onChange={(e) => {
                        setItems((prev) => {
                          const newItems = [...prev];
                          newItems[index] = {
                            ...newItems[index],
                            quantity:
                              isNaN(+e.target.value) || !isFinite(+e.target.value)
                                ? newItems[index].quantity
                                : +e.target.value,
                          };
                          return newItems;
                        });
                      }}
                    />

                    <IconButton
                      onClick={() => {
                        shouldScroll.current = false;
                        setItems(items.filter((_, i) => i !== index));
                      }}
                      color='error'
                      disableRipple
                      disabled={items.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                  {index + 1 !== items.length && (
                    <Divider sx={{ display: { xs: 'block', sm: 'none' } }} color='blue' />
                  )}
                </motion.div>
              ))}
          </motion.div>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={addInput}
            sx={{ ml: 'auto' }}
          >
            Add Item
          </Button>
          <div ref={modalBodyRef} />
        </Stack>
      </MyModal>

      <ListReceipts />
    </>
  );
};

export default Receipts;

// TODO figure out why withPageAuthRequired doesn't work on vercel deployment
// export const getServerSideProps = withPageAuthRequired();

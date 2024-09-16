'use client';

import request from '@/axios';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/dto/product.dto';
import useProductsQuery from '@/queries/products.query';
import { useStore } from '@/store/store';
import {
  Autocomplete,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Plus, Trash } from 'lucide-react';
import React, { useState } from 'react';

const itemsInitialState = [
  {
    name: '',
    price: 0,
    quantity: 0,
  },
];

const ReceiptModal = () => {
  const [open, setOpen] = useState(false);
  const [receiptName, setReceiptName] = React.useState('');
  const [items, setItems] =
    useState<Array<{ id?: number; name: string; price: number; quantity: number }>>(
      itemsInitialState
    );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: products, isLoading, isError, isFetching } = useProductsQuery();

  const addInput = () => {
    setItems([...items, { name: '', price: 0, quantity: 0 }]);
  };

  const actionDisabled =
    receiptName.length === 0 ||
    items.some((item) => item.name === '' || !item.price || !item.quantity);

  const handleModalClose = () => {
    // handleClose();
    setItems(itemsInitialState);
    setReceiptName('');
  };

  const { mutate: addReceipt, isPending: isAddingReceipt } = useMutation({
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
    onMutate: () => {
      useStore.setState({ showLoader: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['receipts'],
      });
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
    onSettled: () => {
      useStore.setState({ showLoader: false });
    },
  });

  {
    /* <Snackbar
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
  </Snackbar> */
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setOpen(false);
          handleModalClose();
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button className='uppercase '>
          <Plus className='mr-2 w-5 h-5 ' />
          Receipt
        </Button>
      </DialogTrigger>

      <DialogContent
        className={
          'w-[var(--dialog-mobile-width)] lg:max-w-[var(--dialog-desktop-width)] rounded-md'
        }
      >
        <DialogHeader>
          <DialogTitle>Add Receipts</DialogTitle>
          <DialogDescription className='text-xs'>
            {`Receipt's name should be unique & descriptive since it will be used to identify the
                receipt in reports or other places.`}
          </DialogDescription>
        </DialogHeader>

        <Stack>
          <div className='flex w-full max-w-sm items-center gap-1.5'>
            <Label htmlFor='name' className='text-left'>
              Name
            </Label>
            <Input
              className='w-full'
              placeholder='e.g. Careffour Receipt | 02-07-2024'
              value={receiptName}
              onChange={(e) => setReceiptName(e.target.value)}
              id='name'
            />
          </div>

          <Separator className='my-4' />

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
                          className='text-red-500'
                          label='Name'
                          variant='outlined'
                          type='search'
                          value={items[index].name}
                          // save the value in the state on blur
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
                      selectOnFocus
                      clearOnBlur
                      autoSelect
                      loading={isLoading || isFetching}
                      // Render options is used here to ellipsis the text and show a tooltip on hover
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
                      onInputChange={(_event, value, reason) => {
                        if (reason === 'input') return;
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
                        setItems(items.filter((_, i) => i !== index));
                      }}
                      color='error'
                      disableRipple
                      disabled={items.length === 1}
                    >
                      <Trash />
                    </IconButton>
                  </Stack>
                  {index + 1 !== items.length && (
                    <Divider sx={{ display: { xs: 'block', sm: 'none' } }} color='blue' />
                  )}
                </motion.div>
              ))}
          </motion.div>
          <Button variant='default' onClick={addInput} className='ml-auto'>
            <Plus className='mr-2 w-5 h-5' />
            Add Item
          </Button>
        </Stack>

        <DialogFooter>
          <Button
            type='submit'
            variant='default'
            onClick={() => addReceipt()}
            disabled={actionDisabled}
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />} Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptModal;

'use client';

import request from '@/axios/interceptor';
import { Autocomplete } from '@/components/ui/autocomplete';
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
import { useToast } from '@/components/ui/use-toast';
import { Item } from '@/models/receipt.model';
import useProductsQuery from '@/queries/products.query';
import { useStore } from '@/store/store';

import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [receiptName, setReceiptName] = React.useState('');
  const [items, setItems] = useState<Item[]>(itemsInitialState);

  const { data: products, isLoading } = useProductsQuery();

  const addInput = () => {
    setItems([...items, { name: '', price: 0, quantity: 0 }]);
  };

  const actionDisabled =
    receiptName.length === 0 ||
    items.some((item) => item.name === '' || !item.price || !item.quantity);

  const handleModalClose = () => {
    setOpen(false);
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
      const errReport = {
        title: 'Error' as const,
        description: 'Something went wrong',
        variant: 'destructive' as const,
      };

      if (error?.data?.message) {
        errReport.description = error.data.message;
      }
      toast(errReport);
    },
    onSettled: () => {
      useStore.setState({ showLoader: false });
    },
  });

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

        <section className='flex flex-col'>
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

          <span>Items</span>
          <motion.div layout transition={{ type: 'spring' }}>
            {!!items.length &&
              items.map((item, index) => (
                <motion.div key={item.name + index} layout='position'>
                  <div className='flex flex-col sm:flex-row gap-2 my-1'>
                    {/* TODO: Fix this, How can we do array in react the proper */}
                    <Autocomplete
                      placeholder='Name'
                      options={
                        products?.products.map((product) => ({
                          value: product.name,
                          label: product.name,
                        })) || []
                      }
                      value={items[index].name}
                      onChange={(value) => {
                        setItems((prev) => {
                          const newItems = [...prev];
                          const product = products?.products.find(
                            (product) => product.name === value
                          );

                          if (product) {
                            newItems[index] = {
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              quantity: items[index].quantity || 1,
                            };
                          } else {
                            newItems[index] = {
                              ...newItems[index],
                              name: value ?? '',
                            };
                          }
                          return newItems;
                        });
                      }}
                    />

                    <Input
                      type='number'
                      id='price'
                      className='[&::-webkit-inner-spin-button]:appearance-none'
                      placeholder='Price'
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

                    <Input
                      type='number'
                      id='quantity'
                      className='[&::-webkit-inner-spin-button]:appearance-none'
                      placeholder='Quantity'
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

                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => {
                        setItems(items.filter((_, i) => i !== index));
                      }}
                      disabled={items.length === 1}
                    >
                      <Trash className='h-4 w-4' />
                    </Button>
                  </div>
                  {index + 1 !== items.length && <Separator className='sm:hidden' />}
                </motion.div>
              ))}
          </motion.div>
          <Button variant='default' onClick={addInput} className='ml-auto'>
            <Plus className='mr-2 w-5 h-5' />
            Add Item
          </Button>
        </section>

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

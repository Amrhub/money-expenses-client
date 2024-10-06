'use client';

import request from '@/app/axios/interceptor';
import { Item, ProductClass } from '@/app/axios/openapi';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import useProductsQuery from '@/queries/products.query';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Plus, Trash } from 'lucide-react';
import React, { useRef, useState } from 'react';

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
  const [storeName, setStoreName] = React.useState('');
  const [items, setItems] = useState<Item[]>(itemsInitialState);
  const receiptListDiv = useRef<HTMLDivElement>(null);
  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const [numberOfNewProducts, setNumberOfNewProducts] = useState(0);
  const [numberOfModifiedProducts, setNumberOfModifiedProducts] = useState(0);
  const [shouldSaveNewProducts, setShouldSaveNewProducts] = useState(true);
  const [shouldSaveModifiedProducts, setShouldSaveModifiedProducts] = useState(true);
  const [newProductsNames, setNewProductsNames] = useState<string[] | undefined>();
  const [modifiedProductsNames, setModifiedProductsNames] = useState<string[] | undefined>();

  const { data: products, isLoading } = useProductsQuery();

  const addInput = () => {
    setItems([...items, { name: '', price: 0, quantity: 0 }]);
    // Differ the scroll to the next tick to allow the new item to be rendered
    setTimeout(() => {
      receiptListDiv.current?.scrollTo(0, receiptListDiv.current?.scrollHeight);
    });
  };

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
          ...(shouldSaveModifiedProducts && { modifiedProductsNames }),
          ...(shouldSaveNewProducts && { newProductsNames }),
        },
      }).then((res) => res),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['receipts'],
      });

      (shouldSaveModifiedProducts || shouldSaveNewProducts) &&
        queryClient.invalidateQueries({
          queryKey: ['products'],
        });
      handleModalClose();
    },
    onError: (error: any) => {
      console.error(`🚀 ~ ReceiptModal ~ error:`, error);

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
  });

  const actionDisabled =
    isAddingReceipt ||
    receiptName.length === 0 ||
    items.some((item) => item.name === '' || !item.price || !item.quantity);

  const shouldWarnProductsChange = (): boolean => {
    const productsMap = new Map<string, ProductClass>(
      products?.products.map((product) => [product.name, product])
    );
    let shouldWarn = false;
    setNumberOfNewProducts(0);
    setNumberOfModifiedProducts(0);
    setNewProductsNames(undefined);
    setModifiedProductsNames(undefined);

    for (const item of items) {
      const product = productsMap.get(item.name);
      if (!product) {
        shouldWarn = true;
        setNumberOfNewProducts((prev) => prev + 1);
        setNewProductsNames((prev) => [...(prev || []), item.name]);
      } else if (product.price !== item.price) {
        shouldWarn = true;
        setNumberOfModifiedProducts((prev) => prev + 1);
        setModifiedProductsNames((prev) => [...(prev || []), item.name]);
      }
    }

    return shouldWarn;
  };

  const onAddReceipt = () => {
    const shouldOpenAlertDialog = shouldWarnProductsChange();

    if (shouldOpenAlertDialog) {
      setIsAlertOpened(true);
    } else {
      addReceipt();
    }
  };

  return (
    <>
      <AlertDialog open={isAlertOpened} onOpenChange={setIsAlertOpened}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save modified products?</AlertDialogTitle>
            <Separator className='my-4' />
            <AlertDialogDescription>
              You have modified products in the receipt that are not saved yet. Do you want to save
              them? If you {"don't"} save them, the receipt will be saved anyways but the products
              will not be updated.
            </AlertDialogDescription>
            {!!numberOfNewProducts && (
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='shouldSaveNewProducts'
                  checked={shouldSaveNewProducts}
                  onCheckedChange={(e) => {
                    setShouldSaveNewProducts(e === 'indeterminate' ? false : e);
                  }}
                />
                <label
                  htmlFor='shouldSaveNewProducts'
                  className='font-medium leading-none hover:cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Save {numberOfNewProducts} new {numberOfNewProducts > 1 ? 'products' : 'product'}
                </label>
              </div>
            )}

            {!!numberOfModifiedProducts && (
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='numberOfModifiedProducts'
                  checked={shouldSaveModifiedProducts}
                  onCheckedChange={(e) => {
                    setShouldSaveModifiedProducts(e === 'indeterminate' ? false : e);
                  }}
                />
                <label
                  htmlFor='numberOfModifiedProducts'
                  className='font-medium leading-none hover:cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Save {numberOfModifiedProducts} edited{' '}
                  {numberOfModifiedProducts > 1 ? 'products' : 'product'}
                </label>
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                setIsAlertOpened(false);
                addReceipt();
              }}
            >
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            'w-[var(--dialog-mobile-width)] lg:max-w-[var(--dialog-desktop-width)] rounded-md max-h-[98%] min-h-[70%] sm:min-h-[50%] overflow-hidden'
          }
        >
          <DialogHeader>
            <DialogTitle>Add Receipts</DialogTitle>
            <DialogDescription className='text-xs'>
              {`Receipt's name should be unique & descriptive since it will be used to identify the
                    receipt in reports or other places.`}
            </DialogDescription>
          </DialogHeader>
          {/* <section className='flex flex-col'> */}
          <div className='flex flex-row sm:flex-col gap-2'>
            <Input
              className='w-full'
              placeholder='Carrefour Receipt | 02-07-2024'
              value={receiptName}
              onChange={(e) => setReceiptName(e.target.value)}
              id='name'
              autoComplete='receipt-name'
            />

            <Autocomplete
              placeholder='Store (Optional)'
              className='mt-[10px] sm:mt-0'
              options={[
                {
                  value: 'Carrefour',
                  label: 'Carrefour',
                },
                {
                  value: 'Lulu',
                  label: 'Lulu',
                },
                {
                  value: 'Geant',
                  label: 'Geant',
                },
                {
                  value: 'Spinneys',
                  label: 'Spinneys',
                },
              ]}
              value={storeName}
              onChange={(value) => setStoreName(value ?? '')}
            />
          </div>
          <Separator className='my-4' />
          <span>Items</span>
          <motion.div
            layout
            transition={{ type: 'tween' }}
            className='flex-1 overflow-y-auto scroll-smooth sm:scrollbar-none px-2 py-2'
            ref={receiptListDiv}
          >
            {!!items.length &&
              items.map((item, index) => (
                <motion.div key={item.name + index} layout='position'>
                  <div className='flex flex-col sm:flex-row gap-1 sm:gap-2 sm:my-1'>
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
                    <div className='flex gap-4 sm:gap-2'>
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
                  </div>
                  {index + 1 !== items.length && <Separator className='sm:hidden my-4' />}
                </motion.div>
              ))}
          </motion.div>
          <DialogFooter className='gap-2'>
            <Button
              type='submit'
              variant='default'
              className='ml-auto'
              onClick={() => onAddReceipt()}
              disabled={actionDisabled}
            >
              {isAddingReceipt && <Loader2 className='mr-2 h-4 w-4 animate-spin' />} Save
            </Button>
            <Button
              variant='default'
              onClick={addInput}
              className='ml-auto'
              disabled={isAddingReceipt}
            >
              <Plus className='mr-2 w-5 h-5' />
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReceiptModal;

import { TextField, Stack, Tooltip, Alert, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import request from '@/axios';
import { Product } from '@/dto/product.dto';
import { useStore } from '@/store/store';
import MyModal from '../myModal/MyModal';
import { Info } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface IProps {
  handleClose: () => void;
  product?: Product;
}

const ProductModal = ({ handleClose, product }: IProps) => {
  const [productInputs, setProductInputs] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
  });
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
    toast({
      description: error?.data?.message ?? 'Something went wrong',
      variant: 'destructive',
    });
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
        setIsLoading(true);
      },
      onSettled: () => {
        setIsLoading(false);
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
      onMutate: () => {
        setIsLoading(true);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    }
  );

  const handleAction = () => {
    if (isEdit && product) {
      editProduct({ ...productInputs, id: product.id });
    } else {
      addProduct(productInputs);
    }
  };

  const resetThenClose = () => {
    setOpen(false);
    handleClose();
    setProductInputs({ name: '', price: 0 });
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          resetThenClose();
        }
      }}
      open={!!product || open}
    >
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button className='uppercase '>
          <Plus className='mr-2 w-5 h-5 ' />
          Product
        </Button>
      </DialogTrigger>
      <DialogContent
        className={
          'w-[var(--dialog-mobile-width)] lg:max-w-[var(--dialog-desktop-width)] rounded-md'
        }
      >
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Product</DialogTitle>
          <DialogDescription className='text-xs'>
            Product name is unique and will be used in receipts, reports, and any other feature. It
            is recommended to use a descriptive name.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-left'>
              Name
            </Label>
            <Input
              id='name'
              className='col-span-3'
              value={productInputs.name}
              onChange={(e) => {
                setProductInputs((prev) => {
                  return { name: e.target.value, price: prev.price };
                });
              }}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='price' className='text-left'>
              Price
            </Label>
            <Input
              id='price'
              className='col-span-3'
              value={productInputs.price}
              onChange={(e) => {
                if (isNaN(+e.target.value) && e.target.value != '.') return;
                setProductInputs((prev) => ({ ...prev, price: +e.target.value }));
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            variant='default'
            onClick={() => {
              handleAction();
            }}
            disabled={!productInputs.name || !productInputs.price || isLoading}
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}{' '}
            {isEdit ? 'Edit' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;

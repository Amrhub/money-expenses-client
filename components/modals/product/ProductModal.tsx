'use client';

import request from '@/app/axios/interceptor';
import { CreateProductDto, ProductClass, UpdateProductDto } from '@/app/axios/openapi';
import StoresAutocompleteInput from '@/components/StoresAutocomplete/StoresAutocomplete';
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
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface IProps {
  handleClose: () => void;
  product?: ProductClass;
}

const ProductModal = ({ handleClose, product }: IProps) => {
  const [productInputs, setProductInputs] = useState<CreateProductDto>({
    name: '',
    price: 0,
    store: undefined,
  });
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (product?.name)
      setProductInputs({ name: product.name, price: product.price, store: product.store });
  }, [product?.name, product?.price, product?.store]);

  const isEdit = product ? true : false;
  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    if (productInputs.store) queryClient.invalidateQueries({ queryKey: ['stores'] });
    // resetThenClose();
  };

  const onError = (error: any) => {
    toast({
      description: error?.data?.message ?? 'Something went wrong',
      variant: 'destructive',
    });
  };

  const { mutate: editProduct } = useMutation({
    mutationFn: (product: UpdateProductDto & { id: number }) =>
      request({
        url: `/products/${product?.id}`,
        method: 'PUT',
        data: {
          name: product.name,
          price: product.price,
          store: product.store || undefined,
        },
      }),
    onSuccess,
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onError,
  });

  const { mutate: addProduct } = useMutation({
    mutationFn: (product: CreateProductDto) =>
      request({
        url: `/products`,
        method: 'POST',
        data: {
          name: product.name,
          price: product.price,
          store: product.store || undefined,
        },
      }),
    onSuccess,
    onError,
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleAction = () => {
    console.log(`🚀 ~ handleAction ~ isEdit:`, isEdit);
    console.log(`🚀 ~ handleAction ~ product:`, product);
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

          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='store' className='text-left'>
              Store
            </Label>
            <StoresAutocompleteInput
              className='col-span-3'
              value={productInputs.store || ''}
              onValueChanges={(value) => {
                setProductInputs((prev) => ({ ...prev, store: value ?? '' }));
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

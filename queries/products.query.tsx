import request from '@/axios';
import { Product } from '@/dto/product.dto';
import { UseBaseQueryOptions, useQuery } from '@tanstack/react-query';
import { OptionsWithoutQuery } from './utils.model';

interface IProductsQuery {
  products: Product[];
  count: number;
}

const fetchProducts = async (options?: OptionsWithoutQuery<IProductsQuery>) => {
  try {
    const res = await request<IProductsQuery>({
      url: '/products',
    });

    const result = res ?? { products: [], count: 0 };
    if (options?.onSuccess) options.onSuccess(result);
    return result;
  } catch (error) {
    if (options?.onError) {
      options.onError(error);
    }
    return { products: [], count: 0 };
  } finally {
    if (options?.onSettled) {
      options.onSettled();
    }
  }
};

const useProductsQuery = (options?: OptionsWithoutQuery<IProductsQuery>) => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(options),
    ...options,
  });
};

export default useProductsQuery;

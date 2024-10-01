import { fetchProducts, IProductsQuery } from '@/app/axios/requests/products';
import { useQuery } from '@tanstack/react-query';
import { OptionsWithoutQuery } from './utils.model';

const useProductsQuery = (options?: OptionsWithoutQuery<IProductsQuery>) => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(options),
    ...options,
  });
};

export default useProductsQuery;

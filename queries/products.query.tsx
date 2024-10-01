import { fetchProducts } from '@/app/axios/requests/products';
import { useQuery } from '@tanstack/react-query';
import { OptionsWithoutQuery } from './utils.model';
import { GetProductsResponseDto } from '@/app/axios/openapi';

const useProductsQuery = (options?: OptionsWithoutQuery<GetProductsResponseDto>) => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(options),
    ...options,
  });
};

export default useProductsQuery;

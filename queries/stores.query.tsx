import { Paths } from '@/app/axios/openapi';
import { fetchUserStores } from '@/app/axios/requests/stores';
import { useQuery } from '@tanstack/react-query';
import { OptionsWithoutQuery } from './utils.model';

const useUserStoresQuery = (
  options?: OptionsWithoutQuery<Paths.ProductsFindAllStores.Responses.$200>
) => {
  return useQuery({
    queryKey: ['stores'],
    queryFn: () => fetchUserStores(options),
    ...options,
  });
};

export default useUserStoresQuery;

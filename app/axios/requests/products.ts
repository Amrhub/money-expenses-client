'use server';

import { Product } from '@/dto/product.dto';
import { OptionsWithoutQuery } from '@/queries/utils.model';
import { client } from '../interceptor';

export interface IProductsQuery {
  products: Product[];
  count: number;
}

export const fetchProducts = async (options?: OptionsWithoutQuery<IProductsQuery>) => {
  try {
    // const client = await getApiClient();
    const res = await client.productsFindAll();

    const result = res.data ?? { products: [], count: 0 };
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

'use server';

import { OptionsWithoutQuery } from '@/queries/utils.model';
import { client } from '../interceptor';
import { GetProductsResponseDto } from '../openapi';

const defaultValue: GetProductsResponseDto = { products: [], count: 0 };

export const fetchProducts = async (options?: OptionsWithoutQuery<GetProductsResponseDto>) => {
  try {
    // const client = await getApiClient();
    const res = await client.productsFindAll();

    const result = res.data ?? defaultValue;
    if (options?.onSuccess) options.onSuccess(result);
    return result;
  } catch (error) {
    if (options?.onError) {
      options.onError(error);
    }
    return defaultValue;
  } finally {
    if (options?.onSettled) {
      options.onSettled();
    }
  }
};

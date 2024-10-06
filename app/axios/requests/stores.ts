'use server';

import { OptionsWithoutQuery } from '@/queries/utils.model';
import { client } from '../interceptor';
import { Paths } from '../openapi';

const defaultValue: string[] = [];

export const fetchUserStores = async (
  options?: OptionsWithoutQuery<Paths.ProductsFindAllStores.Responses.$200>
) => {
  try {
    // const client = await getApiClient();
    const res = await client.productsFindAllStores();

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

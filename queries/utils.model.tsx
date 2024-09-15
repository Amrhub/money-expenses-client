import { UseBaseQueryOptions } from '@tanstack/react-query';

export type OptionsWithoutQuery<T> = Omit<
  UseBaseQueryOptions<T>,
  'queryFn' | 'queryKey' | 'queryHash' | 'queryKeyHashFn'
> & {
  onError?: (e: any) => void;
  onSuccess?: (data: T) => void;
  onSettled?: () => void;
};

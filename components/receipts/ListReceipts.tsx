'use client';

import request from '@/app/axios/interceptor';
import { ReceiptDto } from '@/dto/receipt.dto';
import { Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Receipt from './Receipt';

const ListReceipts = () => {
  const {
    data: receipts,
    isError,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['receipts'],
    queryFn: () => request<ReceiptDto[]>({ url: '/receipts' }),
    gcTime: 1 * 60 * 60 * 1000,
    staleTime: 1 * 60 * 60 * 1000,
  });

  if (isError) {
    console.error(error);
    return <></>;
  }

  return (
    <Grid container gap={1} mt={2}>
      {!!receipts?.length &&
        receipts.map((receipt) => <Receipt receipt={receipt} key={receipt.id} />)}
    </Grid>
  );
};

export default ListReceipts;

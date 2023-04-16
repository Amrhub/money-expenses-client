import request from '@/axios';
import { ReceiptDto } from '@/dto/receipt.dto';
import { useStore } from '@/store/store';
import { Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import Receipt from './Receipt';

const ListReceipts = () => {
  const {
    data: receipts,
    isError,
    error,
  } = useQuery(['receipts'], () => request<ReceiptDto[]>({ url: '/receipts' }), {
    cacheTime: 1 * 60 * 60 * 1000,
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

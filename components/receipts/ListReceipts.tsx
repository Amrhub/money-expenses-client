import request from '@/axios';
import { Receipt } from '@/dto/receipt.dto';
import { useStore } from '@/store/store';
import { Grid, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';

const ListReceipts = () => {
  const {
    data: receipts,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery(['receipts'], () => request<Receipt[]>({ url: '/receipts' }), {
    cacheTime: 1 * 60 * 60 * 1000,
    staleTime: 1 * 60 * 60 * 1000,
  });

  useEffect(() => {
    useStore.setState({ showLoader: isLoading || isFetching });
  }, [isLoading, isFetching]);

  if (isError) {
    console.error(error);
    return <></>;
  }
  const dateFormatter = new Intl.DateTimeFormat();

  return (
    <Grid container gap={1} mt={2}>
      {!!receipts?.length &&
        receipts.map((receipt) => (
          <Grid item direction='row' key={receipt.id} xs={12} lg={3.926} md={5.9}>
            <Paper
              sx={{ width: '100%', p: 1, bgcolor: 'grey.200' }}
              elevation={0}
              component={Stack}
              direction='row'
              justifyContent='space-between'
              alignItems='center'
            >
              <Tooltip title={receipt.name} enterTouchDelay={0} arrow>
                <Typography variant='body1' color='initial' noWrap>
                  {receipt.name}
                </Typography>
              </Tooltip>
              <Typography variant='body2' color='initial'>
                {dateFormatter.format(new Date(receipt.createdAt))}
              </Typography>
            </Paper>
          </Grid>
        ))}
    </Grid>
  );
};

export default ListReceipts;

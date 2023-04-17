import PageTitle from '@/components/pageTitle/PageTitle';
import React, { useEffect, useState, createRef, useRef } from 'react';
import Button from '@mui/material/Button';
import MyModal from '@/components/modals/myModal/MyModal';
import Typography from '@mui/material/Typography';
import {
  Autocomplete,
  TextField,
  Stack,
  Tooltip,
  Divider,
  Zoom,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/dto/product.dto';
import request from '@/axios';
import { useStore } from '@/store/store';
import { motion } from 'framer-motion';
import { InfoOutlined } from '@mui/icons-material';
import ListReceipts from '@/components/receipts/ListReceipts';
import Head from 'next/head';
import AddIcon from '@mui/icons-material/Add';
import ReceiptModal from '@/components/modals/AddReceipt/ReceiptModal';
import SubscriptionsBills from './subscriptions-bills';

const itemsInitialState = [
  {
    name: '',
    price: 0,
    quantity: 0,
  },
];

const Receipts = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Money Expenses | Receipts</title>
      </Head>
      <PageTitle text='Receipts' />
      <Button
        variant='contained'
        startIcon={<AddIcon />}
        onClick={() => {
          setOpen(true);
        }}
      >
        Receipt
      </Button>
      <ReceiptModal open={open} handleClose={() => setOpen(false)} />
      <ListReceipts />
    </>
  );
};

export default Receipts;

// TODO figure out why withPageAuthRequired doesn't work on vercel deployment
// export const getServerSideProps = withPageAuthRequired();

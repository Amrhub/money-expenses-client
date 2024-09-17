'use client';

import ReceiptModal from '@/components/modals/AddReceipt/ReceiptModal';
import PageTitle from '@/components/pageTitle/PageTitle';
import ListReceipts from '@/components/receipts/ListReceipts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Money Expenses | Receipts',
};

const ReceiptsPage = () => {
  return (
    <>
      <PageTitle text='Receipts' />
      <ReceiptModal />
      <ListReceipts />
    </>
  );
};

export default ReceiptsPage;

// TODO figure out why withPageAuthRequired doesn't work on vercel deployment
// export const getServerSideProps = withPageAuthRequired();

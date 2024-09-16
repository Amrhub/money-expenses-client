'use client';

import PageTitle from '@/components/pageTitle/PageTitle';
import ListReceipts from '@/components/receipts/ListReceipts';
import Head from 'next/head';
import ReceiptModal from '@/components/modals/AddReceipt/ReceiptModal';
import { Autocomplete } from '@/components/ui/autocomplete';
import { useState } from 'react';

const itemsInitialState = [
  {
    name: '',
    price: 0,
    quantity: 0,
  },
];

const FRAMEWORKS = [
  {
    value: 'next.js ID',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
  {
    value: 'wordpress',
    label: 'WordPress',
  },
  {
    value: 'express.js',
    label: 'Express.js',
  },
  {
    value: 'nest.js',
    label: 'Nest.js',
  },
];

const ReceiptsPage = () => {
  const [selected, setSelected] = useState<string | null>('');
  return (
    <>
      <Head>
        <title>Money Expenses | Receipts</title>
      </Head>
      <PageTitle text='Receipts' />
      selected: {selected ?? 'null'}
      <Autocomplete
        options={FRAMEWORKS}
        selectedState={{
          selected: selected ?? '',
          setSelected,
        }}
      />
      <ReceiptModal />
      <ListReceipts />
    </>
  );
};

export default ReceiptsPage;

// TODO figure out why withPageAuthRequired doesn't work on vercel deployment
// export const getServerSideProps = withPageAuthRequired();

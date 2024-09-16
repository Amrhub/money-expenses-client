import SubscriptionsBills from '@/components/Subscriptions&Bills/SubscriptionsBills';
import SubscriptionBillModal from '@/components/modals/SubscriptionBillModal/SubscriptionBillModal';
import PageTitle from '@/components/pageTitle/PageTitle';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import React, { useState } from 'react';

const SubscriptionsBillsPage = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageTitle text='Subscriptions & Bills' />
      <Button
        variant='contained'
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{ mb: 4 }}
      >
        Subscription or Bill
      </Button>

      <SubscriptionBillModal open={open} handleClose={() => setOpen(false)} />
      <SubscriptionsBills />
    </>
  );
};

export default SubscriptionsBillsPage;

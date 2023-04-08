import PageTitle from '@/components/pageTitle/PageTitle';
import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import MyModal from '@/components/modals/myModal/MyModal';
import Typography from '@mui/material/Typography';

const Receipts = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageTitle text='Receipts' />
      <Button
        variant='contained'
        startIcon={<AddIcon />}
        onClick={() => {
          setOpen(true);
        }}
      >
        Add Receipt
      </Button>
      <MyModal
        title='Add Receipts'
        handleClose={() => {
          setOpen(false);
        }}
        open={open}
      >
        <Typography variant='body2'>Under construction 🚧</Typography>
      </MyModal>
    </>
  );
};

export default Receipts;

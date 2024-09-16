'use client';

import React from 'react';
import MyModal from '../myModal/MyModal';
import { FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

interface IProps {
  open: boolean;
  handleClose: () => void;
}

const billInitialState = {
  name: '',
  amount: 0,
  frequency: 'ONCE',
  paymentDate: dayjs(),
};

const SubscriptionBillModal = ({ open, handleClose }: IProps) => {
  const [bill, setBill] = React.useState(billInitialState);

  const onClose = () => {
    setBill(billInitialState);
    handleClose();
  };

  return (
    <MyModal open={open} handleClose={onClose} title='Add a Subscription or Bill'>
      <Stack gap={2} component={motion.div} layout='size'>
        <TextField
          label='Name'
          variant='outlined'
          fullWidth
          value={bill.name}
          onChange={(e) => setBill({ ...bill, name: e.target.value })}
        />
        <TextField
          label='Amount'
          variant='outlined'
          fullWidth
          value={bill.amount || ''}
          inputProps={{ type: 'number', inputMode: 'numeric', pattern: '[0-9]*' }}
          onChange={(e) => {
            if (isNaN(+e.target.value) && e.target.value != '.') return;
            setBill({ ...bill, amount: +e.target.value });
          }}
        />
        <FormControl fullWidth>
          <InputLabel id='frequency'>Frequency</InputLabel>
          <Select
            labelId='frequency'
            label='Frequency'
            variant='outlined'
            value={bill.frequency}
            onChange={(e) => {
              setBill({ ...bill, frequency: e.target.value as any });
            }}
          >
            <MenuItem value='ONCE'>Once</MenuItem>
            <MenuItem value='MONTHLY'>Monthly</MenuItem>
            <MenuItem value='YEARLY'>Annually</MenuItem>
          </Select>
        </FormControl>
        {bill.frequency !== 'ONCE' && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Payment date'
              views={['day']}
              value={bill.paymentDate}
              shouldDisableYear={(year: any) => {
                if (!year) return false;
                if (!('$y' in year)) return false;
                return new Date().getFullYear() != year.$y;
              }}
              format='DD/MM/YYYY'
            />
          </LocalizationProvider>
        )}
      </Stack>
    </MyModal>
  );
};

export default SubscriptionBillModal;

'use client';

import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { Receipt } from '@mui/icons-material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { AnimatePresence, motion } from 'framer-motion';

const SubscriptionsBills = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <Tabs value={tabIndex} onChange={(_e, index) => setTabIndex(index)} variant='fullWidth'>
        <Tab icon={<ReceiptLongIcon />} label='Subscriptions' {...a11yProps(0)} />
        <Tab icon={<Receipt />} label='Bills' {...a11yProps(1)} />
      </Tabs>

      <AnimatePresence mode='wait'>
        <motion.div
          key={tabIndex}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3, type: 'spring' }}
        >
          <TabPanel value={tabIndex} index={0}>
            <Typography variant='h3'>Subscriptions</Typography>
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <Typography variant='h3'>Bills</Typography>
          </TabPanel>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default SubscriptionsBills;

export function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  dir?: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

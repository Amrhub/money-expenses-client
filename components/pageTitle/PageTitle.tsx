import React from 'react';
import { Typography, Divider } from '@mui/material';
import { Separator } from '../ui/separator';

interface IProps {
  text: string;
}

const PageTitle = ({ text }: IProps) => {
  return (
    <>
      <h5 className='text-xl font-medium'>{text}</h5>
      {/* <Divider
        sx={{
          width: 10,
          height: 0.5,
          backgroundColor: 'primary.main',
          mb: 4,
        }}
        classes={{ root: 'custom-hr' }}
      /> */}
      <Separator className='w-12 h-1 mb-4 bg-primary rounded-md' />
    </>
  );
};

export default PageTitle;

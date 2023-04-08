import React from 'react';
import { Typography, Divider } from '@mui/material';

interface IProps {
  text: string;
}

const PageTitle = ({ text }: IProps) => {
  return (
    <>
      <Typography variant='h5'>{text}</Typography>
      <Divider
        sx={{
          width: 10,
          height: 0.5,
          backgroundColor: 'primary.main',
          mb: 4,
        }}
        classes={{ root: 'custom-hr' }}
      />
    </>
  );
};

export default PageTitle;

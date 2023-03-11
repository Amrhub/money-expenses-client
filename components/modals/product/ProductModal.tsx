import { Modal, Paper, styled, Typography, IconButton, Input, TextField } from '@mui/material';
import React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Grow from '@mui/material/Grow/Grow';

interface IProps {
  open: boolean;
  handleClose: () => void;
  product?: {
    id: number;
    name: string;
    price: number;
  };
}

const ModalHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBlock: theme.spacing(1.5),
  paddingInline: theme.spacing(2),
  paddingLeft: theme.spacing(2.5),
  paddingRight: '18px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));
const ModalBody = styled('div')(({ theme }) => ({
  paddingBlock: theme.spacing(4),
  paddingInline: theme.spacing(2.5),
}));
const ModalFooter = styled('div')(({ theme }) => ({}));

const ProductModal = ({ open, handleClose, product }: IProps) => {
  const isEdit = product ? true : false;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      disableRestoreFocus
      closeAfterTransition
    >
      {/* <Grow in={open}> */}
      <Paper sx={{ borderRadius: 1, width: '500px', m: 'auto', overflow: 'hidden' }}>
        <ModalHeader>
          <Typography variant='h6'>{isEdit ? 'Edit Product' : 'Add Product'}</Typography>
          <IconButton aria-label='close-modal' onClick={handleClose} sx={{ color: 'white' }}>
            <CancelIcon color='inherit' />
          </IconButton>
        </ModalHeader>
        <ModalBody>
          <Stack spacing={1} direction='column' marginBottom={4}>
            <label htmlFor='product-name'>Product Name</label>
            <TextField id='product-name' variant='outlined' defaultValue={product?.name} />
          </Stack>
          <Stack spacing={1} direction='column'>
            <label htmlFor='product-name'>Price</label>
            <TextField id='product-name' variant='outlined' defaultValue={product?.price} />
          </Stack>
        </ModalBody>
        <Divider />
        <ModalFooter>
          <Stack
            direction='row'
            justifyContent='flex-end'
            alignItems='center'
            px={2.5}
            py={3}
            color='rgba(0, 0, 0, 0.6)'
          >
            <Button
              variant='outlined'
              color='inherit'
              sx={{ width: '100px', marginRight: 1.5 }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button variant='contained' sx={{ width: '100px' }}>
              {isEdit ? 'Save' : 'Add'}
            </Button>
          </Stack>
        </ModalFooter>
      </Paper>
      {/* </Grow> */}
    </Modal>
  );
};

export default ProductModal;

import { useStore } from '@/store/store';
import { Box, CircularProgress, Modal } from '@mui/material';
import React from 'react';

const LoaderModal = () => {
  const showLoader = useStore((state) => state.showLoader);
  return (
    <Modal
      open={showLoader}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
      disableAutoFocus
    >
      <CircularProgress size={80} />
    </Modal>
  );
};

export default LoaderModal;

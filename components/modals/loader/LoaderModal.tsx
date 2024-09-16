'use client';

import { useStore } from '@/store/store';
import { CircularProgress, Modal } from '@mui/material';

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

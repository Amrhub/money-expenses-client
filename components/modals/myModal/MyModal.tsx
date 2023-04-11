import {
  Modal,
  Paper,
  styled,
  Typography,
  IconButton,
  Divider,
  Stack,
  Button,
} from '@mui/material';
import React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';

interface IProps {
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode;
  title: string;
  handleAction?: () => void;
  actionText?: string;
  actionDisabled?: boolean;
  desktopWidth?: number;
  mobileWidth?: number;
}

export const ModalHeader = styled('div')(({ theme }) => ({
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
export const ModalBody = styled('div')(({ theme }) => ({
  paddingBlock: theme.spacing(4),
  paddingInline: theme.spacing(2.5),
  maxHeight: '500px',
  overflowY: 'auto',
}));
export const ModalFooter = styled('div')(({ theme }) => ({}));

const MyModal = ({
  handleClose,
  open,
  children,
  title,
  handleAction,
  actionText,
  actionDisabled,
  desktopWidth = 500,
  mobileWidth = 350,
}: IProps) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      disableRestoreFocus
      keepMounted={false}
    >
      <Paper
        sx={{
          borderRadius: 1,
          width: { xs: `${mobileWidth}px`, sm: `${desktopWidth}px` },
          m: 'auto',
          overflow: 'hidden',
        }}
      >
        <ModalHeader>
          <Typography variant='h6'>{title}</Typography>
          <IconButton aria-label='close-modal' onClick={handleClose} sx={{ color: 'white' }}>
            <CancelIcon color='inherit' />
          </IconButton>
        </ModalHeader>
        <ModalBody className='modal-body'>{children}</ModalBody>

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
            {actionText && handleAction && (
              <Button
                variant='contained'
                sx={{ width: '100px' }}
                onClick={handleAction}
                disabled={actionDisabled}
              >
                {actionText}
              </Button>
            )}
          </Stack>
        </ModalFooter>
      </Paper>
    </Modal>
  );
};

export default MyModal;

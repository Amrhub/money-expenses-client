import React from 'react';
import MyModal from '../myModal/MyModal';

interface IProps {
  open: boolean;
  handleClose: () => void;
}

const SubscriptionBillModal = ({ open, handleClose }: IProps) => {
  return (
    <MyModal open={open} handleClose={handleClose} title='Add a Subscription or Bill'>
      <div>SubscriptionBillModal</div>
    </MyModal>
  );
};

export default SubscriptionBillModal;

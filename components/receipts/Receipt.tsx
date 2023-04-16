import { ReceiptDto } from '@/dto/receipt.dto';
import { useScrollConstraints } from '@/utils/use-scroll-constraints';
import {
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { ResolvedValues, motion, useMotionValue } from 'framer-motion';
import React, { useRef } from 'react';
import { drawerWidth } from '../Sidebar/Sidebar';

interface IProps {
  receipt: ReceiptDto;
}

const openSpring = { type: 'spring', stiffness: 200, damping: 30 };
const closeSpring = { type: 'spring', stiffness: 300, damping: 35 };
const distanceToDismiss = 100;

const receiptTotal = (receipt: ReceiptDto) => {
  return receipt.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

const Receipt = ({ receipt }: IProps) => {
  const [isSelected, setIsSelected] = React.useState(false);

  const zIndex = useMotionValue(isSelected ? 2 : 0);

  const cardRef = useRef(null);
  const constraints = useScrollConstraints(cardRef, isSelected);

  function checkZIndex(latest: ResolvedValues) {
    if (isSelected) {
      zIndex.set(2);
    } else if (!isSelected && +latest.scaleX < 1.01) {
      zIndex.set(0);
    }
    if (+latest.y > distanceToDismiss) setTimeout(() => setIsSelected(false), 300);
  }

  const containerRef = useRef(null);

  return (
    <Grid item xs={12} lg={3.926} md={5.9} component={motion.div} ref={containerRef}>
      <Overlay
        isSelected={isSelected}
        removeSelection={() => {
          setIsSelected(false);
        }}
      />
      <div className={`receipt-container ${isSelected && 'open'}`} style={{ left: drawerWidth }}>
        <Paper
          sx={{
            width: '100%',
            p: 1,
            bgcolor: 'grey.200',
          }}
          className='receipt'
          elevation={0}
          component={motion.div}
          onClick={() => setIsSelected(true)}
          layout
          transition={{ layout: isSelected ? openSpring : closeSpring }}
          ref={cardRef}
          drag={isSelected ? 'y' : false}
          dragConstraints={constraints}
          onUpdate={checkZIndex}
        >
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            component={motion.div}
            layout='preserve-aspect'
          >
            <Tooltip title={receipt.name} enterTouchDelay={200} arrow>
              <Typography variant='body1' color='initial' noWrap>
                {receipt.name}
              </Typography>
            </Tooltip>
            <Typography variant='body2' color='initial'>
              {new Intl.DateTimeFormat().format(new Date(receipt.createdAt))}
            </Typography>
          </Stack>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Sum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receipt.items.map((item, index) => (
                <TableRow key={`${receipt.id}-${receipt.name}-${index}`}>
                  <TableCell align='center'>
                    <Tooltip title={item.name} enterTouchDelay={0} arrow>
                      <Typography variant='body2' color='inherit' noWrap>
                        {item.name}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align='center'>{item.price}</TableCell>
                  <TableCell align='center'>{item.quantity}</TableCell>
                  <TableCell align='center'>{item.price * item.quantity}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} />
                <TableCell colSpan={1} align='center'>
                  Total
                </TableCell>
                <TableCell align='center'>
                  {new Intl.NumberFormat().format(receiptTotal(receipt))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </div>
    </Grid>
  );
};

export default Receipt;

function Overlay({
  isSelected,
  removeSelection,
}: {
  isSelected: boolean;
  removeSelection: () => void;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: isSelected ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      style={{ pointerEvents: isSelected ? 'auto' : 'none' }}
      className='overlay'
    >
      <button onClick={() => removeSelection()}></button>
    </motion.div>
  );
}

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
import { purple } from '@mui/material/colors';

interface IProps {
  receipt: ReceiptDto;
}

const openSpring = { type: 'spring', stiffness: 200, damping: 30 };
const closeSpring = { type: 'spring', stiffness: 300, damping: 35 };
const distanceToDismiss = 100;

const receiptTotal = (receipt: ReceiptDto) => {
  return receipt.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

const borderColorPalette = ['#22185c', '#312283', '#6043ff', '#312283'];
let borderColorIndex = 0;

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
    <Grid
      item
      xs={12}
      lg={3.926}
      md={5.9}
      component={motion.div}
      ref={containerRef}
      sx={{ position: 'relative' }}
    >
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
            bgcolor: isSelected ? 'grey.200' : 'secondary.main',
            color: isSelected ? 'grey.900' : 'grey.100',
            borderRadius: '40000px',
            '&:hover': {
              boxShadow: !isSelected ? 12 : 0,
            },
          }}
          className='receipt'
          elevation={0}
          component={motion.div}
          onClick={() => {
            (cardRef.current as any).style.position = 'relative';
            setIsSelected(true);
          }}
          layout
          transition={{ layout: isSelected ? openSpring : closeSpring }}
          ref={cardRef}
          drag={isSelected ? 'y' : false}
          dragConstraints={constraints}
          onUpdate={checkZIndex}
          whileHover={{ height: 65, scale: 1.03, zIndex: 12 }}
          onHoverStart={() => {
            if (!(cardRef.current as any)?.style || isSelected) return;
            (cardRef.current as any).style.position = 'absolute';
          }}
          onHoverEnd={() => {
            setTimeout(() => {
              if (!(cardRef.current as any)?.style || isSelected) return;
              (cardRef.current as any).style.position = 'relative';
            }, 250);
          }}
          {...(isSelected && { whileHover: { height: 'auto', scale: 1 } })}
        >
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            component={motion.div}
            layout='preserve-aspect'
            color={isSelected ? 'secondary.dark' : 'inherit'}
            fontWeight={isSelected ? '400' : 'inherit'}
            fontFamily={isSelected ? 'Brush Script MT,cursive' : 'inherit'}
          >
            <Tooltip title={receipt.name} enterTouchDelay={200} arrow>
              <Typography
                variant='body1'
                noWrap
                sx={{ color: 'inherit', fontWeight: 'inherit', fontFamily: 'inherit' }}
              >
                {receipt.name}
              </Typography>
            </Tooltip>
            <Typography variant='body2' color='inherit'>
              {new Intl.DateTimeFormat().format(new Date(receipt.createdAt))}
            </Typography>
          </Stack>
          {!isSelected && (
            <Typography align='center' mt={1}>
              Receipt Total: {new Intl.NumberFormat().format(receiptTotal(receipt))} L.E
            </Typography>
          )}
          <Table sx={{ color: 'inherit' }} className='receipt-table'>
            <TableHead>
              <TableRow
                sx={{
                  borderColor: 'secondary.main',
                }}
              >
                <TableCell align='center' sx={{ color: 'secondary.main', fontWeight: '900' }}>
                  Item
                </TableCell>
                <TableCell align='center' sx={{ color: 'secondary.main', fontWeight: '900' }}>
                  Price
                </TableCell>
                <TableCell align='center' sx={{ color: 'secondary.main', fontWeight: '900' }}>
                  Quantity
                </TableCell>
                <TableCell align='center' sx={{ color: 'secondary.main', fontWeight: '900' }}>
                  Sum
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receipt.items.map((item, index) => {
                const borderColor = borderColorPalette[borderColorIndex];
                borderColorIndex =
                  borderColorIndex === borderColorPalette.length - 1 ? 0 : borderColorIndex + 1;
                return (
                  <TableRow
                    key={`${receipt.id}-${receipt.name}-${index}`}
                    hover
                    component={motion.tr}
                    whileHover={{ scale: 1.025 }}
                    sx={{ borderColor }}
                  >
                    <TableCell align='center' sx={{ color: 'inherit' }}>
                      <Tooltip title={item.name} enterTouchDelay={0} arrow>
                        <Typography variant='body2' color='inherit' noWrap>
                          {item.name}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align='center' sx={{ color: 'inherit' }}>
                      {item.price}
                    </TableCell>
                    <TableCell align='center' sx={{ color: 'inherit' }}>
                      {item.quantity}
                    </TableCell>
                    <TableCell align='center' sx={{ color: 'inherit' }}>
                      {item.price * item.quantity}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={2} />
                <TableCell colSpan={1} align='center' sx={{ color: 'inherit' }}>
                  Total
                </TableCell>
                <TableCell align='center' sx={{ color: 'inherit' }}>
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

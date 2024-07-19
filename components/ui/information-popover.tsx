import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Info } from 'lucide-react';

interface IProps {
  message: string;
}

const InformationPopover = ({ message }: IProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='default' className='p-1 h-auto rounded-full'>
          <Info className='h-3 w-3' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='max-w-96 py-1 px-2 text-wrap'>{message}</PopoverContent>
    </Popover>
  );
};

export default InformationPopover;

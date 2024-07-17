import Image from 'next/image';
import React from 'react';

const Logo = () => {
  return (
    <div className='inline-flex items-center gap-4'>
      <Image src='/logo.svg' width={36} height={32} alt='logo' />
      <h6 className='text-lg font-semibold'>Money Expenses</h6>
    </div>
  );
};

export default Logo;

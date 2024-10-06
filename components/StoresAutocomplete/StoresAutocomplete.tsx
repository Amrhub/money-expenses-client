import useUserStoresQuery from '@/queries/stores.query';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Autocomplete } from '../ui/autocomplete';
import { Components, CreateProductDto } from '@/app/axios/openapi';

interface IProps {
  productInputs: Components.Schemas.CreateProductDto;
  setProductInputs: Dispatch<SetStateAction<Components.Schemas.CreateProductDto>>;
}

const StoresAutocompleteInput = ({ productInputs, setProductInputs }: IProps) => {
  const { data: stores } = useUserStoresQuery();

  return (
    <Autocomplete
      className='col-span-3'
      value={productInputs.store ?? ''}
      onChange={(value) => {
        setProductInputs((prev) => ({ ...prev, store: value ?? '' }));
      }}
      options={stores ? stores.map((store) => ({ label: store, value: store })) : []}
      placeholder='Store (Optional)'
    />
  );
};

export default StoresAutocompleteInput;

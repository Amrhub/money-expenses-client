'use client';

import useUserStoresQuery from '@/queries/stores.query';
import { Autocomplete } from '../ui/autocomplete';

interface IProps {
  value: string;
  onValueChanges: (value: string | null) => void;
  className?: string;
}

const StoresAutocompleteInput = ({ value, onValueChanges, className }: IProps) => {
  const { data: stores } = useUserStoresQuery();

  return (
    <Autocomplete
      value={value}
      className={className}
      onChange={onValueChanges}
      options={stores ? stores.map((store) => ({ label: store, value: store })) : []}
      placeholder='Store (Optional)'
    />
  );
};

export default StoresAutocompleteInput;

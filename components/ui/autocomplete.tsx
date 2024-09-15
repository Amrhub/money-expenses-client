'use client';

import * as React from 'react';

import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';
import { Check } from 'lucide-react';

interface IProps<ValueType> {
  options: Array<{
    value: ValueType;
    label: string;
  }>;

  /**
   * The selected value of the autocomplete it can be user input not just the options
   */
  selectedState: {
    selected: ValueType;
    setSelected: React.Dispatch<React.SetStateAction<ValueType | null>>;
  };
}

export function Autocomplete<ValueType extends string | number>({
  options,
  selectedState: { selected, setSelected },
}: IProps<ValueType>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  // This timeout is to handle when user clicks on list item to prevent onBlur from setting the search value instead of the selected value
  // e.g. if user typed "nex" and clicked on "Next.js" the input value should be "Next.js" not "nex"
  const handleCustomUserInputTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        switch (e.key) {
          case 'Delete':
          case 'Backspace':
            if (input.value === '') {
              setSelected(null);
            }
            break;
          case 'Escape':
          case 'Enter':
            input.blur();
            break;
        }
      }
    },
    [setSelected]
  );

  const onBlur = () => {
    setOpen(false);

    // handle if the user input is not in the options list
    handleCustomUserInputTimeoutRef.current = setTimeout(() => {
      if (
        inputValue.length > 0 &&
        !(selected && options.find((option) => option.value === selected))
      ) {
        setSelected(inputValue as ValueType);
      }
    });
  };

  const onOptionSelect = (option: (typeof options)[number]) => {
    setInputValue('');
    setSelected(option.value);
    inputRef.current?.blur();
    handleCustomUserInputTimeoutRef.current &&
      clearTimeout(handleCustomUserInputTimeoutRef.current);
  };

  const selectedLabel = options.find((option) => option.value === selected)?.label;
  return (
    <Command onKeyDown={handleKeyDown} className='overflow-visible bg-transparent'>
      <div className='group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'>
        <div className='flex flex-wrap gap-1'>
          {selectedLabel}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={(value) => {
              setInputValue(value);
              setSelected(null);
            }}
            onBlur={onBlur}
            onFocus={() => setOpen(true)}
            placeholder={selectedLabel ? '' : 'Search'}
            className='ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground'
          />
        </div>
      </div>
      <div className='relative mt-2'>
        <CommandList>
          {open && options.length > 0 ? (
            <div className='absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in'>
              <CommandGroup className='h-full overflow-auto'>
                {options.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => onOptionSelect(option)}
                      className='cursor-pointer'
                    >
                      {selected === option.value ? (
                        <Check className='mr-2 h-4 w-4 text-green-600' />
                      ) : (
                        <span className='mr-6' />
                      )}
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}

import React from 'react';
import { Input } from '../ui/input';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/utils';

type Props = {
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  className?: string;
};

function ClearInput({ placeholder, value, setValue, className = '' }: Props) {
  const handleClear = () => {
    setValue('');
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder || ''}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(
          'pr-10 border-gray-300 focus:border-primary focus:ring-primary w-[220px]',
          className
        )}
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
          onClick={handleClear}
        >
          <X className="h-6 w-6 text-gray-500" />
        </Button>
      )}
    </div>
  );
}

export default ClearInput;

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface Option {
  id: string;
  name: string;
}

interface AddSelectProps {
  options: Option[];
  activeFilters: string[];
  onChange: (selected: string[]) => void;
}

export default function AddSelect({ options, activeFilters, onChange }: AddSelectProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (id: string) => {
    let newSelected = [...activeFilters];
    if (newSelected.includes(id)) {
      newSelected = newSelected.filter((v) => v !== id);
    } else {
      newSelected.push(id);
    }
    onChange(newSelected);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          className="w-24 gap-2 justify-between hover:bg-primary/80 text-white bg-primary"
        >
          <Plus /> <span>Add</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[180px] p-2 bg-popover text-popover-foreground" align="start">
        <div className="overflow-y-auto space-y-1">
          <div className="flex items-center justify-between rounded px-2 py-1">
            <span className="font-bold whitespace-nowrap">Add Filter</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded hover:bg-background hover:text-accent-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {options.map((opt) => (
            <div
              key={opt.id}
              className={`flex items-center justify-between rounded px-2 py-1 cursor-pointer transition-colors ${
                activeFilters.includes(opt.id)
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-background hover:text-accent-foreground'
              }`}
              onClick={() => handleSelect(opt.id)}
            >
              <span>{opt.name}</span>
              {activeFilters.includes(opt.id) && <X size={16} className="text-muted-foreground" />}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
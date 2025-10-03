'use client';

import React, { useState, useMemo, ChangeEvent } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface MultiSelectProps {
  options: string[];
  placeholder?: string;
  onChange?: (selected: string[]) => void;
  multiple?: boolean; // single-select by default
}

export default function MultiSelect({
  options,
  placeholder = 'Select...',
  onChange,
  multiple = false,
}: MultiSelectProps): JSX.Element {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');

  const filteredOptions = useMemo<string[]>(() => {
    return options.filter((opt) => opt.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  // const handleSelect = (value: string): void => {
  //   if (multiple) {
  //     if (value === 'All') {
  //       if (selected.includes('All')) {
  //         setSelected([]);
  //         onChange?.([]);
  //       } else {
  //         const newSelected = ['All', ...options];
  //         setSelected(newSelected);
  //         onChange?.(newSelected);
  //       }
  //       return;
  //     }

  //     let newSelected: string[] = [...selected];
  //     if (newSelected.includes(value)) {
  //       newSelected = newSelected.filter((v) => v !== value && v !== 'All');
  //     } else {
  //       newSelected = [...newSelected.filter((v) => v !== 'All'), value];
  //     }

  //     setSelected(newSelected);
  //     onChange?.(newSelected);
  //   } else {
  //     const newSelected: string[] = [value];
  //     setSelected(newSelected);
  //     onChange?.(newSelected);
  //   }
  // };

  const handleSelect = (value: string): void => {
    if (multiple) {
      if (value === 'All') {
        // If already all selected → clear everything
        if (selected.length === options.length) {
          setSelected([]);
          onChange?.([]);
        } else {
          // Otherwise select all
          setSelected(options);
          onChange?.([]);
        }
        return;
      }

      let newSelected: string[] = [...selected];
      if (newSelected.includes(value)) {
        newSelected = newSelected.filter((v) => v !== value);
      } else {
        newSelected.push(value);
      }

      // If all manually selected → send []
      if (newSelected.length === options.length) {
        setSelected(options);
        onChange?.([]);
      } else {
        setSelected(newSelected);
        onChange?.(newSelected);
      }
    } else {
      const newSelected: string[] = [value];
      setSelected(newSelected);
      onChange?.(newSelected);
    }
  };

  const removeTag = (value: string): void => {
    const newSelected = selected.filter((v) => v !== value && v !== 'All');
    setSelected(newSelected);
    onChange?.(newSelected);
  };

  const clearSelection = (): void => {
    setSelected([]);
    onChange?.([]);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="min-w-[250px] w-auto max-w-lg justify-between bg-background hover:bg-background text-foreground"
        >
          <div className="flex gap-1 items-center whitespace-nowrap overflow-x-auto minimal-scrollbar">
            {selected.length > 0 ? (
              multiple ? (
                <div className="flex items-center gap-1 rounded px-2 py-0.5 text-sm text-white bg-primary">
                  <span>{selected[0]}</span>
                  {selected.length > 1 && (
                    <span className="ml-1 text-xs text-white">+{selected.length - 1}</span>
                  )}
                  <X
                    className="h-3 w-3 cursor-pointer ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelection();
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-1 rounded px-2 py-0.5 text-sm text-white bg-primary">
                  <span className="text-sm">{selected[0]}</span>
                  <X
                    className="h-4 w-4 cursor-pointer opacity-70 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelection();
                    }}
                  />
                </div>
              )
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto min-w-[250px] p-2 bg-popover text-popover-foreground"
        align="start"
      >
        <Input
          placeholder="Search"
          value={search}
          onChange={handleSearchChange}
          className="mb-2 bg-transparent text-foreground outline-none focus:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none"
        />

        <div className="max-h-48 overflow-y-auto space-y-1">
          {/* "All" option only for multi-select */}
          {multiple && (
            <div
              className="flex items-center gap-2 rounded px-2 py-1 cursor-pointer hover:bg-background hover:text-accent-foreground transition-colors"
              onClick={() => handleSelect('All')}
            >
              <Checkbox checked={selected.includes('All')} />
              <span className="text-sm">All</span>
            </div>
          )}

          {/* Other options */}
          {filteredOptions.map((opt) => (
            <div
              key={opt}
              className="flex items-center gap-2 rounded px-2 py-1 cursor-pointer hover:bg-background hover:text-accent-foreground transition-colors"
              onClick={() => handleSelect(opt)}
            >
              <Checkbox checked={selected.includes(opt)} /> {/* always visible */}
              <span className="text-sm">{opt}</span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

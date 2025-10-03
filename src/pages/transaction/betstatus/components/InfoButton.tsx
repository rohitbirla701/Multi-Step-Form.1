import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface InfoButtonProps {
  onOptionClick: (option: string) => void;
}

const InfoButton: React.FC<InfoButtonProps> = ({ onOptionClick }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" className="bg-primary hover:bg-primary/80 text-white px-3 py-1.5 text-sm">
          <Menu className="w-4 h-4 mr-1 text-white" />
          Info
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="start">
        <div className="space-y-1">
          <button
            onClick={() => onOptionClick('Transaction Logs')}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
          >
            Transaction Logs
          </button>
          <button
            onClick={() => onOptionClick('View Details')}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
          >
            View Details
          </button>
          <button
            onClick={() => onOptionClick('Export Data')}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
          >
            Export Data
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InfoButton;

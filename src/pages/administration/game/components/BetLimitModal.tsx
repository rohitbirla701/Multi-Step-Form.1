import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

type BetLimitModalProps = {
  open: boolean;
  onClose: (open: boolean) => void;
  onSubmit: (values: { min: number; max: number }) => void;
};

export function BetLimitModal({ open, onClose, onSubmit }: BetLimitModalProps) {
  const [min, setMin] = useState<number>(0);
  const [max, setMax] = useState<number>(0);

  const handleSubmit = () => {
    onSubmit({ min, max });
    onClose(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay className="fixed inset-100 bg-black/50 z-0" />

        {/* Custom Content */}
        <div className="fixed left-1/2 top-1/2 max-w-[624px] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lg focus:outline-none">
          {/* Header */}
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-lg font-medium text-gray-900">Crash X/Bet Limit</h2>
            <button
              onClick={() => onClose(false)}
              className="rounded-md p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Min*</label>
              <Input
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Max*</label>
              <Input
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-row gap-4 pt-4">
            <Button variant="destructive" onClick={() => onClose(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-primary hover:bg-primary/80 text-white"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

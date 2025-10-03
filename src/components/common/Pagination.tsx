  // components/Pagination.tsx
  import { ChevronLeft, ChevronRight } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  } from '@/components/ui/select';

  interface PaginationProps {
    pageSize: number;
    pageIndex: number;
    pageCount: number;
    totalItems: number;
    onNextPage: () => void;
    onPreviousPage: () => void;
    canPreviousPage: boolean;
    canNextPage: boolean;
    setPageSize: (size: number) => void;
  }

  export const Pagination = ({
    pageSize,
    setPageSize,
    pageIndex,
    pageCount,
    totalItems,
    onNextPage,
    onPreviousPage,
    canPreviousPage,
    canNextPage,
  }: PaginationProps) => {
    const start = pageIndex * pageSize + 1;
    const end = Math.min((pageIndex + 1) * pageSize, totalItems);
    return (
      <div className="grid justify-center sm:flex items-center sm:justify-start gap-6 lg:space-x-8">
        {/* Page size selector */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Items per page</p>
          <Select value={`${pageSize}`} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Range display */}
        <div className="flex items-center justify-center text-sm font-medium mx-auto">
          {totalItems === 0 ? '0 results' : `${start} – ${end} of ${totalItems}`}
        </div>

        {/* Prev/Next buttons */}
        <div className="flex items-center space-x-2 justify-center">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={onPreviousPage}
            disabled={!canPreviousPage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={onNextPage}
            disabled={!canNextPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type TruncateTextProps = {
  text: string;
  maxLength?: number;
  className?: string;
};

const TruncateText: React.FC<TruncateTextProps> = ({ text, maxLength = 16, className }) => {
  if (!text) return null;

  const shouldTruncate = text.length > maxLength;
  const truncated = shouldTruncate ? text.slice(0, maxLength) + '...' : text;

  if (!shouldTruncate) {
    return <span className={className}>{text}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`cursor-pointer ${className}`}>{truncated}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TruncateText;

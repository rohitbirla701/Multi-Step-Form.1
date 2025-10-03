import React from 'react';

interface RenderIconProps {
  src: string; // required
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function RenderIcon({ src, alt, width, height, className }: RenderIconProps) {
  return <img src={src} alt={alt || 'icon'} width={width} height={height} className={className} />;
}

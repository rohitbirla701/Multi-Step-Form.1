// utils/loadable.tsx
import React, { Suspense } from 'react';
import { Loading } from '@/components/common/Loader';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

interface Options {
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export default function loadable<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  { fallback = <Loading />, errorFallback, onError }: Options = {}
) {
  const LazyComponent = React.lazy(importFunc);

  return (props: React.ComponentProps<T>) => (
    <ErrorBoundary fallback={errorFallback} onError={onError}>
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

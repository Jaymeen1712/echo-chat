import React, { ComponentType, Suspense } from "react";

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Default loading spinner component
const DefaultSpinner = () => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-primary border-t-transparent"></div>
  </div>
);

// Lazy wrapper component for suspense boundaries
const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback = <DefaultSpinner />,
}) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

// HOC for lazy loading components
export const withLazyLoading = <P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode,
) => {
  const LazyComponent = React.forwardRef<any, P>((props, ref) => (
    <LazyWrapper fallback={fallback}>
      <Component {...(props as any)} ref={ref} />
    </LazyWrapper>
  ));

  LazyComponent.displayName = `LazyLoaded(${Component.displayName || Component.name})`;

  return LazyComponent;
};

export default LazyWrapper;

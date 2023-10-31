
'use client'
import React, { useState, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const [state, setState] = useState<State>({ hasError: false });

  useEffect(() => {
    // You can set up any side effects or error handling logic here
  }, []);

  if (state.hasError) {
    // You can render any fallback UI here
    return <h1>Something went wrong.</h1>;
  }

  return children;
};

export default ErrorBoundary;

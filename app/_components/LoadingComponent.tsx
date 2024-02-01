import { CircularProgress } from '@nextui-org/react';
import React from 'react';

export default function LoadingComponent() {
  return (
    <div className="flex justify-center my-10">
      <CircularProgress size="sm" />
    </div>
  );
}

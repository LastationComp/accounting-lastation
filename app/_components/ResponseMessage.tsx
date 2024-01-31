import React from 'react';

interface MessageType {
  type: 'success' | 'error';
  children?: React.ReactNode;
  message?: string;
}
export default function ResponseMsg({ type = 'success', message, children }: MessageType) {
  return <span className={(type === 'success' ? 'bg-green-600' : 'bg-red-600') + ' px-3 py-2 rounded w-full text-white'}>{message ?? children}</span>;
}

import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Blog',
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <main className='max-w-7xl mx-auto px-4 lg:px-0 mb-24'>
        {children}
      </main>
  );
}

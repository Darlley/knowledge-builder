import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Blog',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full min-h-svh dark:bg-gray-950">
      <main className="max-w-7xl mx-auto px-4 lg:px-0 ">{children}</main>
    </div>
  );
}

import React from 'react';
import ReduxProvider from '@/redux/provider';
import HeaderNav from '@/components/HeaderNav';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technical Test PymeDesk',
  description: 'Technical Test PymeDesk',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="description" content={metadata.description?.toString()} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>{metadata.title?.toString()}</title>
      </head>
      <body>
        <ReduxProvider>
          <HeaderNav />
          <main>{children}</main>
        </ReduxProvider>

      </body>
    </html>
  );
}

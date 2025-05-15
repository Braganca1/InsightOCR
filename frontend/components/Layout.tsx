import React from 'react';
import Head from 'next/head';

type LayoutProps = {
  title?: string;
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children, title }) => (
  <>
    <Head>
      <title>{title ? `${title} - Paggo OCR` : 'Paggo OCR'}</title>
      <meta name="description" content="Invoice OCR and Chat" />
    </Head>
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </main>
  </>
);

export default Layout;
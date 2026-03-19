import React from 'react';
import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from './ui/sonner';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
};
